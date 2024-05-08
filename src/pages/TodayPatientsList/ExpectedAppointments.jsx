import { Droppable } from 'react-beautiful-dnd'

import { APPOINTMENTS_IDS } from '@config'

import AppointmentCard, { LoadingCards } from './AppointmentCard'
import { DragWrap } from './TodayPatientsList'
import RoomTitle from './RoomTitle/RoomTitle'

export default function ExpectedAppointments({ appointments, isLoading }) {
  return (
    <Droppable droppableId={APPOINTMENTS_IDS.EXPECTED}>
      {(provided) => (
        <div className="expected-appointments-container" ref={provided.innerRef} {...provided.droppableProps}>
          <RoomTitle title="Rendez-vous attendus" appointments={appointments} />
          <div className="cards-container">
            {isLoading ? (
              <LoadingCards />
            ) : (
              appointments.map((appointment, index) => (
                <DragWrap key={appointment.id} id={appointment.id} index={index}>
                  <AppointmentCard withConfirm appointment={appointment} index={index} />
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
