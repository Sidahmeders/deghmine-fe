import _fetch from './_fetch'

const fetchPatients = async ({ pageNumber, pageSize, searchName }) => {
  const searchQuery = [
    pageNumber && `page=${pageNumber}`,
    pageSize && `pageSize=${pageSize}`,
    searchName && `fullName=${searchName}`,
  ]
    .filter((query) => query)
    .join('&')

  return await _fetch.GET(`/api/patients?${searchQuery}`)
}

const fetchPatientById = async (patientId) => await _fetch.GET(`/api/patients/${patientId}`)

const createPatient = async (patientData) => await _fetch.POST('/api/patients', patientData)

const updatePatientById = async (patientId, patientData) => await _fetch.PUT(`/api/patients/${patientId}`, patientData)

const deletePatientById = async (patientId) => await _fetch.DELETE(`/api/patients/${patientId}`)

export { fetchPatients, fetchPatientById, createPatient, updatePatientById, deletePatientById }
