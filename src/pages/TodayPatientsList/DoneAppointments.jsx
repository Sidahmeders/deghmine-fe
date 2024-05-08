import { Droppable } from 'react-beautiful-dnd'

import { APPOINTMENTS_IDS } from '@config'

import AppointmentCard, { LoadingCards } from './AppointmentCard'
import { DragWrap } from './TodayPatientsList'
import RoomTitle from './RoomTitle/RoomTitle'

export default function DoneAppointments({ appointments, isLoading }) {
  return (
    <Droppable droppableId={APPOINTMENTS_IDS.DONE}>
      {(provided) => (
        <div className="done-appointments-container" ref={provided.innerRef} {...provided.droppableProps}>
          <RoomTitle title="Rendez-vous Fini" appointments={appointments} />
          <div className="cards-container">
            {isLoading ? (
              <LoadingCards />
            ) : (
              appointments.map((appointment, index) => (
                <DragWrap key={appointment.id} id={appointment.id} index={index}>
                  <AppointmentCard appointment={appointment} />
                </DragWrap>
              ))
            )}
            {provided.placeholder}
          </div>
        </div>
      )}
    </Droppable>
  )
}
