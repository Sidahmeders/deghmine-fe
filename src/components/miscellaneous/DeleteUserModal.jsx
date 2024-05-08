import { useState } from 'react'
import {
  HStack,
  IconButton,
  Text,
  useToast,
  Button,
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  ModalOverlay,
  ModalHeader,
} from '@chakra-ui/react'
import { AlertTriangle, Trash } from 'react-feather'

import { ChatState } from '@context'
import { deleteUser } from '@services/users'

const DeleteUserModal = ({ user, setUsersList, isOpen, onOpen, onClose }) => {
  const { setFetchUserChatsAgain } = ChatState()
  const toast = useToast()
  const [canDeleteUser, setCanDeleteUser] = useState(false)

  const handleDeleteUser = async () => {
    try {
      await deleteUser(user._id)
      setUsersList((prevUsers) => prevUsers.filter((item) => item._id !== user._id))
      toast({ title: 'Utilisateur supprimé avec succès', status: 'warning' })
      setFetchUserChatsAgain((prevState) => !prevState)
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const handleClose = () => {
    setCanDeleteUser(false)
    onClose()
  }

  return (
    <>
      <IconButton size="sm" variant="ghost" icon={<Trash size="1.35rem" color="red" />} onClick={onOpen} />

      <Modal size="lg" isOpen={isOpen} onClose={handleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>êtes-vous sûr de vouloir supprimer cet utilisateur?</ModalHeader>
          <ModalBody>
            <Text pl="2">
              vous êtes sur le point de supprimer le utilisateur <strong>{user.name}</strong> à
              <strong> {user.email}</strong>
            </Text>
            <HStack color="red" mt="4">
              <AlertTriangle />
              <Text fontWeight="semibold">veuillez noter que cette action ne peut pas être annulée!</Text>
            </HStack>
          </ModalBody>
          <ModalFooter>
            {canDeleteUser ? (
              <Button colorScheme="red" onClick={handleDeleteUser}>
                Confirmer est sortie
              </Button>
            ) : (
              <Button colorScheme="orange" onClick={setCanDeleteUser}>
                Supprimer
              </Button>
            )}
            <Button ml="2" onClick={handleClose}>
              Annuler
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default DeleteUserModal
