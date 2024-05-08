import { Box, HStack, Skeleton, Stack } from '@chakra-ui/react'
import { isEmpty } from 'lodash'

import { ChatState } from '@context'

import UsersListDrawer from '@components/UsersListDrawer/UsersListDrawer'
import CreateGroupChatModal from '@components/miscellaneous/CreateGroupChatModal'
import UserChatItem from '@components/miscellaneous/UserChatItem'
import LogoutButton from '@components/miscellaneous/LogoutButton'
import EditUserSettings from '@components/EditUserSettings'

const UsersChatLoader = () => (
  <Stack>
    <Skeleton height="67px" borderRadius="md" />
    <Skeleton height="67px" borderRadius="md" />
    <Skeleton height="67px" borderRadius="md" />
  </Stack>
)

const UserChats = () => {
  const { selectedChat, userChats, isLoadingUserChats } = ChatState()

  return (
    <Box
      boxShadow="inner"
      flexDir="column"
      alignItems="center"
      borderRadius="lg"
      display={{ base: !isEmpty(selectedChat) ? 'none' : 'flex', md: 'flex' }}
      w={{ base: '100%', md: '30%' }}>
      <HStack p="5" gap="2" width="100%" justifyContent="space-evenly">
        <UsersListDrawer />
        <CreateGroupChatModal />
        <EditUserSettings />
        <LogoutButton />
      </HStack>

      <Box display="flex" flexDir="column" p="4" w="100%" h="100%" borderRadius="lg" overflowY="hidden">
        <Stack overflowY="auto">
          {!isLoadingUserChats || userChats.length ? (
            userChats.map((chat) => <UserChatItem key={chat._id} chat={chat} />)
          ) : (
            <UsersChatLoader />
          )}
        </Stack>
      </Box>
    </Box>
  )
}

export default UserChats
