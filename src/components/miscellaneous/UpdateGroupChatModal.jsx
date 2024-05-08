import { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import { Sliders } from 'react-feather'
import { SyncLoader } from 'react-spinners'

import { ChatState } from '@context'
import { CHAT_EVENT_LISTENERS } from '@config'
import { getLocalUser } from '@utils'
import { joinGroup, leaveGroup, renameGroup } from '@services/chats'
import { searchUsers } from '@services/users'

import UserBadgeItem from './UserBadgeItem'
import GroupUserItem from './GroupUserItem'
import DeleteChatMessagesModal from './DeleteChatMessagesModal'
import SuggestionModal from '../SuggestionModal/SuggestionModal'

const UpdateGroupChatModal = ({ sender, chatId, setMessages }) => {
  const localUser = getLocalUser()
  const toast = useToast()
  const { selectedChat, socket } = ChatState()
  const {
    isOpen: isUpdateGroupModalOpen,
    onOpen: onUpdateGroupModalOpen,
    onClose: onUpdateGroupModalClose,
  } = useDisclosure()
  const {
    isOpen: isSuggestionModalOpen,
    onOpen: onSuggestionModalOpen,
    onClose: onSuggestionModalClose,
  } = useDisclosure()

  const [groupChatName, setGroupChatName] = useState('')
  const [searchUsersQuery, setSearchUsersQuery] = useState('')
  const [usersResult, setUsersResult] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)

  const handleSearch = async (e) => {
    const { value: query } = e.target
    setSearchUsersQuery(query)
    if (query.trim().length <= 2) {
      return setUsersResult([])
    }
    setIsLoading(true)
    try {
      const usersData = await searchUsers(query)
      setUsersResult(usersData)
    } catch (error) {
      toast({ description: 'Échec du chargement des résultats de la recherche' })
    }
    setIsLoading(false)
  }

  const handleAddUser = async (addUser) => {
    // If the user already in the group
    if (selectedChat.users.find((u) => u._id === addUser._id)) {
      return toast({
        title: 'Utilisateur déjà dans le groupe',
        status: 'warning',
      })
    }
    // Check if the user admin or not
    if (selectedChat?.groupAdmin?._id !== localUser._id) {
      return toast({
        title: "Seuls les administrateurs peuvent ajouter quelqu'un",
        status: 'warning',
      })
    }
    setIsLoading(true)
    try {
      const addedUser = await joinGroup(selectedChat._id, addUser)
      socket.emit(CHAT_EVENT_LISTENERS.UPDATE_GROUP, addedUser)
    } catch (error) {
      toast({ description: "Échec de l'ajout de l'utilisateur" })
    }
    setIsLoading(false)
  }

  const handleRename = async () => {
    if (!groupChatName) return
    setRenameLoading(true)
    try {
      const renamedChat = await renameGroup(selectedChat._id, groupChatName)
      socket.emit(CHAT_EVENT_LISTENERS.UPDATE_GROUP, renamedChat)
    } catch (error) {
      toast({ description: 'Échec de renommer le chat de groupe' })
    }
    setRenameLoading(false)
    setGroupChatName('')
  }

  const handleRemove = async (removeLocalUser) => {
    // Check if group admin id !== logged in user id and user id who is trying to remove !== logged in user id
    if (selectedChat.groupAdmin._id !== localUser._id && removeLocalUser._id !== localUser._id) {
      return toast({ title: "Seuls les administrateurs peuvent supprimer quelqu'un", status: 'warning' })
    }
    setIsLoading(true)
    try {
      const removedUser = await leaveGroup(selectedChat._id, removeLocalUser)
      socket.emit(CHAT_EVENT_LISTENERS.UPDATE_GROUP, removedUser)
    } catch (error) {
      toast({ description: "Échec de la suppression de l'utilisateur" })
    }
    setIsLoading(false)
  }

  return (
    <>
      <HStack>
        <SuggestionModal
          isOpen={isSuggestionModalOpen}
          onOpen={onSuggestionModalOpen}
          onClose={onSuggestionModalClose}
        />
        <DeleteChatMessagesModal sender={sender} chatId={chatId} setMessages={setMessages} />
        <IconButton icon={<Sliders />} onClick={onUpdateGroupModalOpen} />
      </HStack>

      <Modal isOpen={isUpdateGroupModalOpen} onClose={onUpdateGroupModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader display="flex" justifyContent="center" fontSize="1.5rem">
            {selectedChat.chatName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center" pb="4">
            <Box w="100%" display="flex" flexWrap="wrap" pb="3">
              {selectedChat.users
                .filter((user) => user._id !== localUser._id)
                .map((user) => (
                  <UserBadgeItem key={user._id} user={user} handleFunction={() => handleRemove(user)} />
                ))}
            </Box>

            <FormControl display="flex">
              <Input
                placeholder="Nom du chat"
                mb="3"
                value={groupChatName}
                onChange={(e) => setGroupChatName(e.target.value)}
              />
              <Button variant="solid" colorScheme="teal" ml={1} isLoading={renameLoading} onClick={handleRename}>
                Modifier
              </Button>
            </FormControl>

            <FormControl>
              <Input
                mb="1"
                value={searchUsersQuery}
                placeholder="Ajouter un utilisateur au groupe"
                onChange={handleSearch}
              />
            </FormControl>

            {isLoading ? (
              <Box mt="8">
                <SyncLoader color="#474aff99" />
              </Box>
            ) : (
              usersResult?.map((user) => (
                <GroupUserItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
              ))
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

export default UpdateGroupChatModal
