import { Trash2, Edit3 } from 'react-feather'

import { setPatient, formatDate, formatPhoneNumber } from '@utils'

export const patientColumns = ({ onEditModalOpen, onDeleteModalOpen }) => [
  {
    name: 'Nom',
    selector: ({ fullName }) => fullName,
    sortable: true,
    minWidth: '260px',
  },
  {
    name: 'date de naissance',
    selector: ({ birthDate }) => formatDate(birthDate),
    sortable: true,
    width: '150px',
  },
  {
    name: 'Téléphone',
    selector: ({ phoneNumber }) => formatPhoneNumber(phoneNumber),
    minWidth: '220px',
  },
  {
    name: 'Date de création',
    selector: ({ createdAt }) => formatDate(createdAt),
    sortable: true,
    minWidth: '150px',
  },
  {
    name: 'Actions',
    selector: (row) => {
      const onEditClick = () => {
        setPatient(row)
        onEditModalOpen()
      }

      const onDeleteClick = () => {
        setPatient(row)
        onDeleteModalOpen()
      }

      return (
        <div className="actions-cell">
          <Edit3 onClick={onEditClick} width={20} color="#474aff" />
          <Trash2 onClick={onDeleteClick} width={20} color="#d00" />
        </div>
      )
    },
    width: '120px',
  },
]
