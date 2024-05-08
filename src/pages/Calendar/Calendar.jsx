import React, { useCallback, useRef, useState, useEffect } from 'react'
import { useDisclosure, useToast } from '@chakra-ui/react'
import { useSwipeable } from 'react-swipeable'
import PropTypes from 'prop-types'
import { Calendar as BigCalendar, DateLocalizer, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { registerLocale } from 'react-datepicker'
import { format, parse, startOfWeek, getDay, addHours, addDays, addMonths, subDays, subMonths } from 'date-fns'
import { fr } from 'date-fns/locale'

import { formatDate, getCalendarView, setCalendarView } from '@utils'
import { AVAILABILITY_BG_COLORS } from '@config'
import { fetchMonthAppointments, updateAppointment } from '@services/appointments'
import { fetchCalendarAvailabilities } from '@services/calendar'

import AddAppointmentModal from '@components/AddAppointmentModal/AddAppointmentModal'
import DisplayEventModal from '@components/DisplayEventModal'
import CustomToolbar from './CustomToolbar'
import CustomAgenda from './CustomAgenda'

import './Calendar.scss'

const DnDCalendar = withDragAndDrop(BigCalendar)

const messages = {
  month: 'Mois',
  week: 'Semaine',
  day: 'Jour',
  agenda: 'Liste',
  date: 'Date',
  time: 'Heure',
  event: 'Evenement',
}

const fnslocalizer = dateFnsLocalizer({
  format,
  parse,
  getDay,
  locales: { fr: fr },
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 6 }),
})

registerLocale(fr)

export default function Calendar({ localizer = fnslocalizer, ...props }) {
  const {
    isOpen: isAddAppointmentModalOpen,
    onOpen: onAddAppointmentModalOpen,
    onClose: onAddAppointmentModalClose,
  } = useDisclosure()
  const {
    isOpen: isDisplayEventModalOpen,
    onOpen: onDisplayEventModalOpen,
    onClose: onDisplayEventModalClose,
  } = useDisclosure()
  const toast = useToast()
  const clickRef = useRef(null)
  const defaultView = getCalendarView()

  const [events, setEvents] = useState([])
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedSlotInfo, setSelectedSlotInfo] = useState({})
  const [selectedView, setSelectedView] = useState(defaultView)
  const [selectedEvent, setSelectedEvent] = useState({})
  const [availabilities, setAvailabilities] = useState({})

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (selectedView === 'month') {
        setSelectedDate(addMonths(selectedDate, 1))
      } else {
        setSelectedDate(addDays(selectedDate, 1))
      }
    },
    onSwipedRight: () => {
      if (selectedView === 'month') {
        setSelectedDate(subMonths(selectedDate, 1))
      } else {
        setSelectedDate(subDays(selectedDate, 1))
      }
    },
  })

  const showMoreDetails = (callEvent) => {
    setSelectedEvent(callEvent)
    onDisplayEventModalOpen()
  }

  const onSelectEvent = useCallback((callEvent) => {
    /**
     * Here we are waiting 250 milliseconds (use what you want) prior to firing
     * our method. Why? Because both 'click' and 'doubleClick'
     * would fire, in the event of a 'doubleClick'. By doing
     * this, the 'click' handler is overridden by the 'doubleClick'
     * action.
     */
    clearTimeout(clickRef?.current)
    clickRef.current = setTimeout(() => showMoreDetails(callEvent, 'onSelectEvent'), 250)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onDoubleClickEvent = useCallback((callEvent) => {
    clearTimeout(clickRef?.current)
    clickRef.current = setTimeout(() => showMoreDetails(callEvent, 'onDoubleClickEvent'), 250)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onSelectSlot = useCallback(
    (slotInfo) => {
      /**
       * Here we are waiting 250 milliseconds (use what you want) prior to firing
       * our method. Why? Because both 'click' and 'doubleClick'
       * would fire, in the event of a 'doubleClick'. By doing
       * this, the 'click' handler is overridden by the 'doubleClick'
       * action.
       */
      clearTimeout(clickRef?.current)
      clickRef.current = setTimeout(() => 'TODO', 250)
      setSelectedSlotInfo(slotInfo)
      onAddAppointmentModalOpen()
    },
    [onAddAppointmentModalOpen],
  )

  const onEventDrop = async ({ event, start, end }) => {
    try {
      const endDate = selectedView === 'day' ? addHours(start, 1) : end
      const updatedAppointment = await updateAppointment(event._id, { startDate: start, endDate })
      const updatedEvents = events.map((appointment) => {
        if (appointment.id === updatedAppointment._id) {
          return {
            ...appointment,
            start: new Date(updatedAppointment.startDate),
            end: new Date(updatedAppointment.endDate),
          }
        }
        return appointment
      })
      setEvents(updatedEvents)
    } catch (error) {
      toast({ description: error.message })
    }
  }

  useEffect(() => {
    /**
     * What Is This?
     * This is to prevent a memory leak, in the off chance that you
     * teardown your interface prior to the timed method being called.
     */
    return () => {
      clearTimeout(clickRef?.current)
    }
  }, [])

  useEffect(() => {
    ;(async () => {
      try {
        const monthAppointments = await fetchMonthAppointments(selectedDate)
        const eventsList = monthAppointments.map((event) => ({
          ...event,
          id: event._id,
          title: `
            ${event?.patient?.fullName} /
            ${event?.motif?.name} /
            ${event?.title} /
            T: ${event?.totalPrice || '0'} /
            V: ${event?.payment || '0'}
          `,
          start: new Date(event.startDate),
          end: new Date(event.endDate),
        }))
        setEvents(eventsList)

        const monthAvailabilities = await fetchCalendarAvailabilities(selectedDate)
        setAvailabilities(
          monthAvailabilities.reduce((acc, item) => ({ ...acc, [formatDate(item.date)]: item.availability }), {}),
        )
      } catch (error) {
        toast({ description: error.message })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate])

  return (
    <div {...swipeHandlers} className="calendar-container" {...props}>
      <AddAppointmentModal
        selectedView={selectedView}
        selectedSlotInfo={selectedSlotInfo}
        isOpen={isAddAppointmentModalOpen}
        onClose={onAddAppointmentModalClose}
        setEvents={setEvents}
        setAvailabilities={setAvailabilities}
      />
      <DisplayEventModal
        isOpen={isDisplayEventModalOpen}
        onClose={onDisplayEventModalClose}
        selectedEvent={selectedEvent}
        setEvents={setEvents}
      />
      <DnDCalendar
        selectable
        culture="fr"
        localizer={localizer}
        events={events}
        date={selectedDate}
        onNavigate={(date) => setSelectedDate(date)}
        min={new Date(1972, 0, 1, 9, 0, 59)}
        max={new Date(1972, 0, 1, 17, 30, 59)}
        step={30}
        messages={messages}
        onSelectEvent={onSelectEvent}
        onDoubleClickEvent={onDoubleClickEvent}
        onSelectSlot={onSelectSlot}
        onEventDrop={onEventDrop}
        defaultView={defaultView}
        onView={(view) => {
          setSelectedView(view)
          setCalendarView(view)
        }}
        views={{ month: true, day: true, agenda: CustomAgenda }}
        dayPropGetter={(date) => ({ style: { background: AVAILABILITY_BG_COLORS[availabilities[formatDate(date)]] } })}
        components={{ toolbar: (props) => <CustomToolbar setSelectedDate={setSelectedDate} {...props} /> }}
      />
    </div>
  )
}

Calendar.propTypes = {
  localizer: PropTypes.instanceOf(DateLocalizer),
}
