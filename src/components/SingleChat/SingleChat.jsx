import { useEffect, useState } from 'react'
import { Box, IconButton, Spinner, Stack, Text } from '@chakra-ui/react'
import { ArrowLeft, Mail } from 'react-feather'
import { debounce, isEmpty } from 'lodash'

import { ChatState } from '@context'
import { CHAT_EVENT_LISTENERS } from '@config'
import { getSenderName, getSender, getLocalUser } from '@utils'

import PeerProfileModal from '../miscellaneous/PeerProfileModal'
import UpdateGroupChatModal from '../miscellaneous/UpdateGroupChatModal'
import ScrollableChat from '../ScrollableChat'
import ChatMessageInput from './ChatMessageInput'

import './SingleChat.scss'

const updateTyping = debounce((chatId, selectedChat, setTyping) => {
  if (chatId === selectedChat?._id) {
    setTyping()
  }
})

const SingleChat = () => {
  const localUser = getLocalUser()
  const { socket, selectedChat, setSelectedChat, messages, setMessages, isLoadingMessages } = ChatState()
  const senderName = getSenderName(localUser, selectedChat.users)
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    socket.on(CHAT_EVENT_LISTENERS.TYPING, (chatId) => {
      updateTyping(chatId, selectedChat, () => setIsTyping(true))
    })
    socket.on(CHAT_EVENT_LISTENERS.STOP_TYPING, (chatId) => {
      updateTyping(chatId, selectedChat, () => setIsTyping(false))
    })
  }, [selectedChat, socket])

  return (
    <>
      {!isEmpty(selectedChat) ? (
        <>
          <Box fontSize="1.25rem" w="100%" pb="2" display="flex" justifyContent="space-between" alignItems="center">
            <IconButton
              display={{ base: 'flex', md: 'none' }}
              icon={<ArrowLeft />}
              onClick={() => setSelectedChat('')}
            />
            {selectedChat.isGroupChat ? (
              <>
                <Text fontWeight="500" color="gray.600">
                  {selectedChat.chatName.toUpperCase()}
                </Text>
                <UpdateGroupChatModal
                  chatId={selectedChat._id}
                  sender={getSender(localUser, selectedChat.users)}
                  setMessages={setMessages}
                />
              </>
            ) : (
              <>
                <Text fontWeight="500" color={senderName ? 'gray.600' : 'red.600'}>
                  {senderName || 'Compte Supprimé'}
                </Text>
                <PeerProfileModal
                  chatId={selectedChat._id}
                  sender={getSender(localUser, selectedChat.users)}
                  setMessages={setMessages}
                />
              </>
            )}
          </Box>

          <Box
            className="single-chat-container"
            display="flex"
            flexDir="column"
            justifyContent="flex-end"
            px="3"
            pb="2"
            bg="gray.100"
            width="100%"
            height="100%"
            borderRadius="lg"
            overflowY="hidden">
            {isLoadingMessages ? (
              <Spinner size="xl" w="20" h="20" alignSelf="center" margin="auto" />
            ) : (
              <Stack overflowY="auto" mt="0" maxH="80%">
                <ScrollableChat messages={messages} isTyping={isTyping} />
              </Stack>
            )}

            <ChatMessageInput />
          </Box>
        </>
      ) : (
        <Stack justifyContent="center" alignItems="center" p="12" mt="16">
          <Mail size="50%" color="#34d9" />
          <Text fontSize="2xl" fontFamily="mono" fontWeight="bold" color="#34d9">
            Cliquez un utilisateur à discuter
          </Text>
        </Stack>
      )}
    </>
  )
}

export default SingleChat
