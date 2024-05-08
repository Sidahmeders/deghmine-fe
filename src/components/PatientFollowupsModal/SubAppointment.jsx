import { useRef, useState } from 'react'
import { Button } from '@chakra-ui/react'
import { X } from 'react-feather'

import { formatDate } from '@utils'
import { CREATE_APPOINTMENT_NAMES } from '@config'

const SubAppointment = ({ appointment, onInputEditHandler, treatmentUpdate, setTreatmentUpdate }) => {
  const { _id, title, payment, startDate, isDone } = appointment
  const [canShowResetBtn, setCanShowResetBtn] = useState(false)
  const titleRef = useRef(title)
  const paymentRef = useRef(payment || '0')

  const resetContentEditable = () => {
    setCanShowResetBtn(false)

    setTreatmentUpdate({
      ...treatmentUpdate,
      [_id]: { title, payment },
    })

    titleRef.current.innerText = appointment.title
    paymentRef.current.innerText = appointment.payment || '0'
  }

  return (
    <tr key={_id}>
      <td
        contentEditable
        suppressContentEditableWarning
        ref={titleRef}
        onInput={(e) => {
          setCanShowResetBtn(true)
          onInputEditHandler(e, _id, CREATE_APPOINTMENT_NAMES.TITLE)
        }}>
        {title}
      </td>
      <td
        contentEditable
        suppressContentEditableWarning
        ref={paymentRef}
        onInput={(e) => {
          setCanShowResetBtn(true)
          onInputEditHandler(e, _id, CREATE_APPOINTMENT_NAMES.PAYMENT, appointment.payment)
        }}>
        {payment || '0'}
      </td>
      <td>{isDone ? 'Oui' : 'No'}</td>
      <td>{formatDate(startDate)}</td>
      {canShowResetBtn && (
        <td style={{ padding: '0', width: '35px' }}>
          <Button variant="ghost" p="0" onClick={resetContentEditable}>
            <X color="orange" size="1.5rem" />
          </Button>
        </td>
      )}
    </tr>
  )
}

export default SubAppointment
