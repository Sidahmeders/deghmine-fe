import { Box } from '@chakra-ui/react'

import { ChatState } from '@context'

import SingleChat from '@components/SingleChat/SingleChat'
import { isEmpty } from 'lodash'

const ChatBox = () => {
  const { selectedChat } = ChatState()

  return (
    <Box
      boxShadow="inner"
      alignItems="center"
      flexDir="column"
      borderRadius="lg"
      paddingX="3"
      paddingTop="3"
      paddingBottom="1.5"
      display={{ base: !isEmpty(selectedChat) ? 'flex' : 'none', md: 'flex' }}
      w={{ base: '100%', md: '68%' }}>
      <SingleChat />
    </Box>
  )
}

export default ChatBox
