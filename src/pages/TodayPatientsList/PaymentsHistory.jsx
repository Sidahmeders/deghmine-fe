import {
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerFooter,
  Button,
  useDisclosure,
  HStack,
  Box,
  Text,
  Input,
} from '@chakra-ui/react'

import { AppointmentsState } from '@context'
import { formatDate, formatMoney } from '@utils'
import TooltipMobile from '@components/TooltipMobile'

const PaymentsHistory = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { todayPaymentHistory, selectedDate, setSelectedDate } = AppointmentsState()

  const totalpaymentAmount = todayPaymentHistory.reduce((acc, { amount }) => acc + amount, 0)

  return (
    <>
      <Button colorScheme="purple" position="absolute" bottom="1" right="1" onClick={onOpen}>
        Paiements du {formatDate(selectedDate, 'EEEE dd MMM yyyy')}
      </Button>
      <Drawer placement="right" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader px="4" fontSize="18" fontWeight="bold" color="purple.500">
            <Text>Paiements du {formatDate(selectedDate, 'EEEE MM/dd')}</Text>
            <Input
              mt="2"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(formatDate(e.target.value))}
            />
          </DrawerHeader>
          <DrawerCloseButton fontSize="14" marginTop="5px" color="purple" />
          <DrawerBody>
            {todayPaymentHistory.map(({ _id, createdAt, payerName, amount }, index) => (
              <HStack key={_id} justifyContent="space-between" ml="3">
                <TooltipMobile label={formatDate(createdAt, 'HH:mm BBBB')} placement="left-end" hasArrow>
                  <Box position="relative">
                    <Text position="absolute" top="2px" left="-1.5rem" fontSize="14px" color="purple">
                      {index + 1}.
                    </Text>
                    {payerName?.slice(0, 18)}
                  </Box>
                </TooltipMobile>
                <Text fontWeight="bold">{formatMoney(amount)}</Text>
              </HStack>
            ))}
          </DrawerBody>
          <DrawerFooter>
            <Text fontSize="1.25rem">
              Total: <strong>{formatMoney(totalpaymentAmount)}</strong>
            </Text>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  )
}

export default PaymentsHistory
