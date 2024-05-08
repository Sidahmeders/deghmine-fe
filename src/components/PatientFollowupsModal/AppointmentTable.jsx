import { useState, useRef } from 'react'
import {
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  useToast,
  Textarea,
} from '@chakra-ui/react'
import { X } from 'react-feather'

import { ChatState } from '@context'
import { formatDate, getPatient } from '@utils'
import { CREATE_APPOINTMENT_NAMES, CREATE_PAYMENT_NAMES, APPOINTMENT_EVENT_LISTENERS } from '@config'
import { updateAppointmentSync } from '@services/appointments'
import { createPayment } from '@services/payments'

import SubAppointment from './SubAppointment'

export default function AppointmentTable({ appointmentsGroup, appointments, setAppointments, onClose }) {
  const toast = useToast()
  const { socket } = ChatState()
  const [baseAppointment] = appointmentsGroup
  const totalPayments = appointmentsGroup.reduce((total, appointment) => total + appointment.payment, 0)
  const paymentLeft = baseAppointment.totalPrice - totalPayments || 0
  const doneAppointments = appointmentsGroup.reduce((count, appointment) => (appointment.isDone ? count + 1 : count), 0)

  const [treatmentUpdate, setTreatmentUpdate] = useState({ [baseAppointment._id]: baseAppointment })
  const [canShowSaveBtn, setCanShowSaveBtn] = useState(false)
  const [canShowResetBtn, setCanShowResetBtn] = useState(false)
  const [canShowConfirmUpdate, setCanShowConfirmUpdate] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const baseTitleRef = useRef(baseAppointment.title)
  const basePaymentRef = useRef(baseAppointment.payment || 0)
  const baseTotalPriceRef = useRef(baseAppointment.totalPrice)

  const onInputEditHandler = (e, appointmentId, name, previousPayment) => {
    const { value, innerText } = e.target
    setTreatmentUpdate({
      ...treatmentUpdate,
      [appointmentId]: {
        ...treatmentUpdate[appointmentId],
        previousPayment,
        [name]: value || innerText,
      },
    })
    setCanShowSaveBtn(true)
  }

  const saveUpdateHandler = async () => {
    setIsLoading(true)
    try {
      const updatedAppointments = await Object.entries(treatmentUpdate).reduce(async (prevPromise, [key, values]) => {
        try {
          const listOfUpdates = await prevPromise

          const { previousPayment, payment } = values
          const appointmentUpdate = {
            _id: key,
            ...values,
            [CREATE_APPOINTMENT_NAMES.PAYMENT]: parseInt(payment) - previousPayment || 0,
          }

          const updatedAppointment = await updateAppointmentSync(appointmentUpdate._id, appointmentUpdate)

          return [...listOfUpdates, updatedAppointment]
        } catch (error) {
          toast({ description: error.message })
        }
      }, Promise.resolve([]))

      setAppointments(
        appointments.map((appointment) => {
          const indexOfAppointment = updatedAppointments.findIndex((item) => item._id === appointment._id)
          if (indexOfAppointment >= 0) {
            return {
              ...appointment,
              ...updatedAppointments[indexOfAppointment],
            }
          }
          return appointment
        }),
      )

      updatedAppointments.reduce(async (prevPromise, appointment) => {
        try {
          await prevPromise
          if (appointment.previousPayment) {
            const paymentUpdate = {
              [CREATE_PAYMENT_NAMES.SENDER]: baseAppointment.sender,
              [CREATE_PAYMENT_NAMES.PATIENT]: baseAppointment.patient,
              [CREATE_PAYMENT_NAMES.AMOUNT]: appointment.payment - appointment.previousPayment,
              [CREATE_PAYMENT_NAMES.PAYER_NAME]: getPatient()?.fullName,
            }
            const createdPayment = await createPayment(new Date(), paymentUpdate)
            socket.emit(APPOINTMENT_EVENT_LISTENERS.PAYMENT_APPOINTMENT, {
              updatedAppointment: appointment,
              createdPayment,
            })
          } else {
            socket.emit(APPOINTMENT_EVENT_LISTENERS.UPDATE_APPOINTMENT, appointment)
          }
        } catch (error) {
          toast({ description: error.message })
        }
      }, Promise.resolve())

      toast({ title: 'rendez-vous mis à jour avec succès!', status: 'success' })
    } catch (error) {
      toast({ description: error.message })
    }

    setIsLoading(false)
    setCanShowSaveBtn(false)
    setCanShowConfirmUpdate(false)
    onClose()
  }

  const cancelUpdateHandler = () => {
    setCanShowSaveBtn(false)
    setCanShowConfirmUpdate(false)
    setTreatmentUpdate({ [baseAppointment._id]: baseAppointment })
  }

  const resetContentEditable = () => {
    setCanShowResetBtn(false)

    const { _id: baseAppointmentId } = baseAppointment
    setTreatmentUpdate({
      ...treatmentUpdate,
      [baseAppointmentId]: {
        [CREATE_APPOINTMENT_NAMES.TITLE]: baseAppointment.title,
        [CREATE_APPOINTMENT_NAMES.TOTAL_PRICE]: baseAppointment.totalPrice,
        [CREATE_APPOINTMENT_NAMES.PAYMENT]: baseAppointment.payment,
      },
    })

    baseTitleRef.current.innerText = baseAppointment.title
    basePaymentRef.current.innerText = baseAppointment.payment || '0'
    baseTotalPriceRef.current.innerText = baseAppointment.totalPrice
  }

  return (
    <table>
      <caption>
        <p style={{ padding: '0.25rem 1rem' }}>
          Reste: <span>{paymentLeft}</span> / Motif: <span>{baseAppointment?.motif?.name}</span>
        </p>
        <Accordion allowMultiple display="flex">
          <AccordionItem width="50%" borderRight="1px solid #ddd">
            <AccordionButton>
              Diagnostic
              <AccordionIcon ml="auto" />
            </AccordionButton>
            <AccordionPanel p="0">
              <Textarea
                border="none"
                value={treatmentUpdate[baseAppointment._id]?.[CREATE_APPOINTMENT_NAMES.DIAGNOSTIC]}
                onChange={(e) => onInputEditHandler(e, baseAppointment._id, CREATE_APPOINTMENT_NAMES.DIAGNOSTIC)}
              />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem width="50%" borderRight="1px solid #ddd" borderBottom="0">
            <AccordionButton>
              Plan de traitement
              <AccordionIcon ml="auto" />
            </AccordionButton>
            <AccordionPanel p="0">
              <Textarea
                border="none"
                value={treatmentUpdate[baseAppointment._id]?.[CREATE_APPOINTMENT_NAMES.TREATMENT_PLAN]}
                onChange={(e) => onInputEditHandler(e, baseAppointment._id, CREATE_APPOINTMENT_NAMES.TREATMENT_PLAN)}
              />
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
      </caption>
      <thead>
        <tr>
          <th>acte</th>
          <th>versement / prix-total</th>
          <th>est fini</th>
          <th>rendez-vous date</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th
            contentEditable
            suppressContentEditableWarning
            onInput={(e) => {
              setCanShowResetBtn(true)
              onInputEditHandler(e, baseAppointment._id, CREATE_APPOINTMENT_NAMES.TITLE)
            }}
            ref={baseTitleRef}>
            {baseAppointment.title}
          </th>
          <th>
            <span
              style={{ display: 'inline-block', width: '65px', outlineColor: '#587ee9' }}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                setCanShowResetBtn(true)
                onInputEditHandler(e, baseAppointment._id, CREATE_APPOINTMENT_NAMES.PAYMENT, baseAppointment.payment)
              }}
              ref={basePaymentRef}>
              {baseAppointment.payment}
            </span>{' '}
            /{' '}
            <span
              style={{ display: 'inline-block', width: '85px', outlineColor: '#587ee9' }}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => {
                setCanShowResetBtn(true)
                onInputEditHandler(e, baseAppointment._id, CREATE_APPOINTMENT_NAMES.TOTAL_PRICE)
              }}
              ref={baseTotalPriceRef}>
              {baseAppointment.totalPrice}
            </span>
          </th>
          <th>
            {doneAppointments} / {appointmentsGroup.length}
          </th>
          <th>{formatDate(baseAppointment.startDate)}</th>
          {canShowResetBtn && (
            <th style={{ padding: '0', width: '35px' }}>
              <Button variant="ghost" p="0" onClick={resetContentEditable}>
                <X color="orange" size="1.5rem" />
              </Button>
            </th>
          )}
        </tr>

        {appointmentsGroup.map((appointment, index) =>
          index > 0 ? (
            <SubAppointment
              key={index}
              appointment={appointment}
              onInputEditHandler={onInputEditHandler}
              treatmentUpdate={treatmentUpdate}
              setTreatmentUpdate={setTreatmentUpdate}
            />
          ) : null,
        )}
      </tbody>
      {canShowSaveBtn && (
        <tfoot>
          <tr>
            <td style={{ border: 'none', padding: '0.75rem 0' }}>
              {canShowConfirmUpdate ? (
                <>
                  <Button type="submit" colorScheme="red" mr={3} onClick={saveUpdateHandler} isDisabled={isLoading}>
                    Confirmer est sortie
                  </Button>
                </>
              ) : (
                <>
                  <Button type="submit" colorScheme="orange" mr={3} onClick={() => setCanShowConfirmUpdate(true)}>
                    Sauvegarder modifications
                  </Button>
                </>
              )}
              <Button variant="ghost" onClick={cancelUpdateHandler} isDisabled={isLoading}>
                Annuler
              </Button>
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  )
}
