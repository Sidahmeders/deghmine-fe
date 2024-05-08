import { formatDate } from '@utils'
import _fetch from './_fetch'

const fetchCalendarAvailabilities = async (date) => {
  return await _fetch.GET(`/api/calendar/${formatDate(date, 'yyyy/MM')}/availability`)
}

const setCalendarAvailability = async (date, availability) => {
  return await _fetch.PUT(`/api/calendar/${formatDate(date, 'yyyy/MM/dd')}/availability`, { availability })
}

export { fetchCalendarAvailabilities, setCalendarAvailability }
