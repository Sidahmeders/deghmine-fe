import { useState } from 'react'
import {
  Button,
  Tooltip,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Stack,
  Skeleton,
  IconButton,
  HStack,
  Text,
  DrawerFooter,
} from '@chakra-ui/react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, Circle, List, Target } from 'react-feather'

import { ChatState } from '@context'

import UserListItem from './UserListItem'
import GroupChatItem from './GroupChatItem'

const LoadingChats = () => (
  <Stack>
    <Skeleton height="60px" borderRadius="lg" />
    <Skeleton height="60px" borderRadius="lg" />
    <Skeleton height="60px" borderRadius="lg" />
  </Stack>
)

const UsersListDrawer = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { usersList, setUsersList, groupChatsList, isLoadingDrawerChats } = ChatState()
  const [showGrouplist, setShowGrouplist] = useState(false)

  return (
    <>
      <Tooltip label="Liste des utilisateurs" hasArrow>
        <Button p="0" onClick={onOpen}>
          <List />
        </Button>
      </Tooltip>

      <Drawer size="sm" placement="left" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1 }}
                whileTap={{ scale: 0.75 }}>
                <HStack w="100%" justifyContent="space-between">
                  <Text color="purple.500">{showGrouplist ? 'Liste de Groupe' : 'Liste des Utilisateurs'}</Text>
                  <IconButton
                    variant="ghost"
                    colorScheme="purple"
                    opacity="0.75"
                    size="sm"
                    icon={showGrouplist ? <Target /> : <Circle />}
                    onClick={() => setShowGrouplist((prevState) => !prevState)}
                  />
                </HStack>
              </motion.div>
            </AnimatePresence>
          </DrawerHeader>
          {!showGrouplist ? (
            <>
              <DrawerBody>
                {isLoadingDrawerChats ? (
                  <LoadingChats />
                ) : (
                  usersList?.map((user) => (
                    <UserListItem key={user._id} user={user} setUsersList={setUsersList} closeDrawer={onClose} />
                  ))
                )}
              </DrawerBody>
            </>
          ) : (
            <>
              <DrawerBody height="max">
                {isLoadingDrawerChats ? (
                  <LoadingChats />
                ) : (
                  groupChatsList?.map((chatGroup) => <GroupChatItem key={chatGroup._id} chatGroup={chatGroup} />)
                )}
              </DrawerBody>
            </>
          )}
          <DrawerFooter>
            <Button variant="outline" colorScheme="purple" size="sm" onClick={onClose}>
              <ChevronLeft />
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default UsersListDrawer
