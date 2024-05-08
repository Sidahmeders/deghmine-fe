import { isEmpty } from 'lodash'

import { getLocalUser } from '@utils'

import ChatBox from './ChatBox'
import UserChats from './UserChats'

import './Chat.scss'

export default function Chat() {
  const localUser = getLocalUser()

  return (
    <>
      {!isEmpty(localUser) && (
        <div className="chat-container">
          <UserChats />
          <ChatBox />
        </div>
      )}
    </>
  )
}
