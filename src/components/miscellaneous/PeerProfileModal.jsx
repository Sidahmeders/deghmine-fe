import propTypes from 'prop-types'
import {
  HStack,
  IconButton,
  Avatar,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  ModalCloseButton,
} from '@chakra-ui/react'
import { Info } from 'react-feather'

import { USER_ROLES_MAP } from '@config'
import { formatDate } from '@utils'

import DeleteChatMessagesModal from './DeleteChatMessagesModal'
import SuggestionModal from '../SuggestionModal/SuggestionModal'

const PeerProfileModal = ({ sender, chatId, setMessages }) => {
  const { isOpen: isProfileOpen, onOpen: onProfileOpen, onClose: onProfileClose } = useDisclosure()
  const {
    isOpen: isSuggestionModalOpen,
    onOpen: onSuggestionModalOpen,
    onClose: onSuggestionModalClose,
  } = useDisclosure()

  return (
    <>
      <HStack>
        <SuggestionModal
          isOpen={isSuggestionModalOpen}
          onOpen={onSuggestionModalOpen}
          onClose={onSuggestionModalClose}
        />
        <DeleteChatMessagesModal sender={sender} chatId={chatId} setMessages={setMessages} />
        <IconButton icon={<Info />} onClick={onProfileOpen} />
      </HStack>

      <Modal size="xl" isOpen={isProfileOpen} onClose={onProfileClose} isCentered>
        <ModalOverlay />
        <ModalContent pb="4">
          <ModalCloseButton size="lg" />
          <ModalHeader display="flex" justifyContent="center" alignItems="center">
            <Text fontSize="24">{sender.name || 'Utilisateur supprimé'}</Text>
            <Text fontSize="16" ml="2" color="orange.400">
              {USER_ROLES_MAP[sender.role]}
            </Text>
          </ModalHeader>
          <ModalBody display="flex" flexDir="column" alignItems="center" justifyContent="space-between">
            <Avatar src={sender.pic} name={sender.name} objectFit="cover" boxSize="12.5rem" />
            <Text fontSize="20" mt="6">
              Email: <b> {sender.email || 'Utilisateur supprimé'}</b>
            </Text>
            <Text fontSize="16" mt="2">
              Inscrit à: <b>{formatDate(sender.createdAt, 'HH:mm EEEE dd/MM . yyyy')}</b>
            </Text>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}

PeerProfileModal.propTypes = {
  sender: propTypes.object,
  chatId: propTypes.string,
  setMessages: propTypes.func,
}

PeerProfileModal.defaultProps = {
  sender: {},
  chatId: '',
  setMessages: () => {},
}

export default PeerProfileModal
