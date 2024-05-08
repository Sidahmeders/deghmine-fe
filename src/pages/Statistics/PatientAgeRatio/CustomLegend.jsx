import { FormControl, FormLabel, Switch, Text, Stack, HStack, Badge } from '@chakra-ui/react'

const CustomLegend = ({ useMockData, setUseMockData, ...props }) => {
  const { payload } = props

  return (
    <Stack align="center" mt="2">
      <Text color="purple.600">Distribution des âges des patients</Text>

      <FormControl w="fit-content" display="flex">
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

      <HStack pt="2">
        {payload.map((item) => (
          <Badge key={item.value} bg={item.color} color="white" borderRadius="lg">
            {item.value}
          </Badge>
        ))}
      </HStack>
    </Stack>
  )
}

export default CustomLegend
