import { useState } from 'react'
import {
  Avatar,
  Box,
  HStack,
  IconButton,
  Skeleton,
  RadioGroup,
  Radio,
  Stack,
  Text,
  useToast,
  Button,
  useDisclosure,
} from '@chakra-ui/react'
import { ChevronDown, MessageCircle } from 'react-feather'

import { ChatState } from '@context'
import { USER_ROLES } from '@config'
import { accessChat } from '@services/chats'
import { updateUserRole } from '@services/users'

import DeleteUserModal from '@components/miscellaneous/DeleteUserModal'

const UserListItem = ({ user, setUsersList, closeDrawer }) => {
  const toast = useToast()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { setSelectedChat, userChats, setUserChats } = ChatState()

  const [loadingChat, setLoadingChat] = useState(false)
  const [showMore, setShowMore] = useState(false)
  const [roleValue, setRoleValue] = useState(user.role)
  const [canUpdateRole, setCanUpdateRole] = useState(false)

  const accessUserChat = async () => {
    setLoadingChat(true)
    try {
      const chatData = await accessChat(user._id)
      // If the chat already inside 'chat' state, append it
      if (!userChats.find((c) => c._id === chatData._id)) setUserChats([chatData, ...userChats])
      setSelectedChat(chatData)
      closeDrawer()
    } catch (error) {
      toast({ title: 'Erreur lors de la récupération du chat', description: error.message })
    }
    setLoadingChat(false)
  }

  const handleRoleUpdate = async () => {
    try {
      await updateUserRole(user._id, roleValue)
      setUsersList((prevUsers) =>
        prevUsers.map((prevUser) => ({ ...prevUser, role: prevUser._id === user._id ? roleValue : prevUser.role })),
      )
      toast({ title: 'rôle modifié avec succès', status: 'success' })
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const cancelUpdate = () => {
    setRoleValue(user.role)
    setCanUpdateRole(false)
  }

  if (loadingChat) return <Skeleton height="60px" mb="2" borderRadius="lg" />

  return (
    <Box bg="#E8E8E8" display="flex" alignItems="center" color="black" p="3" mb="2" borderRadius="lg">
      <Stack w="100%">
        <HStack>
          <Avatar name={user.name} src={user.pic} size="sm" mr="3" />
          <HStack w="100%" display="flex" justifyContent="space-between">
            <Text fontWeight="semibold" fontSize="15" color="gray.600">
              {user.name}
            </Text>
            <HStack>
              <DeleteUserModal
                user={user}
                setUsersList={setUsersList}
                isOpen={isOpen}
                onOpen={onOpen}
                onClose={onClose}
              />
              <IconButton
                size="sm"
                variant="ghost"
                color="#38B2AC"
                icon={<MessageCircle size="1.35rem" />}
                onClick={accessUserChat}
              />
              <IconButton
                size="sm"
                variant="ghost"
                icon={<ChevronDown size="1.35rem" />}
                onClick={() => setShowMore(!showMore)}
              />
            </HStack>
          </HStack>
        </HStack>

        {showMore && (
          <Stack pl="1">
            <Text fontSize="14">
              <b>Email : </b>
              {user.email}
            </Text>
            <Text fontSize="14">
              <b>Accès :</b>
            </Text>

            <RadioGroup bg="whiteAlpha.600" p="2" borderRadius="lg" onChange={setRoleValue} value={roleValue}>
              <HStack flexWrap="wrap" columnGap="6" rowGap="2">
                {USER_ROLES.map((role, index) => (
                  <Radio colorScheme="yellow" ml={index === 0 && '2'} key={role.id} value={role.value}>
                    {role.name}
                  </Radio>
                ))}
              </HStack>

              {user.role !== roleValue && (
                <Box mt="5">
                  {canUpdateRole ? (
                    <Button size="sm" colorScheme="red" onClick={handleRoleUpdate}>
                      Confirmer modification
                    </Button>
                  ) : (
                    <Button size="sm" colorScheme="orange" onClick={setCanUpdateRole}>
                      Modifier le rôle
                    </Button>
                  )}
                  <Button size="sm" ml="2" onClick={cancelUpdate}>
                    Annuler
                  </Button>
                </Box>
              )}
            </RadioGroup>
          </Stack>
        )}
      </Stack>
    </Box>
  )
}

export default UserListItem
