import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Container, InputGroup, InputLeftElement, Input, Button, Stack, Text, useToast, HStack } from '@chakra-ui/react'
import { ChevronLeft, Mail } from 'react-feather'
import { useForm, Controller } from 'react-hook-form'

import { requestPasswordReset } from '@services/users'

import Timer from '@components/Timer'

const ForgetPassword = () => {
  const toast = useToast()
  const {
    handleSubmit,
    control,
    getValues,
    formState: { isSubmitting },
  } = useForm()

  const [isSuccessfulSubmit, setIsSuccessfulSubmit] = useState(false)
  const [seconds, setSeconds] = useState(60)

  const submitRestPassword = async (data) => {
    try {
      await requestPasswordReset(data.email)
      setIsSuccessfulSubmit(true)
    } catch (error) {
      toast({ title: error.message })
    }
  }

  const onErrors = (errors) => toast({ title: errors.email.message, status: 'warning' })

  const resendInstructions = async () => {
    try {
      await requestPasswordReset(getValues().email)
    } catch (error) {
      toast({ description: error.message })
    }
    setSeconds(60)
  }

  return (
    <Container maxWidth="xl" minH="95vh" display="flex" flexDir="column" justifyContent="center">
      {isSuccessfulSubmit ? (
        <Stack gap="4">
          <Text fontSize="lg">
            veuillez vérifier votre boîte de réception et vous devriez recevoir un lien de réinitialisation de mot de
            passe à: <strong>{getValues().email}</strong>
          </Text>

          <HStack>
            <Text>une fois votre mot de passe réinitialisé, vous pouvez revenir à la: </Text>
            <Button variant="link">
              <Link to="/">connexion</Link>
            </Button>
          </HStack>

          <Text color="orange.500">
            si vous n'avez pas reçu les instructions, assurez-vous d'avoir entré le bon e-mail ou cliquez sur Renvoyer
            les instructions après <strong>1:00 min</strong>
          </Text>
          <Stack>
            <Button variant="solid" colorScheme="orange" onClick={resendInstructions} isDisabled={seconds > 0}>
              Renvoyer l'instruction {seconds > 0 ? <Timer seconds={seconds} setSeconds={setSeconds} /> : null}
            </Button>
            <Button>
              <ChevronLeft />
              <Link to="/"> Revenir à la connexion</Link>
            </Button>
          </Stack>
        </Stack>
      ) : (
        <form onSubmit={handleSubmit(submitRestPassword, onErrors)}>
          <Stack>
            <Controller
              control={control}
              name="email"
              defaultValue=""
              rules={{
                required: 'remplissez votre email svp',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'votre adresse email est invalide',
                },
              }}
              render={({ field: { onChange, value } }) => (
                <InputGroup>
                  <InputLeftElement pointerEvents="none" children={<Mail size="1.25rem" color="gray" />} />
                  <Input
                    type="email"
                    min={1}
                    max={120}
                    placeholder="veuillez entrer votre email.."
                    value={value}
                    onChange={onChange}
                  />
                </InputGroup>
              )}
            />

            <Button type="submit" colorScheme="purple" isDisabled={isSubmitting}>
              Envoyer des instructions
            </Button>
            <Button>
              <ChevronLeft />
              <Link to="/"> Revenir à la connexion</Link>
            </Button>
          </Stack>
        </form>
      )}
    </Container>
  )
}

export default ForgetPassword
