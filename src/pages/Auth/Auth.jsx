import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Container, Box, Text, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { isEmpty } from 'lodash'

import { getLocalUser } from '@utils'

import Signup from './Signup'
import Login from './Login'

export default function Auth() {
  const navigate = useNavigate()

  useEffect(() => {
    if (isEmpty(getLocalUser())) {
      navigate('/')
    }
  }, [navigate])

  return (
    <Container maxWidth="xl" mt="5rem">
      <Box d="flex" justifyContent="center" p={3} bg="white" w="100%" mb="15px" borderRadius="lg" borderWidth="1px">
        <Text fontSize="4xl" textAlign="center">
          Deghmine M.A
        </Text>
      </Box>

      <Box bg="white" w="100%" p="4" borderRadius="lg" borderWidth="1px">
        <Tabs isFitted variant="soft-rounded">
          <TabList mb="1em">
            <Tab>Connexion</Tab>
            <Tab>S'inscrire</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  )
}
