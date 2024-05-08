import { useEffect, useState } from 'react'
import { FormControl, Input, InputRightElement, InputGroup, useToast } from '@chakra-ui/react'
import { Send } from 'react-feather'

import { SUGGESTIONS } from '@fakeDB'
import { ChatState } from '@context'
import { CHAT_EVENT_LISTENERS } from '@config'
import { getChatTemplateButtons, getSender, getLocalUser } from '@utils'
import { createMessage } from '@services/messages'

import SuggestionBox from './SuggestionBox'

const ChatMessageInput = () => {
  const localUser = getLocalUser()
  const toast = useToast()
  const {
    socket,
    selectedChat,
    messages,
    setMessages,
    suggestions,
    setUserChats,
    setSuggestions,
    suggestionSettings,
    socketConnected,
  } = ChatState()

  const [newMessage, setNewMessage] = useState('')
  const [typing, setTyping] = useState(false)

  const sendMessage = async (e) => {
    if (newMessage.trim().length < 1) return
    if (e.key !== 'Enter' && e.type !== 'click') return
    try {
      socket.emit(CHAT_EVENT_LISTENERS.STOP_TYPING, selectedChat._id)
      setNewMessage('')
      const createdMessage = await createMessage(newMessage, selectedChat._id)
      socket.emit(CHAT_EVENT_LISTENERS.NEW_MESSAGE, { createdMessage, targetChat: selectedChat })
      setMessages([...messages, createdMessage])

      const sender = getSender(localUser, selectedChat.users)
      setUserChats((prevChats) =>
        prevChats.map((chat) => {
          const senderChat = getSender(localUser, chat.users)
          if (senderChat._id === sender._id) {
            return { ...chat, latestMessage: createdMessage }
          }
          return chat
        }),
      )
    } catch (error) {
      toast({ description: error.message })
    }
  }

  const typingHandler = (e) => {
    setNewMessage(e.target.value)

    if (!socketConnected) return

    if (!typing) {
      setTyping(true)
      socket.emit(CHAT_EVENT_LISTENERS.TYPING, selectedChat._id)
    }

    let lastTypingTime = new Date().getTime()
    let timerLength = 5000

    setTimeout(() => {
      let timeNow = new Date().getTime()
      let timeDiff = timeNow - lastTypingTime

      if (timeDiff >= timerLength && typing) {
        socket.emit(CHAT_EVENT_LISTENERS.STOP_TYPING, selectedChat._id)
        setTyping(false)
      }
    }, timerLength)
  }

  useEffect(() => {
    if (suggestionSettings.filterSuggestions) {
      const filteredSuggestions = [...getChatTemplateButtons(), ...SUGGESTIONS].filter(
        ({ message: suggestionMessage }) => suggestionMessage.toLowerCase().includes(newMessage.toLowerCase()),
      )
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([...getChatTemplateButtons(), ...SUGGESTIONS])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newMessage])

  return (
    <div>
      <SuggestionBox suggestions={suggestions} setNewMessage={setNewMessage} />

      <FormControl mt="3" onKeyDown={sendMessage} isRequired>
        <InputGroup>
          <Input
            variant="filled"
            bg="gray.300"
            placeholder="entrer des messages.."
            value={newMessage}
            onChange={(e) => typingHandler(e)}
          />
          <InputRightElement cursor="pointer" mr="2" children={<Send color="#48f" />} onClick={sendMessage} />
        </InputGroup>
      </FormControl>
    </div>
  )
}

export default ChatMessageInput
