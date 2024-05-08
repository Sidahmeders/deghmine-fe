import { useEffect, useState } from 'react'
import { useDisclosure, Button, IconButton, Box, Flex, Heading, Stack, Skeleton, useToast } from '@chakra-ui/react'
import { Card, CardHeader } from '@chakra-ui/card'
import { ChevronDown, ChevronUp, Edit2 } from 'react-feather'
import { isBoolean } from 'lodash'

import { ChatState, AppointmentsState } from '@context'
import { setPatient } from '@utils'
import { APPOINTMENT_EVENT_LISTENERS } from '@config'
import { toggleAppointmentConfirmation, toggleAppointmentLeave } from '@services/appointments'
import { fetchPatientById } from '@services/patients'

import PatientFollowupsModal from '@components/PatientFollowupsModal/PatientFollowupsModal'
import PaymentCard from './PaymentCard'
import ConfirmSound from '../../assets/songs/confirm-tone.mp3'
import LeaveSound from '../../assets/songs/leave-tone.mp3'

export const LoadingCards = () => (
  <Stack mt="2">
    <Skeleton height="3rem" />
    <Skeleton height="3rem" />
    <Skeleton height="3rem" />
  </Stack>
)

export default function AppointmentCard({ appointment, withConfirm, withPresence, index }) {
  const { fullName, motif } = appointment
  const { socket } = ChatState()
  const { fetchWorkAppointments } = AppointmentsState()
  const {
    isOpen: isPatientFollowupsModalOpen,
    onOpen: onPatientFollowupsModalOpen,
    onClose: onPatientFollowupsModalClose,
  } = useDisclosure()
  const toast = useToast()

  const [isConfirmed, setIsConfirmed] = useState(appointment.isConfirmed)
  const [isLeft, setIsLeft] = useState(appointment.isLeft)
  const [showPaymentCard, setShowPaymentCard] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleConfirmation = async () => {
    setIsLoading(true)
    try {
      const confirmedPatient = await toggleAppointmentConfirmation(appointment.id, isConfirmed)
      if (isBoolean(confirmedPatient.isConfirmed)) {
        socket.emit(APPOINTMENT_EVENT_LISTENERS.CONFIRM_APPOINTMENT, confirmedPatient)
      }
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  const handlePresence = async () => {
    setIsLoading(true)
    try {
      const leftPatient = await toggleAppointmentLeave(appointment.id, isLeft)
      if (isBoolean(leftPatient.isLeft)) {
        socket.emit(APPOINTMENT_EVENT_LISTENERS.LEAVE_APPOINTMENT, leftPatient)
      }
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  const openEditAppointmentFollowups = async () => {
    setIsLoading(true)
    try {
      onPatientFollowupsModalOpen()
      const patientData = await fetchPatientById(appointment.patientId)
      setPatient(patientData)
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  useEffect(() => {
    socket.on(APPOINTMENT_EVENT_LISTENERS.CONFIRM_APPOINTMENT, (payload) => {
      try {
        if (payload._id === appointment._id) {
          setIsConfirmed(payload.isConfirmed)
          fetchWorkAppointments()
          new Audio(ConfirmSound).play()
        }
      } catch (error) {
        toast({ description: error.description })
      }
    })

    socket.on(APPOINTMENT_EVENT_LISTENERS.LEAVE_APPOINTMENT, (payload) => {
      try {
        if (payload._id === appointment._id) {
          setIsLeft(payload.isLeft)
          fetchWorkAppointments()
          new Audio(LeaveSound).play()
        }
      } catch (error) {
        toast({ description: error.description })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (isLoading) return <Skeleton mt="2" height="3rem" />

  return (
    <>
      <PatientFollowupsModal isOpen={isPatientFollowupsModalOpen} onClose={onPatientFollowupsModalClose} />
      <Card
        className={`card-container ${withConfirm && isConfirmed && 'confirmed'} ${withPresence && isLeft && 'left'}`}>
        <CardHeader p="1">
          <Flex spacing="4">
            {index !== undefined && (
              <Button variant="unstyled" color="red.600" p="0" m="0" minWidth="1.75rem">
                {index + 1}
              </Button>
            )}
            <Flex flex="1" gap="2" justifyContent="space-between" alignItems="center">
              <Box pl="2">
                <Heading size="sm" display="flex">
                  {fullName.slice(0, 20)} / {motif?.name.slice(0, 15)}
                </Heading>
              </Box>
              {withPresence && (
                <IconButton variant="ghost" p="0" icon={<>{isLeft ? 'A' : 'P'}</>} onClick={handlePresence} />
              )}
              {withConfirm && (
                <IconButton variant="ghost" p="0" icon={<>{isConfirmed ? 'C' : 'NC'}</>} onClick={handleConfirmation} />
              )}
            </Flex>
            <IconButton variant="ghost" icon={<Edit2 size="1rem" />} onClick={openEditAppointmentFollowups} />
            <IconButton
              variant="ghost"
              icon={showPaymentCard ? <ChevronUp /> : <ChevronDown />}
              onClick={() => setShowPaymentCard(!showPaymentCard)}
            />
          </Flex>
        </CardHeader>
        <PaymentCard appointmentData={appointment} showPaymentCard={showPaymentCard} />
      </Card>
    </>
  )
}
