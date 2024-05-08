import { useEffect, useState } from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Tooltip,
  FormControl,
  Input,
  HStack,
  CardFooter,
  Text,
  Box,
  useToast,
} from '@chakra-ui/react'
import { subDays } from 'date-fns'

import { formatDate, formatMoney } from '@utils'
import { fetchAppointmentsRevenueByDateRange } from '@services/statistics'

const PaymentRatio = () => {
  const toast = useToast()
  const [startDate, setStartDate] = useState(subDays(new Date(), 30))
  const [endDate, setEndDate] = useState(new Date())
  const [appointmentsRevenue, setAppointmentsRevenue] = useState({})

  const { totalPrice, paymentLeft } = appointmentsRevenue
  const TOTAL = totalPrice || 0
  const PAID = totalPrice - paymentLeft || 0
  const REMAINING = paymentLeft || 0
  const paidPercentage = Math.round((PAID / TOTAL) * 100) || 0

  useEffect(() => {
    ;(async () => {
      try {
        const appointmentsRevenueData = await fetchAppointmentsRevenueByDateRange(startDate, endDate)
        setAppointmentsRevenue(appointmentsRevenueData)
      } catch (error) {
        toast({ description: error.message })
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, startDate])

  return (
    <Card variant="filled" bg="gray.50" overflow="auto" width="450px" height="300px">
      <CardHeader pb="1" display="flex" justifyContent="space-around">
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
      </CardHeader>

      <CardBody px="8">
        <Text textAlign="center" mx="7" mb="6" color="purple.600">
          Analyse des transactions de paiement des rendez-vous
        </Text>

        <HStack fontWeight="semibold" justify="space-between">
          <Text>Total:</Text>
          <Text fontSize="14" fontWeight="normal" color="gray.500">
            (100%)
          </Text>
          <Text>{formatMoney(TOTAL)}</Text>
        </HStack>
        <HStack fontWeight="semibold" justify="space-between" color="#ff930f">
          <Text>Payé:</Text>
          <Text fontSize="14" fontWeight="normal" color="gray.500">
            ({paidPercentage}%)
          </Text>
          <Text>{formatMoney(PAID)}</Text>
        </HStack>
        <HStack fontWeight="semibold" justify="space-between" color="#1f7ea1">
          <Text>Reste:</Text>
          <Text fontSize="14" fontWeight="normal" color="gray.500">
            ({100 - paidPercentage}%)
          </Text>
          <Text>{formatMoney(REMAINING)}</Text>
        </HStack>
      </CardBody>

      <CardFooter px="8">
        <Tooltip label={`${formatMoney(REMAINING)}`} bg="blue.200" placement="top-end" hasArrow>
          <Box width="100%" height="6" borderRadius="full" bg="#1f7ea166" overflow="hidden">
            <Tooltip label={`${formatMoney(PAID)}`} bg="orange.400" placement="top-start" hasArrow>
              <Box width={`${paidPercentage}%`} height="100%" bg="#ff930f" />
            </Tooltip>
          </Box>
        </Tooltip>
      </CardFooter>
    </Card>
  )
}

export default PaymentRatio
