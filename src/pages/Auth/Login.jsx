import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, Stack, useToast } from '@chakra-ui/react'

import { setConfirmationToken } from '@utils'
import { APP_ROUTES } from '@config'
import { signInUser } from '@services/users'

const Login = () => {
  const toast = useToast()
  const navigate = useNavigate()

  const [show, setShow] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [credentials, setCredentials] = useState({ email: '', password: '' })

  const submitLoginHandler = async () => {
    if (!credentials.email || !credentials.password) {
      return toast({
        title: 'Veuillez remplir tous les champs obligatoires',
        status: 'warning',
      })
    }
    setIsLoading(true)
    try {
      const { token } = await signInUser(credentials)
      setConfirmationToken(token)
      navigate(APP_ROUTES.CONFIRM_LOGIN)
    } catch (error) {
      toast({ title: error.message })
    }
    setIsLoading(false)
  }

  const onChangeHandler = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }

  return (
    <Stack spacing="6">
      <Stack spacing="5">
        <FormControl isRequired>
          <FormLabel htmlFor="email">Email</FormLabel>
          <Input
            type="email"
            name="email"
            value={credentials.email}
            placeholder="enter votre email"
            onChange={(e) => onChangeHandler(e)}
          />
        </FormControl>
      </Stack>

      <Stack spacing="5">
        <FormControl isRequired>
          <FormLabel htmlFor="password">Mot de Passe</FormLabel>
          <InputGroup position="relative" mb="8">
            <InputRightElement w="4.5rem">
              <Button h="1.75rem" size="sm" onClick={() => setShow(!show)}>
                {show ? 'cacher' : 'voir'}
              </Button>
            </InputRightElement>
            <Input
              type={show ? 'text' : 'password'}
              name="password"
              value={credentials.password}
              placeholder="mot de passe"
              onChange={(e) => onChangeHandler(e)}
            />
          </InputGroup>

          <Button variant="link" position="absolute" bottom="0" right="1" fontSize="14" color="red">
            <Link to={APP_ROUTES.FORGET_PASSWORD}>mot de passe oublié?</Link>
          </Button>
        </FormControl>
      </Stack>

      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitLoginHandler}
        isLoading={isLoading}>
        Connecter
      </Button>

      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => setCredentials({ email: 'guest@example.com', password: '12345678' })}>
        <i className="fas fa-user-alt" style={{ fontSize: '15px', marginRight: 8 }} />
        Obtenir informations d'identification
      </Button>
    </Stack>
  )
}

export default Login
