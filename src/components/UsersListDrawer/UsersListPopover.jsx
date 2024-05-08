import { useRef } from 'react'
import {
  Box,
  Avatar,
  Text,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverArrow,
  PopoverBody,
  HStack,
  Tooltip,
} from '@chakra-ui/react'
import { Star } from 'react-feather'

import { USER_ROLES_MAP } from '@config'
import { getGroupAdminUser } from '@utils'

const UsersListPopover = ({ chatGroup }) => {
  const initialFocusRef = useRef()
  const slicedUsers = chatGroup?.users?.slice(0, 4) || []
  const adminUser = getGroupAdminUser(chatGroup)

  return (
    <Popover initialFocusRef={initialFocusRef} placement="bottom-end">
      <PopoverTrigger>
        <Avatar cursor="pointer" name={chatGroup.chatName} h="10" w="10" size="md" mr="3" />
      </PopoverTrigger>
      <PopoverContent color="white" bg="#474aff">
        <PopoverHeader pt={4} fontWeight="bold" border="0">
          <HStack justifyContent="space-between">
            <Text color="red.200" fontWeight="extrabold">
              Groupe Utilisateurs :
            </Text>
            <Box>
              {slicedUsers.map((user) => (
                <Avatar key={user._id} size="xs" src={user.pic} m="0" p="0" />
              ))}
              {slicedUsers.length !== chatGroup?.users?.length ? '..' : ''}
            </Box>
          </HStack>
        </PopoverHeader>
        <PopoverArrow bg="#474affee" />
        <PopoverBody>
          {chatGroup?.users?.map((user) => (
            <HStack key={user._id} w="100%" justifyContent="space-between">
              <HStack>
                <Text>{user?.name?.slice(0, 22)}</Text>
                <Tooltip label="groupe admin" bg="orange" placement="right-end" hasArrow>
                  <Text cursor="pointer">{user?.name === adminUser?.name && <Star size="1rem" color="gold" />}</Text>
                </Tooltip>
              </HStack>
              <Text color="orange.200">{USER_ROLES_MAP[user.role]}</Text>
            </HStack>
          ))}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

export default UsersListPopover
