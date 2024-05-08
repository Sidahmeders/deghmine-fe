import { Avatar, Box, HStack, Stack, Text, useDisclosure } from '@chakra-ui/react'

import { ChatState } from '@context'
import { formatMessageDate, getSenderName, getSender, getLocalUser } from '@utils'

import DeleteChatModal from './DeleteChatModal'

const UserChatItem = ({ chat }) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { selectedChat, setSelectedChat } = ChatState()
  const localUser = getLocalUser()
  const sender = chat.isGroupChat ? chat.chatName : getSenderName(localUser, chat.users)
  const { pic } = getSender(localUser, chat.users) || {}
  const { content, updatedAt } = chat?.latestMessage || {}

  return (
    <Box
      key={chat._id}
      onClick={() => setSelectedChat(chat)}
      cursor="pointer"
      bg={selectedChat?._id === chat._id ? '#47f9' : 'gray.100'}
      color={selectedChat?._id === chat._id ? 'white' : 'black'}
      position="relative"
      px="3"
      py="2"
      borderRadius="lg">
      <HStack gap="2">
        <Avatar name={sender} src={!chat.isGroupChat && pic} />
        <Box pt="2">
          <Text>{!chat.isGroupChat ? sender : chat.chatName}</Text>
          <Text fontSize="small" color={selectedChat?._id === chat._id ? 'white' : 'blue.500'}>
            {content && content.slice(0, 30)}
          </Text>
        </Box>
        <Stack position="absolute" right="0.75rem" top="1" alignItems="flex-end" justifyContent="center">
          <Text fontSize="12">{updatedAt && formatMessageDate(updatedAt)}</Text>
          {!sender && <DeleteChatModal chat={chat} isOpen={isOpen} onOpen={onOpen} onClose={onClose} />}
        </Stack>
      </HStack>
    </Box>
  )
}

export default UserChatItem
