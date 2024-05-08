import { useCallback, useEffect, useState } from 'react'
import { Card, CardHeader } from '@chakra-ui/card'
import { FormControl, Input, Stack, useToast, HStack, FormLabel, Switch } from '@chakra-ui/react'
import { PieChart, Pie } from 'recharts'
import { subDays } from 'date-fns'

import { PAYMENT_CATEGORY_DATA } from '@fakeDB'
import { MOTIF_MAP } from '@config'
import { formatDate } from '@utils'
import { fetchPaymentMotifByDateRange } from '@services/statistics'

import RenderActiveShape from './RenderActiveShape'

const MotifPaymentRatio = () => {
  const toast = useToast()
  const [activeIndex, setActiveIndex] = useState(0)
  const [paymentMotifData, setPaymentMotifData] = useState([])
  const [startDate, setStartDate] = useState(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState(new Date())
  const [useMockData, setUseMockData] = useState(false)

  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index)
    },
    [setActiveIndex],
  )

  useEffect(() => {
    ;(async () => {
      try {
        const paymentMotif = await fetchPaymentMotifByDateRange(startDate, endDate)
        setPaymentMotifData(paymentMotif.map((item) => ({ name: MOTIF_MAP[item._id], value: item.totalPayment })))
      } catch (error) {
        toast({ description: error.message })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, startDate])

  return (
    <Card variant="filled" bg="gray.50" overflow="auto" width="500px" height="380px">
      <CardHeader pb="0" display="flex" justifyContent="space-around">
        <Stack align="center">
          <HStack>
            <FormControl width="150px" mr="1">
              <Input
                type="date"
                variant="unstyled"
                bg="#fff"
                borderRadius="md"
                px="4"
                value={formatDate(startDate)}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </FormControl>

            <FormControl width="150px" mr="1">
              <Input
                type="date"
                variant="unstyled"
                bg="#fff"
                borderRadius="md"
                px="4"
                value={formatDate(endDate)}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </FormControl>
          </HStack>

          <FormControl transform="translateY(4px)" w="fit-content" display="flex">
            <FormLabel htmlFor="use-mock-data" fontSize="xs" mx="1">
              faux données?
            </FormLabel>
            <Switch
              mt="0.5"
              size="sm"
              id="use-mock-data"
              colorScheme="green"
              checked={useMockData}
              onChange={() => setUseMockData(!useMockData)}
            />
          </FormControl>
        </Stack>
      </CardHeader>

      <PieChart width={500} height={300}>
        <Pie
          activeIndex={activeIndex}
          activeShape={RenderActiveShape}
          data={useMockData ? PAYMENT_CATEGORY_DATA : paymentMotifData}
          cx={240}
          cy={140}
          innerRadius={70}
          outerRadius={90}
          fill="#8884d8"
          dataKey="value"
          onMouseEnter={onPieEnter}
        />
      </PieChart>
    </Card>
  )
}

export default MotifPaymentRatio
