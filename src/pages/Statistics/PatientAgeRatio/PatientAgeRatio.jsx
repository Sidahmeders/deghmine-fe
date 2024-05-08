import { useEffect, useState } from 'react'
import { useToast } from '@chakra-ui/react'
import { Card } from '@chakra-ui/card'
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts'

import { MOCK_PATIENTS_AGE_RATIO_DATA } from '@fakeDB'
import { fetchPatientsAgeRatio } from '@services/statistics'

import CustomTooltip from './CustomTooltip'
import CustomLegend from './CustomLegend'
import RenderCustomizedLabel from './RenderCustomizedLabel'

const COLORS = ['#22DDDD', '#0088FE', '#00C49F', '#FFBB28', '#FF8042']

const sortPatientsRatio = (a, b) => {
  const [ageOne] = a?.name?.split('-')
  const [ageTwo] = b?.name?.split('-')
  return parseInt(ageOne) - parseInt(ageTwo)
}

const PatientAge = () => {
  const toast = useToast()
  const [patientsAgeRatio, setPatientsAgeRatio] = useState([])
  const [useMockData, setUseMockData] = useState(false)

  const PatientStatData = useMockData ? MOCK_PATIENTS_AGE_RATIO_DATA : patientsAgeRatio

  useEffect(() => {
    ;(async () => {
      try {
        const patientsAgeRatioData = await fetchPatientsAgeRatio()
        setPatientsAgeRatio(patientsAgeRatioData.sort(sortPatientsRatio))
      } catch (error) {
        toast({ description: error.message })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card variant="filled" bg="gray.50" overflow="auto" width="450px" height="380px">
      <PieChart width={450} height={380}>
        <Tooltip content={CustomTooltip} />
        <Legend verticalAlign content={<CustomLegend useMockData={useMockData} setUseMockData={setUseMockData} />} />
        <Pie
          data={PatientStatData}
          cx={220}
          cy={240}
          outerRadius={120}
          label={RenderCustomizedLabel}
          fill="#8884d8"
          dataKey="count"
          labelLine={false}>
          {PatientStatData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </Card>
  )
}

export default PatientAge
