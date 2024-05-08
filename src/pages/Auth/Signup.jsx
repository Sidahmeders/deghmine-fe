import { useState } from 'react'
import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Stack,
  useToast,
} from '@chakra-ui/react'

import { signUpUser } from '@services/users'
import { uploadImage } from '@services/cloud'
import { CREATE_USER_NAMES } from '@config'
import { Eye, EyeOff, Image } from 'react-feather'

const initialValues = Object.values(CREATE_USER_NAMES).reduce((acc, val) => ({ ...acc, [val]: '' }), {})

const Signup = () => {
  const toast = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const [credentials, setCredentials] = useState(initialValues)

  const handleChange = (e) => {
    const { name, value } = e.target
    setCredentials({ ...credentials, [name]: value })
  }

  const handleUploadPicture = async (e) => {
    const { name, files } = e.target
    if (files[0] === undefined) {
      return toast({ title: 'Veuillez sélectionner une image', status: 'warning' })
    }
    setIsLoading(true)
    try {
      const uploadedImage = await uploadImage(files)
      setCredentials({ ...credentials, [name]: uploadedImage.secure_url.toString() })
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  const submitHandler = async () => {
    if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword) {
      return toast({ title: 'Veuillez remplir tous les champs obligatoires', status: 'warning' })
    }
    if (credentials.password !== credentials.confirmPassword) {
      return toast({ title: 'Les mots de passe ne correspondent pas', status: 'warning' })
    }
    setIsLoading(true)
    try {
      await signUpUser(credentials)
      setCredentials(initialValues)
      toast({
        title: "l'utilisateur s'est inscrit avec succès",
        description: "veuillez contacter l'administrateur pour vous donner accès au système",
        duration: 15000,
        status: 'success',
      })
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  return (
    <Stack spacing="4">
      <Input
        type="text"
        name={CREATE_USER_NAMES.NAME}
        value={credentials.name}
        placeholder="Nom"
        onChange={handleChange}
      />

      <Input
        type="email"
        name={CREATE_USER_NAMES.EMAIL}
        value={credentials.email}
        placeholder="Email"
        onChange={handleChange}
      />

      <HStack>
        <InputGroup>
          <InputRightElement>
            <Button variant="ghost" colorScheme="blue" size="xs" mr="1" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff color="#369" /> : <Eye color="#369" />}
            </Button>
          </InputRightElement>
          <Input
            type={showPassword ? 'text' : 'password'}
            name={CREATE_USER_NAMES.PASSWORD}
            value={credentials.password}
            placeholder="Mot de pass"
            onChange={handleChange}
          />
        </InputGroup>

        <Input
          type={showPassword ? 'text' : 'password'}
          name={CREATE_USER_NAMES.CONFIRM_PASSWORD}
          value={credentials.confirmPassword}
          placeholder="Confirmer Mot de pass"
          onChange={handleChange}
        />
      </HStack>

      <Stack spacing="5">
        <FormControl id="pic">
          <FormLabel htmlFor="pic">Téléchargez votre image</FormLabel>

          <InputGroup>
            <InputLeftElement>
              <Image color="#e00d" />
            </InputLeftElement>

            <Input
              type="file"
              name="pic"
              accept="image/*"
              isInvalid={true}
              cursor="pointer"
              errorBorderColor="#e00d"
              sx={{
                '::file-selector-button': {
                  height: 10,
                  padding: 0,
                  mr: 4,
                  background: 'none',
                  border: 'none',
                  fontWeight: 'bold',
                },
              }}
              onChange={(e) => handleUploadPicture(e)}
            />
          </InputGroup>
        </FormControl>
      </Stack>

      <Button colorScheme="blue" width="100%" onClick={submitHandler} isLoading={isLoading}>
        Enregistrer
      </Button>
    </Stack>
  )
}

export default Signup
