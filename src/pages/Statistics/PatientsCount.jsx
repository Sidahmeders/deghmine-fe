import { Card } from '@chakra-ui/card'
import { BarChart, Bar, Brush, ReferenceLine, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

import { MOCK_PATIENTS_COUNT_DATA } from '@fakeDB'

const PatientsCount = () => {
  return (
    <Card variant="filled" bg="gray.50" overflow="auto" width="500px" height="300px">
      <BarChart
        width={500}
        height={300}
        data={MOCK_PATIENTS_COUNT_DATA}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ lineHeight: '40px' }} />
        <ReferenceLine y={0} stroke="#000" />
        <Brush dataKey="name" height={30} stroke="#8884d8" />
        <Bar dataKey="enAttente" name="Attendus" fill="#8884d8" />
        <Bar dataKey="fini" name="Fini" fill="#82ca9d" />
      </BarChart>
    </Card>
  )
}

export default PatientsCount
