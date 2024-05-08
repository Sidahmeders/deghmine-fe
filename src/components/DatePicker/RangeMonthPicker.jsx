import { forwardRef } from 'react'
import propTypes from 'prop-types'
import ReactDatePicker, { registerLocale } from 'react-datepicker'
import { fr } from 'date-fns/locale'
import 'react-datepicker/dist/react-datepicker.css'
import './RangePickers.scss'

registerLocale(fr)

export default function RangeMonthPicker({ rangeValue, onChange, dateFormat, className, ...props }) {
  const [startDate, endDate] = rangeValue || []

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className={className} ref={ref} onClick={onClick}>
      {value}
    </button>
  ))

  const monthsOnlyFilter = (date) => date.getDate() === 1

  return (
    <ReactDatePicker
      withPortal
      selectsRange
      fixedHeight
      showMonthYearPicker
      showFourColumnMonthYearPicker
      filterDate={monthsOnlyFilter}
      locale={fr}
      dateFormat={dateFormat}
      dropdownMode="select"
      placeholderText="sélectionner une date"
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

RangeMonthPicker.propTypes = {
  rangeValue: propTypes.arrayOf(propTypes.instanceOf(Date)),
  onChange: propTypes.func,
  dateFormat: propTypes.string,
  className: propTypes.string,
}

RangeMonthPicker.defaultProps = {
  rangeValue: [new Date(), new Date()],
  onChange: () => {},
  dateFormat: 'yyyy/MM',
  className: 'month-range-picker',
}
