import { useState } from 'react'
import { Modal, ModalContent, ModalOverlay, Tabs, TabList, Tab, TabPanels, TabPanel, Box } from '@chakra-ui/react'

import { getMotifTemplateButtons } from '@utils'

import AddAppointmentBody from './AddAppointmentBody'
import MotifEditableButtons from './MotifEditableButtons/MotifEditableButtons'
import ConfigureCalendarAvailabilityBody from './ConfigureCalendarAvailabilityBody'
import { X } from 'react-feather'

const AddAppointmentModal = ({ selectedView, selectedSlotInfo, isOpen, onClose, setEvents, setAvailabilities }) => {
  const { slots } = selectedSlotInfo
  const canAddAppointment = slots?.length === 1 || selectedView === 'day'
  const [templateButtons, setTemplateButtons] = useState(getMotifTemplateButtons())

  return (
    <Modal size="xl" closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay bg="blackAlpha.400" />
      <ModalContent>
        <Tabs onClick={() => setTemplateButtons(getMotifTemplateButtons())}>
          <TabList>
            {canAddAppointment && <Tab>Ajouter rendez-vous</Tab>}
            {canAddAppointment && <Tab>Modifier boutons</Tab>}
            <Tab>Définir la disponibilité</Tab>
            <Box
              onClick={onClose}
              cursor="pointer"
              position="absolute"
              right="1"
              mt="1"
              p="1"
              _hover={{
                background: '#ddd6',
                borderRadius: '6px',
              }}>
              <X />
            </Box>
          </TabList>

          <TabPanels>
            {canAddAppointment && (
              <TabPanel>
                <AddAppointmentBody
                  selectedSlotInfo={selectedSlotInfo}
                  templateButtons={templateButtons}
                  handleClose={onClose}
                  setEvents={setEvents}
                />
              </TabPanel>
            )}
            {canAddAppointment && (
              <TabPanel>
                <MotifEditableButtons />
              </TabPanel>
            )}
            <TabPanel>
              <ConfigureCalendarAvailabilityBody
                selectedSlotInfo={selectedSlotInfo}
                setAvailabilities={setAvailabilities}
                handleClose={onClose}
              />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </ModalContent>
    </Modal>
  )
}

export default AddAppointmentModal
