import PropTypes from 'prop-types'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Text,
} from '@chakra-ui/react'
import * as dates from 'date-arithmetic'
import { Calendar } from 'react-feather'
import { startOfMonth, toDate } from 'date-fns'

import { formatDate, formatMoney } from '@utils'

const rangeFunc = (start, end, unit = 'day') => {
  let current = start
  const days = []
  while (dates.lte(current, end, unit)) {
    days.push(current)
    current = dates.add(current, 1, unit)
  }
  return days
}

const inRange = (e, start, end, accessors) => {
  const eStart = dates.startOf(accessors.start(e), 'day')
  const eEnd = accessors.end(e)
  const startsBeforeEnd = dates.lte(eStart, end, 'day')
  const endsAfterStart = !dates.eq(eStart, eEnd, 'minutes')
    ? dates.gt(eEnd, start, 'minutes')
    : dates.gte(eEnd, start, 'minutes')
  return startsBeforeEnd && endsAfterStart
}

export default function CustomAgenda({ accessors, length, date, events }) {
  const end = dates.add(date, length, 'day')
  const range = rangeFunc(date, end, 'day')
  events = events.filter((event) => inRange(event, date, end, accessors))
  events.sort((a, b) => +accessors.start(a) - +accessors.start(b))

  if (events.length === 0) return "Aucune date d'événement dans la plage"

  return (
    <div>
      {range.map((day, index) => {
        const dayEvents = events.filter((e) =>
          inRange(e, dates.startOf(day, 'day'), dates.endOf(day, 'day'), accessors),
        )

        const totalPayments = dayEvents.reduce((total, event) => total + (event.payment || 0), 0)
        const doneAppointments = dayEvents.reduce((done, event) => (event.isDone ? done + 1 : done), 0)

        return dayEvents.length > 0 ? (
          <Accordion key={index} allowToggle>
            <AccordionItem>
              <AccordionButton>
                <HStack width="100%" gap="4">
                  <HStack>
                    <Calendar color="#26d" size="1rem" />
                    <Text>{formatDate(day, 'yyyy MMMM dd')}</Text>
                  </HStack>
                  <HStack>
                    <Text color="green.500">Total:</Text>
                    <Text>{formatMoney(totalPayments)} DA</Text>
                  </HStack>
                  <HStack>
                    <Text color="orange.500">Fini:</Text>
                    <Text>
                      {doneAppointments}/{dayEvents.length}
                    </Text>
                  </HStack>
                </HStack>
                <AccordionIcon />
              </AccordionButton>
              {dayEvents.map(({ _id, motif, patient, isDone, payment }) => (
                <AccordionPanel key={_id} px="4" py="2" bg={isDone ? 'green.100' : 'orange.100'}>
                  <HStack justifyContent="space-between">
                    <Text display="flex">
                      {patient?.fullName} / {motif?.name}
                    </Text>
                    <Text>{formatMoney(payment || 0)} DA</Text>
                  </HStack>
                </AccordionPanel>
              ))}
            </AccordionItem>
          </Accordion>
        ) : null
      })}
    </div>
  )
}

CustomAgenda.title = (start, { localizer }) => {
  const end = dates.add(start, 1, 'month')
  return localizer.format({ start, end }, 'agendaHeaderFormat')
}

CustomAgenda.navigate = (date, action) => {
  const sDate = toDate(startOfMonth(date))
  switch (action) {
    case 'PREV':
      return dates.add(sDate, -1, 'month')
    case 'NEXT':
      return dates.add(sDate, 1, 'month')
    default:
      return date
  }
}

CustomAgenda.propTypes = {
  events: PropTypes.array,
  date: PropTypes.instanceOf(Date),
  length: PropTypes.number,
  selected: PropTypes.object,
  accessors: PropTypes.object.isRequired,
  components: PropTypes.object.isRequired,
  getters: PropTypes.object.isRequired,
  localizer: PropTypes.object.isRequired,
}
