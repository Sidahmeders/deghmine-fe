import { useState } from 'react'
import {
  Button,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react'
import { Trash, AlertTriangle } from 'react-feather'

import { ChatState } from '@context'
import { deleteChatById } from '@services/chats'

const DeleteChatModal = ({ chat, isOpen, onOpen, onClose }) => {
  const toast = useToast()
  const { setSelectedChat, setUserChats } = ChatState()
  const [canDeleteChat, setCanDeleteChat] = useState(false)

  const handleChatDelete = async () => {
    try {
      await deleteChatById(chat._id)
      setSelectedChat({})
      setUserChats((prevChats) => prevChats.filter((item) => item._id !== chat._id))
      toast({ title: 'Chat supprimé avec succès', status: 'warning' })
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const handleCancel = () => {
    setCanDeleteChat(false)
    onClose()
  }

  return (
    <>
      <IconButton
        size="xs"
        width="fit-content"
        _hover={{
          bg: 'red.100',
        }}
        icon={<Trash color="red" size="1rem" />}
        onClick={onOpen}
      />
      <Modal size="lg" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Voulez-vous supprimer ce chat?</ModalHeader>
          <ModalBody>
            <Text pl="2">vous êtes sur le point de supprimer ce chat une fois pour toutes</Text>
            <HStack color="red" mt="4">
              <AlertTriangle />
              <Text fontWeight="semibold">veuillez noter que cette action ne peut pas être annulée!</Text>
            </HStack>
          </ModalBody>
          <ModalFooter>
            {canDeleteChat ? (
              <Button colorScheme="red" onClick={handleChatDelete}>
                Confirmer est sortie
              </Button>
            ) : (
              <Button colorScheme="orange" onClick={setCanDeleteChat}>
                Supprimer
              </Button>
            )}
            <Button ml="2" onClick={handleCancel}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteChatModal
