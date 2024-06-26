import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  HStack,
  useToast,
  Button,
} from '@chakra-ui/react'
import { Users } from 'react-feather'

import { AppointmentsState } from '@context'
import { setPatient } from '@utils'
import { PAGINATION_ROWS_PER_PAGE_OPTIONS } from '@config'
import { fetchPatients } from '@services/patients'

import DataTable from '../DataTable/DataTable'
import { patientColumns } from './patientColumns'
import SearchBar from '../Searchbar/Searchbar'
import PatientFollowupsModal from '../PatientFollowupsModal/PatientFollowupsModal'
import EditPatientModal from './EditPatientModal'
import DeletePatientModal from './DeletePatientModal'
import ExpandableComponent from './ExpandableComponent'
import AddPatientModal from './AddPatientModal'

import './PatientsListModal.scss'

export default function PatientListModal() {
  const { patientsData, setPatientsData, bookMarkedPatient, setBookMarkedPatient } = AppointmentsState()
  const toast = useToast()
  const navigate = useNavigate()
  const { isOpen: isPatientsModalOpen, onOpen: onPatientsModalOpen, onClose: onPatientsModalClose } = useDisclosure()
  const { isOpen: isEditModalOpen, onOpen: onEditModalOpen, onClose: ondEditModalClose } = useDisclosure()
  const { isOpen: isDeleteModalOpen, onOpen: onDeleteModalOpen, onClose: onDeleteModalClose } = useDisclosure()
  const {
    isOpen: isPatientFollowupsModalOpen,
    onOpen: onPatientFollowupsModalOpen,
    onClose: onPatientFollowupsModalClose,
  } = useDisclosure()

  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(PAGINATION_ROWS_PER_PAGE_OPTIONS[0])
  const [filterText, setFilterText] = useState('')
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      setIsLoading(true)
      try {
        let patientData
        if (filterText.trim().length > 0) {
          patientData = await fetchPatients({ searchName: filterText })
        } else {
          patientData = await fetchPatients({ pageNumber: pageNumber + 1, pageSize })
        }
        setPatientsData(patientData)
      } catch (error) {
        toast({ description: error.message })
      }
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageNumber, pageSize, filterText])

  const subHeaderComponent = useMemo(() => {
    const handleFilter = (e) => setFilterText(e.target.value)

    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle)
        setFilterText('')
      }
    }

    return (
      <HStack width="100%">
        <SearchBar onFilter={handleFilter} onClear={handleClear} filterText={filterText} />
        <AddPatientModal
          children={
            <Button p="6" bg="#474aff" color="#fff" _hover={{ backgroundColor: '#6568f8' }}>
              Créer patient
            </Button>
          }
        />
      </HStack>
    )
  }, [filterText, resetPaginationToggle])

  return (
    <>
      <Users onClick={onPatientsModalOpen} color="orange" />

      <Modal size="5xl" closeOnOverlayClick={false} isOpen={isPatientsModalOpen} onClose={onPatientsModalClose}>
        <ModalOverlay bg="blackAlpha.400" />
        <ModalContent>
          <ModalHeader>Liste des patients</ModalHeader>
          <ModalCloseButton p="6" />
          <ModalBody>
            <DataTable
              loading={isLoading}
              columns={patientColumns({
                onEditModalOpen,
                onDeleteModalOpen,
                bookMarkedPatient,
                setBookMarkedPatient,
                navigate,
                onPatientsModalClose,
              })}
              data={patientsData.patients}
              subHeaderComponent={subHeaderComponent}
              expandableRowsComponent={ExpandableComponent}
              paginationTotalRows={patientsData.totalCount}
              paginationRowsPerPageOptions={PAGINATION_ROWS_PER_PAGE_OPTIONS}
              onChangePage={(page) => setPageNumber(page)}
              pageNumber={pageNumber}
              onChangeRowsPerPage={(currentRowsPerPage) => setPageSize(currentRowsPerPage)}
              paginationPerPage={pageSize}
              onRowDoubleClicked={(row) => {
                onPatientFollowupsModalOpen()
                setPatient(row)
              }}
            />
            <PatientFollowupsModal isOpen={isPatientFollowupsModalOpen} onClose={onPatientFollowupsModalClose} />
            <EditPatientModal
              isOpen={isEditModalOpen}
              onClose={ondEditModalClose}
              patientsData={patientsData}
              setPatientsData={setPatientsData}
            />
            <DeletePatientModal
              isOpen={isDeleteModalOpen}
              onClose={onDeleteModalClose}
              setPatientsData={setPatientsData}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
