import { useState } from 'react'
import { Circle, Box, Text } from '@chakra-ui/react'

import { groupAppointmentsByMotif } from '@utils'

import './RoomTitle.scss'

const RoomTitle = ({ title, appointments }) => {
  const [showMotifCounter, setShowMotifCounter] = useState(false)

  return (
    <div className="room-title" onClick={() => setShowMotifCounter(!showMotifCounter)}>
      {title}
      <Circle className="circle" size="25px">
        {appointments.length}
      </Circle>
      <span className={`motif-counts-container ${showMotifCounter && 'show'}`}>
        {showMotifCounter &&
          Object.entries(groupAppointmentsByMotif(appointments)).map(([key, values]) => (
            <Box className="motif-count" key={key}>
              <Text fontSize="12" textTransform="capitalize" mr="1">
                {values[0]?.motif?.name}
              </Text>
              <Text>{values.length}</Text>
            </Box>
          ))}
      </span>
    </div>
  )
}

export default RoomTitle
