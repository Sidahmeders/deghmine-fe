import { useEffect, useState } from 'react'
import { Button, InputGroup, Input, useToast, InputLeftElement } from '@chakra-ui/react'
import { CardBody } from '@chakra-ui/card'
import { debounce } from 'lodash'

import { AppointmentsState, ChatState } from '@context'
import { getLocalUser, notify } from '@utils'
import { CREATE_APPOINTMENT_NAMES, CREATE_PAYMENT_NAMES, APPOINTMENT_EVENT_LISTENERS } from '@config'
import { updateAppointmentSync } from '@services/appointments'
import { createPayment } from '@services/payments'

const updateAppointmentState = debounce(
  ({ updatedAppointment, setAppointment, setTotalPriceVal, setPaymentVal, setPaymentLeftVal }) => {
    const { totalPrice, payment, paymentLeft } = updatedAppointment
    setAppointment(updatedAppointment)
    setTotalPriceVal(totalPrice)
    setPaymentVal(payment)
    setPaymentLeftVal(paymentLeft)
  },
)

const updatePaymentsState = debounce(({ createdPayment, setTodayPaymentHistory }) => {
  setTodayPaymentHistory((paymentHistory) => [...paymentHistory, createdPayment])
  notify({
    title: `paiement effectué par "${createdPayment.payerName}"`,
    description: `payé: ${createdPayment.amount} DA`,
  })
})

const PaymentCard = ({ appointmentData, showPaymentCard }) => {
  const { fullName, patientId } = appointmentData
  const toast = useToast()
  const { socket } = ChatState()
  const { setTodayPaymentHistory, fetchWorkAppointments } = AppointmentsState()
  const [appointment, setAppointment] = useState(appointmentData)
  const [paymentVal, setPaymentVal] = useState(appointment.payment || 0)
  const [totalPriceVal, setTotalPriceVal] = useState(appointment.totalPrice || 0)
  const [paymentLeftVal, setPaymentLeftVal] = useState(appointment.paymentLeft || 0)
  const [canUpdatePayments, setCanUpdatePayments] = useState(false)
  const [canShowUpdateBtn, setCanShowUpdateBtn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const updatePaymentVal = (e) => {
    setCanShowUpdateBtn(true)
    const { value } = e.target
    const difference = paymentVal - value

    setPaymentVal(value)
    if (difference < 0) {
      setPaymentLeftVal(paymentLeftVal - Math.abs(difference))
    } else {
      setPaymentLeftVal(paymentLeftVal + Math.abs(difference))
    }
  }

  const updateTotalPriceVal = (e) => {
    const { value } = e.target
    const difference = appointment.totalPrice - value

    setTotalPriceVal(value)
    if (difference < 0) {
      setPaymentLeftVal(appointment.paymentLeft + Math.abs(difference))
    } else {
      setPaymentLeftVal(appointment.paymentLeft - Math.abs(difference))
    }
    setCanShowUpdateBtn(true)
  }

  const handlePaymentsUpdate = async () => {
    setIsLoading(true)
    try {
      const appointmentUpdate = {
        [CREATE_APPOINTMENT_NAMES.TOTAL_PRICE]: totalPriceVal,
        [CREATE_APPOINTMENT_NAMES.PAYMENT]: paymentVal - appointment.payment,
      }

      const updatedAppointment = await updateAppointmentSync(appointment._id, appointmentUpdate)

      if (paymentVal !== appointment.payment) {
        const paymentUpdate = {
          [CREATE_PAYMENT_NAMES.SENDER]: getLocalUser()?._id,
          [CREATE_PAYMENT_NAMES.PATIENT]: patientId,
          [CREATE_PAYMENT_NAMES.AMOUNT]: paymentVal - appointment.payment,
          [CREATE_PAYMENT_NAMES.PAYER_NAME]: fullName,
        }
        const createdPayment = await createPayment(new Date(), paymentUpdate)
        socket.emit(APPOINTMENT_EVENT_LISTENERS.PAYMENT_APPOINTMENT, { updatedAppointment, createdPayment })
      } else {
        socket.emit(APPOINTMENT_EVENT_LISTENERS.UPDATE_APPOINTMENT, updatedAppointment)
      }

      setCanUpdatePayments(false)
      setCanShowUpdateBtn(false)
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  const cancelPaymentUpdate = () => {
    setTotalPriceVal(appointment.totalPrice)
    setPaymentVal(appointment.payment)
    setPaymentLeftVal(appointment.paymentLeft)
    setCanUpdatePayments(false)
    setCanShowUpdateBtn(false)
  }

  useEffect(() => {
    socket.on(APPOINTMENT_EVENT_LISTENERS.PAYMENT_APPOINTMENT, (payload) => {
      try {
        const { updatedAppointment, createdPayment } = payload

        if (!updatedAppointment && createdPayment) {
          updatePaymentsState({ createdPayment, setTodayPaymentHistory })
        }

        if (updatedAppointment?._id === appointment._id) {
          updateAppointmentState({
            updatedAppointment,
            setAppointment,
            setTotalPriceVal,
            setPaymentVal,
            setPaymentLeftVal,
          })
          updatePaymentsState({ createdPayment, setTodayPaymentHistory })
          fetchWorkAppointments()
        }
      } catch (error) {
        toast({ description: error.description })
      }
    })

    socket.on(APPOINTMENT_EVENT_LISTENERS.UPDATE_APPOINTMENT, (updatedAppointment) => {
      try {
        if (updatedAppointment._id === appointment._id) {
          updateAppointmentState({
            updatedAppointment,
            setAppointment,
            setTotalPriceVal,
            setPaymentVal,
            setPaymentLeftVal,
          })
          fetchWorkAppointments()
        }
      } catch (error) {
        toast({ description: error.description })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    showPaymentCard && (
      <CardBody p="0.25rem 1rem" mr="0">
        <InputGroup gap="2">
          <InputGroup className="payments-input">
            <InputLeftElement children={<label>T :</label>} />
            <Input type="number" min={0} step={500} value={totalPriceVal} onChange={updateTotalPriceVal} />
          </InputGroup>
          <InputGroup className="payments-input">
            <InputLeftElement children={<label>V :</label>} />
            <Input type="number" value={paymentVal} min={0} step={500} onChange={updatePaymentVal} />
          </InputGroup>
          <InputGroup className="payments-input">
            <InputLeftElement children={<label>R :</label>} />
            <Input type="number" readOnly value={paymentLeftVal} />
          </InputGroup>
        </InputGroup>
        {canShowUpdateBtn && canUpdatePayments && (
          <Button colorScheme="orange" mt="2" mb="2" onClick={handlePaymentsUpdate} isDisabled={isLoading}>
            Confirmer modification
          </Button>
        )}
        {canShowUpdateBtn && !canUpdatePayments && (
          <Button colorScheme="purple" mt="2" mb="2" onClick={() => setCanUpdatePayments(true)}>
            Enregistrer modification
          </Button>
        )}
        {canShowUpdateBtn && (
          <Button ml="2" onClick={cancelPaymentUpdate} isDisabled={isLoading}>
            Annuler
          </Button>
        )}
      </CardBody>
    )
  )
}

export default PaymentCard
