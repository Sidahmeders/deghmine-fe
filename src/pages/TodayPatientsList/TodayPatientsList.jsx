import { useEffect, useState } from 'react'
import { DragDropContext, Draggable } from 'react-beautiful-dnd'
import { useLocation } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'

import { ChatState, AppointmentsState } from '@context'
import { flattenAppointment } from '@utils'
import { APPOINTMENTS_IDS, CREATE_APPOINTMENT_NAMES, APPOINTMENT_EVENT_LISTENERS } from '@config'
import { updateAppointment } from '@services/appointments'

import ExpectedAppointments from './ExpectedAppointments'
import WaitingRoomAppointments from './WaitingRoomAppointments'
import DoneAppointments from './DoneAppointments'
import PaymentsHistory from './PaymentsHistory'

import './TodayPatientsList.scss'

export const DragWrap = ({ id, index, children }) => (
  <Draggable draggableId={id} index={index}>
    {(provided) => (
      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
        {children}
      </div>
    )}
  </Draggable>
)

export default function TodayPatientsList() {
  const { socket } = ChatState()
  const { pathname } = useLocation()
  const toast = useToast()
  const { appointmentsList, setAppointmentsList, fetchWorkAppointments } = AppointmentsState()
  const [isLoading, setIsLoading] = useState(false)

  const onDragEnd = async (props) => {
    setIsLoading(true)
    try {
      const { draggableId, destination, source } = props

      if (source.droppableId === destination.droppableId) {
        await reorderAppointments({ source, destination })
      } else {
        await updateAppointmentStatus({ draggableId, source, destination })
      }
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  const reorderAppointments = async ({ source, destination }) => {
    if (source.droppableId === APPOINTMENTS_IDS.EXPECTED || source.droppableId === APPOINTMENTS_IDS.WAITING_ROOM) {
      const appointments = appointmentsList[source.droppableId]

      const sourceAppointment = appointments[source.index]
      const destinationAppointment = appointments[destination.index]

      const updatedSourceAppointment = await updateAppointment(sourceAppointment._id, {
        [CREATE_APPOINTMENT_NAMES.ORDER]: destination.index,
      })
      const updatedDestinationAppointment = await updateAppointment(destinationAppointment._id, {
        [CREATE_APPOINTMENT_NAMES.ORDER]: source.index,
      })

      socket.emit(APPOINTMENT_EVENT_LISTENERS.REORDER_APPOINTMENT, {
        sourceDroppableId: source.droppableId,
        updatedAppointments: [updatedSourceAppointment, updatedDestinationAppointment],
      })
    }
  }

  const updateAppointmentStatus = async ({ draggableId, source, destination }) => {
    const { droppableId: sourceDroppableId } = source || {}
    const { droppableId: destinationDroppableId } = destination || {}

    const droppedAppointment = appointmentsList[sourceDroppableId].find((appointment) => appointment.id === draggableId)

    const updatedAppointment = await updateAppointment(droppedAppointment.id, {
      order: Number.MAX_SAFE_INTEGER,
      [sourceDroppableId]: false,
      [destinationDroppableId]: true,
    })

    socket.emit(APPOINTMENT_EVENT_LISTENERS.DROP_APPOINTMENT, {
      draggableId,
      sourceDroppableId,
      destinationDroppableId,
      updatedAppointment,
    })
  }

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        await fetchWorkAppointments()
      } catch (error) {
        toast({ description: error.message })
      }
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    socket.on(APPOINTMENT_EVENT_LISTENERS.DROP_APPOINTMENT, (payload) => {
      try {
        const { draggableId, sourceDroppableId, destinationDroppableId, updatedAppointment } = payload
        setAppointmentsList({
          ...appointmentsList,
          [sourceDroppableId]: appointmentsList[sourceDroppableId].filter(
            (appointment) => appointment.id !== draggableId,
          ),
          [destinationDroppableId]: [
            ...appointmentsList[destinationDroppableId],
            flattenAppointment(updatedAppointment),
          ],
        })
      } catch (error) {
        toast({ description: error.message })
      }
    })

    socket.on(APPOINTMENT_EVENT_LISTENERS.REORDER_APPOINTMENT, (payload) => {
      const { sourceDroppableId, updatedAppointments } = payload
      try {
        const appointments = appointmentsList[sourceDroppableId].map((appointment) => {
          const foundAppointment = updatedAppointments.find((item) => item._id === appointment._id)
          return foundAppointment ? flattenAppointment(foundAppointment) : appointment
        })

        setAppointmentsList({
          ...appointmentsList,
          [sourceDroppableId]: appointments.sort((a, b) => a.order - b.order),
        })
      } catch (error) {
        toast({ description: error.message })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentsList, setAppointmentsList])

  return (
    <div className="today-patients-list-page-container">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="room-container">
          <ExpectedAppointments isLoading={isLoading} appointments={appointmentsList[APPOINTMENTS_IDS.EXPECTED]} />
          <WaitingRoomAppointments
            isLoading={isLoading}
            appointments={appointmentsList[APPOINTMENTS_IDS.WAITING_ROOM]}
          />
          <DoneAppointments isLoading={isLoading} appointments={appointmentsList[APPOINTMENTS_IDS.DONE]} />
        </div>
      </DragDropContext>
      <PaymentsHistory />
    </div>
  )
}
