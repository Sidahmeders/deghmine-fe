import { Droppable } from 'react-beautiful-dnd'

import { APPOINTMENTS_IDS } from '@config'

import AppointmentCard, { LoadingCards } from './AppointmentCard'
import { DragWrap } from './TodayPatientsList'
import RoomTitle from './RoomTitle/RoomTitle'

export default function WaitingRoomAppointments({ appointments, isLoading }) {
  return (
    <Droppable droppableId={APPOINTMENTS_IDS.WAITING_ROOM}>
      {(provided) => (
        <div className="waiting-room-appointments-container" ref={provided.innerRef} {...provided.droppableProps}>
          <RoomTitle title="Salle D'Attente" appointments={appointments} />
          <div className="cards-container">
            {isLoading ? (
              <LoadingCards />
            ) : (
              appointments.map((appointment, index) => (
                <DragWrap key={appointment.id} id={appointment.id} index={index}>
                  <AppointmentCard withPresence appointment={appointment} index={index} />
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
