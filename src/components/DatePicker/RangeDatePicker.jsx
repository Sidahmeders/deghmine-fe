import { forwardRef } from 'react'
import propTypes from 'prop-types'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { fr } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import './RangePickers.scss'

registerLocale(fr)

export default function RangeDatePicker({ rangeValue, onChange, dateFormat, className, ...props }) {
  const [startDate, endDate] = rangeValue || []

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className={className} ref={ref} onClick={onClick}>
      {value}
    </button>
  ))

  return (
    <ReactDatePicker
      withPortal
      selectsRange
      fixedHeight
      maxDate={new Date()}
      monthsShown={2}
      locale={fr}
      calendarStartDay={6}
      dateFormat={dateFormat}
      dropdownMode="select"
      placeholderText="sélectionner une date"
      todayButton="Aujourd'hui"
      customInput={<CustomInput />}
      startDate={startDate}
      endDate={endDate}
      onChange={(newValue) => {
        if (onChange) {
          onChange(newValue)
        }
      }}
      {...props}
    />
  )
}

RangeDatePicker.propTypes = {
  rangeValue: propTypes.arrayOf(propTypes.instanceOf(Date)),
  onChange: propTypes.func,
  dateFormat: propTypes.string,
  className: propTypes.string,
}

RangeDatePicker.defaultProps = {
  rangeValue: [new Date(), new Date()],
  onChange: () => {},
  dateFormat: 'yyyy/MM/dd',
  className: 'date-range-picker',
}
