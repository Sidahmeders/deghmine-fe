import { useState } from 'react'
import { Info, Phone, CheckCircle, MinusCircle } from 'react-feather'
import {
  Modal,
  ModalContent,
  ModalOverlay,
  ModalBody,
  ModalFooter,
  Button,
  ModalHeader,
  Stack,
  Text,
  useToast,
  Textarea,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from '@chakra-ui/react'

import { formatDate, formatPhoneNumber, formatMoney } from '@utils'
import { deleteAppointment } from '@services/appointments'

import TooltipMobile from '@components/TooltipMobile'
import Loader from '@components/Loader/Loader'

export default function DisplayEventModal({ selectedEvent, setEvents, isOpen, onClose }) {
  const {
    id,
    isNewTreatment,
    isDone,
    start,
    end,
    patient,
    totalPrice,
    payment,
    paymentLeft,
    motif,
    diagnostic,
    treatmentPlan,
  } = selectedEvent
  const toast = useToast()

  const [isLoading, setIsLoading] = useState(false)
  const [canDeleteEvent, setCanDeleteEvent] = useState(false)

  const onDeleteEventIntent = () => {
    setCanDeleteEvent(true)
  }

  const deleteEvent = async () => {
    setIsLoading(true)
    try {
      await deleteAppointment(id)
      setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))
      toast({
        title: 'rendez-vous a été supprimé avec succès',
        status: 'warning',
      })
      onClose()
    } catch (error) {
      toast({ description: error.message })
    }
    setCanDeleteEvent(false)
    setIsLoading(false)
  }

  return (
    <Modal size="xl" closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent
        onKeyDownCapture={(e) => {
          // This is a fix to (TypeError: Cannot read properties of undefined (reading 'getDate') at MonthView.selectDates)
          e.stopPropagation()
        }}>
        <Loader loading={isLoading}>
          <ModalHeader>
            <div
              style={{
                position: 'absolute',
                right: '1rem',
                display: 'flex',
              }}>
              <HStack gap="3">
                {isDone ? (
                  <TooltipMobile label="rendez-vous fini" background="green.500" placement="top-end" hasArrow>
                    <CheckCircle color="green" />
                  </TooltipMobile>
                ) : (
                  <TooltipMobile label="rendez-vous en attente" background="orange.400" placement="top-end" hasArrow>
                    <MinusCircle color="orange" />
                  </TooltipMobile>
                )}
                {isNewTreatment && (
                  <TooltipMobile
                    label="Attention, en supprimant ce rendez-vous, le système risque de réagir de manière imprévue par rapport aux autres rendez-vous."
                    background="red.500"
                    placement="bottom-start"
                    hasArrow>
                    <Info color="red" />
                  </TooltipMobile>
                )}
              </HStack>
            </div>

            {start && (
              <HStack color="Highlight" gap="2">
                <Text>
                  {formatDate(start, 'yy.MM.dd')} du {formatDate(start, 'hh:mm')} à {formatDate(end, 'hh:mm')}
                </Text>
              </HStack>
            )}
            <HStack color="Highlight" gap="2" mt="2">
              <Text fontSize="1rem">
                {patient?.fullName} / {formatDate(patient?.birthDate)}
              </Text>
            </HStack>
            <HStack color="Highlight" gap="1" mt="2">
              <Phone size="1rem" />
              <Text fontSize="1rem">{formatPhoneNumber(patient?.phoneNumber)}</Text>
            </HStack>
            <HStack color="Highlight" gap="2" mt="2">
              <HStack gap="6">
                <Text fontSize="1rem">T: {formatMoney(totalPrice)}</Text>
                <Text fontSize="1rem">V: {formatMoney(payment)}</Text>
                <Text fontSize="1rem">R: {formatMoney(paymentLeft)}</Text>
              </HStack>
            </HStack>
          </ModalHeader>
          <ModalBody>
            <Stack spacing="2">
              <FormControl>
                <FormLabel>Motif de consultation:</FormLabel>
                <Input value={motif?.name} readOnly />
              </FormControl>
              <HStack>
                <FormControl>
                  <FormLabel>Diagnostique:</FormLabel>
                  <Textarea value={diagnostic} readOnly />
                </FormControl>
                <FormControl>
                  <FormLabel>Plan de traitement:</FormLabel>
                  <Textarea value={treatmentPlan} readOnly />
                </FormControl>
              </HStack>
              <HStack>
                <FormControl>
                  <FormLabel>Etate général (note):</FormLabel>
                  <Textarea value={patient?.generalState} readOnly />
                </FormControl>
              </HStack>
            </Stack>
          </ModalBody>
          <ModalFooter>
            {!canDeleteEvent ? (
              <>
                <Button colorScheme="orange" mr={3} onClick={onDeleteEventIntent}>
                  Supprimer
                </Button>
              </>
            ) : (
              <Button type="submit" mr={3} colorScheme="red" onClick={deleteEvent}>
                Confirmer est sortie
              </Button>
            )}
            <Button
              variant="solid"
              onClick={() => {
                setCanDeleteEvent(false)
                onClose()
              }}>
              Annuler
            </Button>
          </ModalFooter>
        </Loader>
      </ModalContent>
    </Modal>
  )
}
