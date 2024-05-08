import { useEffect } from 'react'
import {
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import { Tool } from 'react-feather'

import { ChatState } from '@context'
import { SUGGESTIONS_CONTAINER_DIRECTION, SUGGESTIONS_CONTAINER_HEIGHTS } from '@config'

import ConfigureSuggestionBody from './ConfigureSuggestionBody'
import EditSuggestionButtonsBody from './EditSuggestionButtonsBody'

const SuggestionsModal = ({ isOpen, onOpen, onClose }) => {
  const { suggestionContainerDirection, setSuggestionContainerHeight } = ChatState()

  useEffect(() => {
    if (suggestionContainerDirection === SUGGESTIONS_CONTAINER_DIRECTION.row) {
      setSuggestionContainerHeight(SUGGESTIONS_CONTAINER_HEIGHTS.small)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suggestionContainerDirection])

  return (
    <>
      <IconButton width="fit-content" _hover={{ bg: 'purple.100' }} onClick={onOpen} icon={<Tool color="#8c00ff" />} />

      <Modal size="2xl" isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Tabs>
            <TabList>
              <Tab>Paramètres de suggestion</Tab>
              <Tab>Modifier suggestions</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <ConfigureSuggestionBody />
              </TabPanel>
              <TabPanel>
                <EditSuggestionButtonsBody />
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalContent>
      </Modal>
    </>
  )
}

export default SuggestionsModal
