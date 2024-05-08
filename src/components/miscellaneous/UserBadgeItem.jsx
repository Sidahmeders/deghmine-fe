import { Box, Badge } from '@chakra-ui/react'
import { X } from 'react-feather'

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <Badge
      variant="outline"
      colorScheme="blue"
      borderRadius="lg"
      display="flex"
      alignItems="center"
      pl="3"
      pr="2"
      py="1.5"
      mr="2"
      mb="4">
      <Box mr="2">{user.name}</Box>
      <X cursor="pointer" color="red" size="1rem" onClick={handleFunction} />
    </Badge>
  )
}

export default UserBadgeItem
