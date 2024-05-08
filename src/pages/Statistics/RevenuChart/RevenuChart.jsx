import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { ComposedChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { isValid, subDays, endOfMonth } from 'date-fns'

import { MOCK_MONTH_DATA, MOCK_YEAR_DATA } from '@fakeDB'
import { abbreviateNumber, formatDate } from '@utils'
import { FRENCH_MONTH_NAMES, X_AXIS_DAY_NAMES } from '@config'
import { fetchPaymentsByDateRange } from '@services/statistics'

import CustomLegend from './CustomLegend'
import CustomTooltip from './CustomTooltip'

import './RevenuChart.scss'

const aggregatePaymentsData = (data, isYearFormat = false) => {
  const paymentsMap = new Map()

  data.forEach((payment) => {
    const paymentDate = isYearFormat ? formatDate(payment.date, 'yyyy-MM') : formatDate(payment.date)
    const paymentValue = paymentsMap.get(paymentDate)

    paymentsMap.set(paymentDate, {
      label: X_AXIS_DAY_NAMES[formatDate(paymentDate, 'd')],
      name: isYearFormat ? FRENCH_MONTH_NAMES[formatDate(paymentDate, 'M')] : formatDate(paymentDate, 'dd'),
      revenu: paymentValue ? payment.amount + paymentValue.revenu : payment.amount,
    })
  })

  return [...paymentsMap.values()]
}

const RevenuChart = () => {
  const toast = useToast()
  const [selectedStat, setSelectedStat] = useState({ year: false, month: true })
  const [showEmptyDays, setShowEmptyDays] = useState(false)
  const [dateRangeValue, setDateRangeValue] = useState([subDays(new Date(), 30), new Date()])
  const [yearData, setYearData] = useState([])
  const [monthDateValue, setMonthDateValue] = useState(new Date())
  const [monthData, setMonthData] = useState([])
  const [useMockData, setUseMockData] = useState(false)

  const chosenMonthData = showEmptyDays ? monthData : monthData.filter((day) => day.revenu > 0)

  const chartWidth = window.innerWidth > 480 ? 1200 : 600
  const chartHeight = window.innerWidth > 480 ? 500 : 350

  useEffect(() => {
    ;(async () => {
      try {
        if (useMockData) {
          setMonthData(MOCK_MONTH_DATA)
          return
        }
        const [startDate, endDate] = [
          formatDate(monthDateValue, 'yyyy-MM-01'),
          formatDate(endOfMonth(monthDateValue), 'yyyy-MM-dd'),
        ]
        const monthStatData = await fetchPaymentsByDateRange(startDate, endDate)
        setMonthData(aggregatePaymentsData(monthStatData))
      } catch (error) {
        toast({ description: error.message })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthDateValue, useMockData])

  useEffect(() => {
    ;(async () => {
      try {
        if (useMockData) {
          setYearData(MOCK_YEAR_DATA)
          return
        }
        const [startDate, endDate] = dateRangeValue
        if (!isValid(startDate) || !isValid(endDate)) return
        const yearStatData = await fetchPaymentsByDateRange(startDate, endDate)
        setYearData(aggregatePaymentsData(yearStatData, true))
      } catch (error) {
        toast({ description: error.message })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRangeValue, useMockData])

  return (
    <div className="revenu-stat-container">
      <ComposedChart width={chartWidth} height={chartHeight} data={selectedStat.year ? yearData : chosenMonthData}>
        <CartesianGrid strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          verticalAlign="top"
          content={
            <CustomLegend
              selectedStat={selectedStat}
              setSelectedStat={setSelectedStat}
              showEmptyDays={showEmptyDays}
              setShowEmptyDays={setShowEmptyDays}
              dateRangeValue={dateRangeValue}
              setDateRangeValue={setDateRangeValue}
              monthDateValue={monthDateValue}
              setMonthDateValue={setMonthDateValue}
              useMockData={useMockData}
              setUseMockData={setUseMockData}
            />
          }
        />
        <YAxis tickFormatter={(value) => abbreviateNumber(value)} />
        <XAxis
          tickFormatter={(value) => (selectedStat.year ? yearData[value].name : chosenMonthData[value].label)}
          scale="revenu"
        />
        <Bar dataKey="revenu" barSize={2} fill="#36dd" />
        <Area dataKey="revenu" type="monotone" fill={selectedStat.year ? '#474aff66' : '#36d9'} stroke="#36d" />
      </ComposedChart>
    </div>
  )
}

export default RevenuChart
