import React from 'react'
import PropTypes from 'prop-types'
import { ChevronLeft, ChevronRight } from 'react-feather'
import { isValid } from 'date-fns'
import { CALENDAR_NAVIGATION } from '@config'

import DatePicker from '@components/DatePicker/DatePicker'

const ViewNamesGroup = ({ views: viewNames, view, messages, onView }) => {
  return viewNames.map((name) => (
    <button type="button" key={name} className={view === name ? 'rbc-active' : ''} onClick={() => onView(name)}>
      {messages[name]}
    </button>
  ))
}

ViewNamesGroup.propTypes = {
  messages: PropTypes.object,
  onView: PropTypes.func,
  view: PropTypes.string,
  views: PropTypes.array,
}

export default function CustomToolbar({
  date,
  label,
  localizer: { messages },
  onNavigate,
  onView,
  view,
  views,
  setSelectedDate,
}) {
  return (
    <div className="rbc-toolbar">
      <span className="rbc-btn-group">
        <ViewNamesGroup view={view} views={views} messages={messages} onView={onView} />
      </span>

      <span className="rbc-toolbar-label">
        <div>{label}</div>
        <div style={{ width: '12rem' }}>
          <DatePicker
            showMonthYearPicker
            className="calendar-date-picker"
            dateFormat="EEEE dd MMM yyyy"
            value={date}
            onChange={(value) => (isValid(value) ? setSelectedDate(value) : '')}
          />
        </div>
      </span>

      <span className="rbc-btn-group custom-toolbar">
        <button type="button" onClick={() => onNavigate(CALENDAR_NAVIGATION.PREVIOUS)} aria-label={messages.previous}>
          <ChevronLeft width={40} height={28} />
        </button>
        <button
          style={{ height: '40px' }}
          type="button"
          onClick={() => onNavigate(CALENDAR_NAVIGATION.TODAY)}
          aria-label={messages.today}>
          Aujourd'hui
        </button>
        <button type="button" onClick={() => onNavigate(CALENDAR_NAVIGATION.NEXT)} aria-label={messages.next}>
          <ChevronRight width={40} height={28} />
        </button>
      </span>
    </div>
  )
}

CustomToolbar.propTypes = {
  date: PropTypes.instanceOf(Date),
  label: PropTypes.string,
  localizer: PropTypes.object,
  messages: PropTypes.object,
  onNavigate: PropTypes.func,
  onView: PropTypes.func,
  view: PropTypes.string,
  views: PropTypes.array,
}
