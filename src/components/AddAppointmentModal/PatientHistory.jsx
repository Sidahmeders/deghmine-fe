import { useEffect, useState } from 'react'
import { RadioGroup, Radio, Table, Tbody, Tr, Td, TableContainer, Button } from '@chakra-ui/react'

import { formatDate, groupAppointments } from '@utils'
import { fetchPatientAppointments } from '@services/appointments'

export default function PatientHistory({ show, patient, baseAppointmentRadioValue, setBaseAppointmentRadioValue }) {
  const [appointments, setAppointments] = useState([])

  useEffect(() => {
    ;(async () => {
      if (!patient._id) return
      const patientAppointments = await fetchPatientAppointments(patient._id)
      setBaseAppointmentRadioValue(patientAppointments[0]?._id)
      setAppointments(groupAppointments(patientAppointments))
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patient])

  return (
    <RadioGroup value={baseAppointmentRadioValue} onChange={setBaseAppointmentRadioValue}>
      {appointments.map(({ group: appointmentsGroup }, index) => (
        <div
          key={index}
          style={{
            display: show ? 'flex' : 'none',
            padding: '4px 8px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            marginBottom: '6px',
          }}>
          <Radio value={appointmentsGroup[0]?._id} size="lg" ml="1" mr="3"></Radio>
          <TreatmentSummary appointmentsGroup={appointmentsGroup} />
        </div>
      ))}
    </RadioGroup>
  )
}

const TreatmentSummary = ({ appointmentsGroup }) => {
  const [baseAppointment] = appointmentsGroup
  const doneAppointments = appointmentsGroup.reduce((count, appointment) => (appointment.isDone ? count + 1 : count), 0)

  const [show, setShow] = useState(false)

  return (
    <div style={{ width: '100%' }}>
      <div style={{ position: 'relative' }}>
        <span>{baseAppointment.diagnostic?.slice(0, 45)}..</span>
        <br />
        <span>{baseAppointment.treatmentPlan?.slice(0, 45)}..</span>
        <br />
        <span>
          Prix total: <strong>{baseAppointment.totalPrice} DA</strong>
        </span>

        <span style={{ fontWeight: 'bold', position: 'absolute', top: '0', right: '0' }}>
          {doneAppointments} / {appointmentsGroup.length}
        </span>
        <Button
          variant="link"
          p="0"
          onClick={() => setShow(!show)}
          style={{ position: 'absolute', top: '48px', right: '0' }}>
          {show ? 'voir moins..' : 'voir plus..'}
        </Button>
      </div>

      <TableContainer>
        <Table>
          <Tbody>
            {appointmentsGroup.map((appointment) => {
              const { _id, startDate, motif, title, payment } = appointment

              return (
                <Tr key={_id} style={{ display: show ? 'block' : 'none' }}>
                  <Td p="1" borderRight="1px solid #ddd" width="80px">
                    {formatDate(startDate, 'yy.MM.dd')}
                  </Td>
                  <Td p="1" borderRight="1px solid #ddd" width="90px">
                    V: {payment || '0'}
                  </Td>
                  <Td p="1" borderRight="1px solid #ddd" width="120px">
                    {motif?.name?.slice(0, 10)}..
                  </Td>
                  <Td p="1">{title?.slice(0, 15)}..</Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </TableContainer>
    </div>
  )
}
