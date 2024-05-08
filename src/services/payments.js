import { formatDate } from '@utils'
import _fetch from './_fetch'

const fetchDayPayments = async (date) => await _fetch.GET(`/api/payments/${formatDate(date, 'yyyy/MM/dd')}`)

const createPayment = async (date, paymentData) => {
  return await _fetch.POST(`/api/payments/${formatDate(date, 'yyyy/MM/dd')}`, paymentData)
}

export { fetchDayPayments, createPayment }
