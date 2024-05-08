import { useState } from 'react'
import { Box, Text, Stack, HStack, IconButton, Button, useToast } from '@chakra-ui/react'
import { ChevronDown, ChevronUp } from 'react-feather'

import { ChatState } from '@context'
import { CHAT_EVENT_LISTENERS } from '@config'
import { formatMessageDate } from '@utils'
import { deleteChatById } from '@services/chats'

import UsersListPopover from './UsersListPopover'

const GroupChatItem = ({ chatGroup }) => {
  const { socket } = ChatState()
  const toast = useToast()
  const [showMore, setShowMore] = useState(false)
  const [canDeleteGroup, setCanDeleteGroup] = useState(false)

  const cancelHanlder = () => {
    setCanDeleteGroup(false)
    setShowMore(false)
  }

  const deleteGroupChat = async () => {
    try {
      await deleteChatById(chatGroup._id)
      socket.emit(CHAT_EVENT_LISTENERS.DELETE_CHAT, chatGroup)
      toast({ title: 'chat supprimé avec succès', status: 'warning' })
    } catch (error) {
      toast({ description: error.message })
    }
  }

  return (
    <Stack gap="2" bg="#E8E8E8" p="3" mb="2" borderRadius="lg" position="relative">
      <Box display="flex" alignItems="center">
        <UsersListPopover chatGroup={chatGroup} />
        <Stack>
          <Text fontWeight="500">{chatGroup.chatName}</Text>
          <Text fontSize="12" color="blue" style={{ margin: '0' }}>
            {chatGroup?.latestMessage?.content.slice(0, 50)}..
          </Text>
        </Stack>
        <Stack position="absolute" top="2" right="3" alignItems="flex-end" justifyContent="space-between" h="80%">
          <Text color="purple.400" fontSize="12">
            {formatMessageDate(chatGroup?.latestMessage?.createdAt)}
          </Text>
          <IconButton
            variant="ghost"
            size="sm"
            transform="translateX(5px)"
            icon={showMore ? <ChevronUp /> : <ChevronDown />}
            onClick={() => setShowMore(!showMore)}
          />
        </Stack>
      </Box>
      {showMore && (
        <Box>
          <HStack>
            {canDeleteGroup ? (
              <Button size="sm" colorScheme="red" onClick={deleteGroupChat}>
                Confirmer est sortie
              </Button>
            ) : (
              <Button size="sm" colorScheme="orange" onClick={setCanDeleteGroup}>
                Supprimer le groupe
              </Button>
            )}
            <Button size="sm" onClick={cancelHanlder}>
              Annuler
            </Button>
          </HStack>
        </Box>
      )}
    </Stack>
  )
}

export default GroupChatItem
