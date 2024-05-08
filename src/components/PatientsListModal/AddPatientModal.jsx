import { useForm, Controller } from 'react-hook-form'
import { Textarea, useDisclosure } from '@chakra-ui/react'
import { AlertCircle, CheckCircle, Clipboard } from 'react-feather'
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
  Stack,
  useToast,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react'
import { isValid } from 'date-fns'

import { getLocalUser } from '@utils'
import { CREATE_PATIENT_NAMES } from '@config'
import { createPatient } from '@services/patients'
import { useState } from 'react'

const initialValues = Object.values(CREATE_PATIENT_NAMES).reduce((prev, curr) => ({ ...prev, [curr]: '' }), {})

export default function AddPatientModal({ setPatientsData }) {
  const localUser = getLocalUser()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitted, isSubmitting },
  } = useForm({ defaultValues: initialValues })

  const [birthDateInputType, setBirthDateInputType] = useState('text')

  const onSubmit = async (data) => {
    try {
      const createdPatient = await createPatient({ ...data, [CREATE_PATIENT_NAMES.SENDER]: localUser._id })
      setPatientsData((patientsData) => ({
        ...patientsData,
        patients: [createdPatient, ...patientsData.patients],
        totalCount: patientsData.totalCount + 1,
      }))
      toast({ title: 'nouveau patient créé avec succès', status: 'success' })
      reset(initialValues)
      onClose()
    } catch (error) {
      toast({ description: error.message })
    }
  }

  return (
    <>
      <Button p="6" bg="#474aff" color="#fff" _hover={{ backgroundColor: '#6568f8' }} onClick={onOpen}>
        Créer patient
      </Button>

      <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="blackAlpha.400" backdropFilter="blur(10px)" />
        <ModalContent>
          <ModalHeader>Ajouter un nouveau patient</ModalHeader>
          <ModalCloseButton p="6" />
          <form className="create-profile-form" onSubmit={handleSubmit(onSubmit)}>
            <ModalBody>
              <Stack spacing={3}>
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
                      <Input
                        type={birthDateInputType}
                        onFocus={() => setBirthDateInputType('date')}
                        onBlur={() => setBirthDateInputType('text')}
                        placeholder="date de naissance"
                        value={value}
                        onChange={onChange}
                      />
                    </InputGroup>
                  )}
                />

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
            </ModalBody>
            <ModalFooter>
              <Button type="submit" colorScheme="blue" mr={3} isDisabled={isSubmitting}>
                Créer patient
              </Button>
              <Button variant="ghost" onClick={onClose} isDisabled={isSubmitting}>
                Annuler
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  )
}
