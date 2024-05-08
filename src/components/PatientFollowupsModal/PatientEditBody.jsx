import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AlertCircle, CheckCircle, Clipboard } from 'react-feather'
import {
  HStack,
  Button,
  Textarea,
  Input,
  Stack,
  InputGroup,
  InputLeftElement,
  Grid,
  GridItem,
  useToast,
} from '@chakra-ui/react'
import { isValid } from 'date-fns'

import { formatDate, getPatient, setPatient } from '@utils'
import { CREATE_PATIENT_NAMES } from '@config'
import { updatePatientById } from '@services/patients'
import Loader from '@components/Loader/Loader'

export default function PatientEditBody() {
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitted, isDirty },
  } = useForm({ defaultValues: getPatient() })
  const toast = useToast()

  const [canShowUpdateBtn, setCanShowUpdateBtn] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const updatedPatient = await updatePatientById(data._id, data)
      reset(updatedPatient)
      setPatient(updatedPatient)
      toast({
        title: 'le profil du patient a été mis à jour avec succès',
        status: 'success',
      })
      setCanShowUpdateBtn(false)
    } catch (error) {
      toast({ description: error.message })
    }
    setIsLoading(false)
  }

  const cancelPatientUpdate = () => {
    setCanShowUpdateBtn(false)
    reset(getPatient())
  }

  useEffect(() => {
    if (isDirty) {
      setCanShowUpdateBtn(true)
    }
  }, [isDirty])

  return (
    <Loader loading={isLoading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3} mt="4">
          <Grid templateColumns="repeat(10, 1fr)" gap="2">
            <GridItem colSpan="5">
              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.FULL_NAME}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        value?.length >= 8 && value?.length <= 40 ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Input type="text" placeholder="nom et prénom" value={value} onChange={onChange} />
                  </InputGroup>
                )}
              />
            </GridItem>

            <GridItem colSpan="2">
              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.BIRTH_DATE}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        isValid(new Date(value)) ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Input type="date" placeholder="date de naissance" value={formatDate(value)} onChange={onChange} />
                  </InputGroup>
                )}
              />
            </GridItem>
            <GridItem colSpan="3">
              <Controller
                control={control}
                name={CREATE_PATIENT_NAMES.PHONE_NUMBER}
                shouldUnregister={isSubmitted}
                render={({ field: { onChange, value } }) => (
                  <InputGroup>
                    <InputLeftElement
                      pointerEvents="none"
                      children={
                        value?.length >= 8 && value?.length <= 30 ? (
                          <CheckCircle size="1.25rem" color="green" />
                        ) : (
                          <AlertCircle size="1.25rem" color="red" />
                        )
                      }
                    />
                    <Input type="tel" placeholder="numéro de téléphone" value={value} onChange={onChange} />
                  </InputGroup>
                )}
              />
            </GridItem>
          </Grid>

          <Controller
            control={control}
            name={CREATE_PATIENT_NAMES.GENERAL_STATE}
            shouldUnregister={isSubmitted}
            render={({ field: { onChange, value } }) => (
              <InputGroup>
                <InputLeftElement pointerEvents="none" children={<Clipboard size="1.25rem" color="gray" />} />
                <Textarea pl="10" placeholder="Etate général (note)" value={value} onChange={onChange} />
              </InputGroup>
            )}
          />
        </Stack>
        {canShowUpdateBtn && (
          <HStack mt="3">
            <Button type="submit" colorScheme="orange" mr="2">
              Sauvegarder patient
            </Button>
            <Button variant="ghost" onClick={cancelPatientUpdate}>
              Annuler
            </Button>
          </HStack>
        )}
      </form>
    </Loader>
  )
}
