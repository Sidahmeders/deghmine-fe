import { debounce } from 'lodash'

export * from './localStorage'
export * from './chat'
export * from './appointment'
export * from './date'

export const guid = () => {
  const s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1)
  }
  // return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4()
}

export const notify = debounce(async ({ title, description }) => {
  const options = {
    tag: title,
    icon: 'https://i.ibb.co/vB1mDPv/logo192.png',
    vibrate: 3,
  }

  // mobile notification
  navigator.serviceWorker.ready.then((registration) => {
    registration.showNotification(description, options)
  })

  // web notification
  if (Notification.permission === 'default' || Notification.permission === 'denied') {
    await Notification.requestPermission()
  }
  if (Notification.permission === 'granted') {
    const notification = new Notification(title, {
      body: description,
      ...options,
    })
    setTimeout(notification.close.bind(notification), 4500)
  }
})

export const checkIsJWTExpired = (token = '') => {
  const payload = token.split('.')[1]
  const decode = JSON.parse(window.atob(payload))
  if (decode.exp * 1000 < new Date().getTime()) {
    return true
  }
  return false
}

export const formatMoney = (number) => {
  const numString = String(number)
  const isNegative = numString.charAt(0) === '-'
  const numLength = numString.length
  let formattedNumber = ''

  for (let i = 0; i < numLength; i++) {
    if (isNegative && i === 1) {
      formattedNumber += '-'
    } else if (i > 0 && (numLength - i) % 3 === 0) {
      formattedNumber += ','
    }
    formattedNumber += numString.charAt(i)
  }

  return formattedNumber
}

export const formatPhoneNumber = (number = '##########') => {
  var separatedNumber = String(number)
    .match(/.{1,2}/g)
    .join('.')
  return separatedNumber
}

export const abbreviateNumber = (number) => {
  // Suffixes for thousand, million, billion, trillion, etc.
  const suffixes = ['', 'K', 'M', 'B', 'T']
  // Convert the input number to a floating-point number
  let abbreviatedValue = parseFloat(number)

  // Determine the appropriate suffix based on the magnitude of the number
  let suffixIndex = 0
  while (abbreviatedValue >= 1000 && suffixIndex < suffixes.length - 1) {
    abbreviatedValue /= 1000
    suffixIndex++
  }

  // Format the number with a maximum of 2 decimal places
  const formattedNumber = Number(abbreviatedValue.toFixed(2))

  // Combine the formatted number with the appropriate suffix
  return `${formattedNumber}${suffixes[suffixIndex]}`
}
