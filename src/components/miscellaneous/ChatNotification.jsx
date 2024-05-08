import { useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuList, Text } from '@chakra-ui/react'
import { MessageCircle } from 'react-feather'

import { ChatState } from '@context'
import { getSenderName, getLocalUser } from '@utils'
import { APP_ROUTES } from '@config'

import './ChatNotification.scss'

const ChatNotification = () => {
  const localUser = getLocalUser()
  const navigate = useNavigate()
  const { setSelectedChat, notifications, setNotifications } = ChatState()

  return (
    <Menu>
      <MenuButton className="notification-badge-container">
        <MessageCircle />

        {notifications.length > 0 && (
          <span className="notification-badge">{notifications.length > 9 ? '9+' : notifications.length}</span>
        )}
      </MenuButton>

      <MenuList p="2">
        {!notifications.length && <Text pl="2">pas de nouveaux message</Text>}
        {notifications.map((notif) => {
          const { _id, isAppointmentChat, userName, patientName, chat } = notif

          if (isAppointmentChat) {
            return (
              <MenuItem
                key={_id}
                onClick={() => {
                  navigate(APP_ROUTES.TODAY_PATIENTS_LIST)
                  setNotifications(notifications.filter((n) => n !== notif))
                }}>
                {`${userName} vous a envoyé un message concernant ${patientName}`}
              </MenuItem>
            )
          }

          return (
            <MenuItem
              key={_id}
              onClick={() => {
                navigate(APP_ROUTES.CHATS)
                setSelectedChat(chat[0])
                setNotifications(notifications.filter((n) => n !== notif))
              }}>
              {chat[0].isGroupChat
                ? `message dans ${chat[0].chatName}`
                : `${getSenderName(localUser, chat[0].users)} t'a laissé un message`}
            </MenuItem>
          )
        })}
      </MenuList>
    </Menu>
  )
}

export default ChatNotification
