export * from './chat'
export * from './calendar'
export * from './user'
export * from './patient'
export * from './appointment'
export * from './payment'

export const ENDPOINT = 'https://dnmchat-backend.onrender.com'

export const APP_ROUTES = {
  CHATS: '/chats',
  CALENDAR: '/calendar',
  TODAY_PATIENTS_LIST: '/today-appointments',
  STATISTICS: '/statistics',
  FORGET_PASSWORD: '/forget-password',
  CONFIRM_LOGIN: '/confirm-login',
}

export const PAGINATION_ROWS_PER_PAGE_OPTIONS = [20, 40, 60, 100, 200]
