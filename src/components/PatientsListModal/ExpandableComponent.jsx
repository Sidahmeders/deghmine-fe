import { Box, Textarea } from '@chakra-ui/react'

export default function ExpandableComponent({ data }) {
  const { generalState } = data
  return (
    <Box mb="2">
      <Textarea borderRadius="0" value={generalState} readOnly />
    </Box>
  )
}
