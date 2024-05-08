import { MOTIF_TEMPLATE_VALUES, MOTIF_ENUM, SUGGESTION_SETTINGS } from '@config'
import { guid } from '@utils'

const CONFIRM_TOKEN = 'confirm-token'
const USER = 'userInfo'
const PATIENT = 'patient'
const PAGE_ROUTE = 'pageRoute'
const MOTIF_TEMPLATE_BUTTONS = 'motifTemplateButtons'
const CHAT_TEMPLATE_BUTTONS = 'chatTemplateButtons'
const CHAT_SUGGESTION_SETTINGS = 'chatSuggestionSettings'
const CALENDAR_VIEW = 'calendarView'

export const getConfirmationToken = () => localStorage.getItem(CONFIRM_TOKEN) || null
export const setConfirmationToken = (token) => localStorage.setItem(CONFIRM_TOKEN, token)

export const getLocalUser = () => JSON.parse(localStorage.getItem(USER)) || {}
export const setLocalUser = (userData) => localStorage.setItem(USER, JSON.stringify(userData))
export const removeLocalUser = () => localStorage.removeItem(USER)

export const getPatient = () => JSON.parse(localStorage.getItem(PATIENT)) || {}
export const setPatient = (patient) => localStorage.setItem(PATIENT, JSON.stringify(patient))

export const getPageRoute = () => localStorage.getItem(PAGE_ROUTE) || '/'
export const setPageRoute = (route) => localStorage.setItem(PAGE_ROUTE, route)

export const getMotifTemplateButtons = () => {
  const motifLocalValues = JSON.parse(localStorage.getItem(MOTIF_TEMPLATE_BUTTONS)) || []
  return [...MOTIF_TEMPLATE_VALUES, ...motifLocalValues]
}
export const setMotifTemplateButtons = (buttonName) => {
  const motifLocalValues = JSON.parse(localStorage.getItem(MOTIF_TEMPLATE_BUTTONS)) || []
  const newButton = {
    id: guid(),
    name: buttonName,
    value: MOTIF_ENUM.OTHERS,
  }
  localStorage.setItem(MOTIF_TEMPLATE_BUTTONS, JSON.stringify([newButton, ...motifLocalValues]))
}
export const dropMotifTemplateButton = (buttonId) => {
  const motifLocalValues = JSON.parse(localStorage.getItem(MOTIF_TEMPLATE_BUTTONS)) || []
  const filteredTemplateButtons = motifLocalValues.filter(({ id }) => buttonId !== id)
  localStorage.setItem(MOTIF_TEMPLATE_BUTTONS, JSON.stringify(filteredTemplateButtons))
}

export const getChatTemplateButtons = () => JSON.parse(localStorage.getItem(CHAT_TEMPLATE_BUTTONS)) || []
export const setChatTemplateButtons = (chatMessage) => {
  const newChatSuggetion = {
    id: guid(),
    message: chatMessage,
  }
  const chatTemplateButtons = getChatTemplateButtons()
  localStorage.setItem(CHAT_TEMPLATE_BUTTONS, JSON.stringify([newChatSuggetion, ...chatTemplateButtons]))
}
export const dropChatTemplateButtons = (chatId) => {
  const chatTemplateButtons = getChatTemplateButtons()
  const filteredChatTemplateButtons = chatTemplateButtons.filter(({ id }) => chatId !== id)
  localStorage.setItem(CHAT_TEMPLATE_BUTTONS, JSON.stringify(filteredChatTemplateButtons))
}

export const getChatSuggestionSettings = () => {
  return JSON.parse(localStorage.getItem(CHAT_SUGGESTION_SETTINGS)) || SUGGESTION_SETTINGS
}
export const setChatSuggestionSettings = (settings) => {
  localStorage.setItem(CHAT_SUGGESTION_SETTINGS, JSON.stringify(settings))
}

export const getCalendarView = () => localStorage.getItem(CALENDAR_VIEW) || 'month'
export const setCalendarView = (view) => localStorage.setItem(CALENDAR_VIEW, view)
