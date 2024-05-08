export const CREATE_APPOINTMENT_NAMES = {
  SENDER: 'sender',
  PATIENT: 'patient',
  BASE_APPOINTMENT_ID: 'baseAppointmentId',
  FULL_NAME: 'fullName',
  START_DATE: 'startDate',
  END_DATE: 'endDate',
  TITLE: 'title',
  MOTIF: 'motif',
  DIAGNOSTIC: 'diagnostic',
  TREATMENT_PLAN: 'treatmentPlan',
  TOTAL_PRICE: 'totalPrice',
  PAYMENT: 'payment',
  isNewTreatment: 'isNewTreatment',
  IS_CONFIRMED: 'isConfirmed',
  IS_LEFT: 'isLeft',
  IS_WAITING_ROOM: 'isWaitingRoom',
  IS_DONE: 'isDone',
  ORDER: 'order',
}

export const MOTIF_ENUM = {
  CONSULTATION: 'consultation',
  EXTRACTION: 'extraction',
  CONTROL: 'control',
  SURGERY: 'surgery',
  CARE: 'care',
  FIXED_PROSTHESIS: 'fixed_prosthesis',
  REMOVABLE_PROSTHESIS: 'removable_prosthesis',
  IMPLANT: 'implant',
  ODF: 'odf',
  SCALING: 'scaling',
  OTHERS: 'others',
}

export const MOTIF_MAP = {
  [MOTIF_ENUM.CONSULTATION]: 'Consultation',
  [MOTIF_ENUM.EXTRACTION]: 'Extraction',
  [MOTIF_ENUM.CONTROL]: 'Contrôle',
  [MOTIF_ENUM.SURGERY]: 'Chirurgie',
  [MOTIF_ENUM.CARE]: 'Soin',
  [MOTIF_ENUM.FIXED_PROSTHESIS]: 'Prothèse fixe',
  [MOTIF_ENUM.REMOVABLE_PROSTHESIS]: 'Prothèse amovible',
  [MOTIF_ENUM.IMPLANT]: 'Implant',
  [MOTIF_ENUM.ODF]: 'ODF',
  [MOTIF_ENUM.SCALING]: 'détartrage',
  [MOTIF_ENUM.OTHERS]: 'autres',
}

export const MOTIF_TEMPLATE_VALUES = [
  { id: '#1', name: 'Consultation', value: MOTIF_ENUM.CONSULTATION, isRequired: true },
  { id: '#2', name: 'Extraction', value: MOTIF_ENUM.EXTRACTION, isRequired: true },
  { id: '#3', name: 'Contrôle', value: MOTIF_ENUM.CONTROL, isRequired: true },
  { id: '#4', name: 'Chirurgie', value: MOTIF_ENUM.SURGERY, isRequired: true },
  { id: '#5', name: 'Soin', value: MOTIF_ENUM.CARE, isRequired: true },
  { id: '#6', name: 'Prothèse fixe', value: MOTIF_ENUM.FIXED_PROSTHESIS, isRequired: true },
  { id: '#7', name: 'Prothèse amovible', value: MOTIF_ENUM.REMOVABLE_PROSTHESIS, isRequired: true },
  { id: '#8', name: 'Implant', value: MOTIF_ENUM.IMPLANT, isRequired: true },
  { id: '#9', name: 'Détartrage', value: MOTIF_ENUM.SCALING, isRequired: true },
  { id: '#10', name: 'ODF', value: MOTIF_ENUM.ODF, isRequired: true },
]

export const APPOINTMENTS_IDS = {
  EXPECTED: 'isExpected',
  DONE: 'isDone',
  WAITING_ROOM: 'isWaitingRoom',
}

export const APPOINTMENT_EVENT_LISTENERS = {
  CONFIRM_APPOINTMENT: 'confirm appointment',
  LEAVE_APPOINTMENT: 'leave appointment',
  DROP_APPOINTMENT: 'drop appointment',
  PAYMENT_APPOINTMENT: 'payment appointment',
  UPDATE_APPOINTMENT: 'update appointment',
  REORDER_APPOINTMENT: 'reorder appointment',
}
