import { Card, CardBody, Stack, HStack } from '@chakra-ui/react'

import PaymentRatio from './PaymentRatio'
import RevenuChart from './RevenuChart/RevenuChart'
import MotifPaymentRatio from './MotifPaymentRatio/MotifPaymentRatio'
import WorkLoadChart from './WorkLoadChart'
import PatientAgeRatio from './PatientAgeRatio/PatientAgeRatio'
import PatientsCount from './PatientsCount'

const Statistics = () => (
  <Stack gap="8" width="100%" maxW="85rem" px="2" mt="2">
    <HStack gap="4" display="flex" justify="center" flexWrap="wrap">
      <Card ml="2">
        <CardBody p="1" overflow="auto">
          <PaymentRatio />
        </CardBody>
      </Card>
      <Card>
        <CardBody p="1" overflow="auto">
          <PatientsCount />
        </CardBody>
      </Card>
      <Card>
        <CardBody p="1" overflow="auto">
          <PatientAgeRatio />
        </CardBody>
      </Card>
      <Card>
        <CardBody p="1" overflow="auto">
          <MotifPaymentRatio />
        </CardBody>
      </Card>
    </HStack>

    <Card>
      <CardBody display="flex" justifyContent="center">
        <RevenuChart />
      </CardBody>
    </Card>

    <Card>
      <CardBody>
        <WorkLoadChart />
      </CardBody>
    </Card>
  </Stack>
)

export default Statistics
