import { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { debounce } from 'lodash'

import { SUGGESTIONS } from '@fakeDB'
import { getChatSuggestionSettings, getChatTemplateButtons, getLocalUser, notify } from '@utils'
import { CHAT_EVENT_LISTENERS } from '@config'
import { fetchMessagesByChatId } from '@services/messages'
import { fetchGroupChats, fetchUserChats } from '@services/chats'
import { searchUsers } from '@services/users'

const ChatContext = createContext()

const updateChatMessages = debounce(
  ({
    selectedChat,
    targetChat,
    createdMessage,
    setMessages,
    notifications,
    setNotifications,
    setFetchUserChatsAgain,
  }) => {
    if (selectedChat._id === targetChat._id) {
      setMessages((prevMessages) => [...prevMessages, createdMessage])
    }

    if (selectedChat._id !== targetChat._id) {
      const { name: senderName } = createdMessage.sender
      const { chatName } = createdMessage.chat?.[0]
      const notificationSender = chatName === 'sender' ? senderName : chatName
      const isSenderNotificationFound = notifications.find((notif) => notif.notificationSender === notificationSender)

      if (!isSenderNotificationFound) {
        const newNotification = { ...createdMessage, notificationSender }
        setNotifications([newNotification, ...notifications])
        setFetchUserChatsAgain((prevState) => !prevState)
      }
    }
  },
)

export const ChatProvider = ({ children, socket }) => {
  const localUser = getLocalUser()
  const chatSuggestionSettings = getChatSuggestionSettings()
  const toast = useToast()
  const navigate = useNavigate()

  const [userChats, setUserChats] = useState([])
  const [selectedChat, setSelectedChat] = useState({})
  const [notifications, setNotifications] = useState([])
  const [messages, setMessages] = useState([])
  const [usersList, setUsersList] = useState([])
  const [groupChatsList, setGroupChatsList] = useState([])
  const [suggestions, setSuggestions] = useState([...getChatTemplateButtons(), ...SUGGESTIONS])
  const [suggestionSettings, setSuggestionSettings] = useState(chatSuggestionSettings)
  const [suggestionContainerDirection, setSuggestionContainerDirection] = useState(chatSuggestionSettings.direction)
  const [suggestionContainerHeight, setSuggestionContainerHeight] = useState(chatSuggestionSettings.size)

  const [socketConnected, setSocketConnected] = useState(false)
  const [fetchUserChatsAgain, setFetchUserChatsAgain] = useState(false)
  const [fetchDrawerChatsAgain, setFetchDrawerChatsAgain] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [isLoadingUserChats, setIsLoadingUserChats] = useState(false)
  const [isLoadingDrawerChats, setIsLoadingDrawerChats] = useState(false)

  const fetchMessages = async () => {
    if (!selectedChat._id) return
    setIsLoadingMessages(true)
    try {
      const messagesData = await fetchMessagesByChatId(selectedChat._id)
      setMessages(messagesData)
      socket.emit(CHAT_EVENT_LISTENERS.JOIN_CHAT, selectedChat._id)
    } catch (error) {
      toast({ description: 'Impossible de charger les messages' })
    }
    setIsLoadingMessages(false)
  }

  const fetchChats = async () => {
    setIsLoadingUserChats(true)
    try {
      const userChats = await fetchUserChats()
      setUserChats(userChats)
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoadingUserChats(false)
  }

  const fetchDrawerChatsList = async () => {
    setIsLoadingDrawerChats(true)
    try {
      const users = await searchUsers()
      setUsersList(users)
      const groupChats = await fetchGroupChats()
      setGroupChatsList(groupChats)
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoadingDrawerChats(false)
  }

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, selectedChat])

  useEffect(() => {
    fetchChats()
    // eslint-disable-next-line
  }, [fetchUserChatsAgain])

  useEffect(() => {
    fetchDrawerChatsList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchDrawerChatsAgain])

  useEffect(() => {
    socket.on(CHAT_EVENT_LISTENERS.NEW_MESSAGE, (payload) => {
      try {
        const { createdMessage, targetChat } = payload
        updateChatMessages({
          selectedChat,
          targetChat,
          createdMessage,
          setMessages,
          notifications,
          setNotifications,
          setFetchUserChatsAgain,
        })
        const { sender, content } = createdMessage || {}
        notify({ title: sender?.name, description: content })
      } catch (error) {
        toast({ description: error.message })
      }
    })
  })

  useEffect(() => {
    socket.on(CHAT_EVENT_LISTENERS.CHAT_ERROR, (errorMessage) => {
      toast({ title: 'Socket.IO Chat Error, veuillez réessayer plus tard', description: errorMessage })
    })

    socket.on(CHAT_EVENT_LISTENERS.UPDATE_GROUP, (chatPayload) => {
      if (chatPayload.groupAdmin._id === localUser._id) {
        setSelectedChat(chatPayload)
      }
      setFetchUserChatsAgain((prevState) => !prevState)
      setFetchDrawerChatsAgain((prevState) => !prevState)
    })

    socket.on(CHAT_EVENT_LISTENERS.DELETE_CHAT, (chatPayload) => {
      setGroupChatsList((prevList) => prevList.filter((chat) => chat._id !== chatPayload._id))
      setUserChats((prevList) =>
        prevList.map((chat) => (chat._id === chatPayload._id ? null : chat)).filter((chat) => chat),
      )
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ChatContext.Provider
      value={{
        socket,
        socketConnected,
        setSocketConnected,
        selectedChat,
        setSelectedChat,
        userChats,
        setUserChats,
        notifications,
        setNotifications,
        messages,
        setMessages,
        usersList,
        setUsersList,
        groupChatsList,
        setGroupChatsList,
        isLoadingMessages,
        isLoadingUserChats,
        isLoadingDrawerChats,
        setFetchUserChatsAgain,
        suggestions,
        setSuggestions,
        suggestionSettings,
        setSuggestionSettings,
        suggestionContainerDirection,
        setSuggestionContainerDirection,
        suggestionContainerHeight,
        setSuggestionContainerHeight,
      }}>
      {children}
    </ChatContext.Provider>
  )
}

export const ChatState = () => useContext(ChatContext)
