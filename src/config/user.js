export const CREATE_USER_NAMES = {
  NAME: 'name',
  EMAIL: 'email',
  PASSWORD: 'password',
  CONFIRM_PASSWORD: 'confirmPassword',
  PIC: 'pic',
}

export const USER_ROLES = [
  { id: '#1', name: 'Admin', value: 'admin' },
  { id: '#2', name: 'Médecin', value: 'doctor' },
  { id: '#3', name: 'Assistant', value: 'assistant' },
  { id: '#4', name: 'Non Autorisé', value: 'unauthorized' },
]

export const USER_ROLES_MAP = {
  admin: 'Admin',
  doctor: 'Médecin',
  assistant: 'Assistant',
  unauthorized: 'Non Autorisé',
}
