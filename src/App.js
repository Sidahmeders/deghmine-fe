import { useEffect, useRef } from 'react'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useToast } from '@chakra-ui/react'
import { isEmpty } from 'lodash'
import { Wifi, WifiOff } from 'react-feather'

import { ChatState } from '@context'
import { APP_ROUTES, CHAT_EVENT_LISTENERS } from '@config'
import { checkIsJWTExpired, removeLocalUser, getPageRoute, getLocalUser } from '@utils'

import TopNavigation from '@components/TopNavigation/TopNavigation'
import { Auth, Chat, TodayPatientsList, Statistics, Calendar, ForgetPassword, ConfirmLogin } from './pages'

import './App.css'

const App = () => {
  const localUser = getLocalUser()
  const toast = useToast()
  const navigate = useNavigate()
  const { socket, setSocketConnected } = ChatState()

  if (!isEmpty(localUser) && localUser.token) {
    if (checkIsJWTExpired(localUser.token)) {
      removeLocalUser()
      navigate('/')
    }
  }

  const toastIdRef = useRef()

  const updateToast = () => {
    if (toastIdRef.current) {
      toast.update(toastIdRef.current, {
        title: 'tu es de retour en ligne',
        status: 'success',
        icon: <Wifi />,
        position: 'bottom',
        isClosable: false,
        variant: 'solid',
      })
    }
  }

  const addToast = () => {
    toastIdRef.current = toast({
      title: 'tu es hors ligne!',
      description: "S'il vous plait, vérifiez votre connexion internet",
      status: 'error',
      duration: 1000 * 60 * 60,
      icon: <WifiOff />,
      position: 'bottom',
      isClosable: false,
      variant: 'solid',
    })
  }

  useEffect(() => {
    const handleOnlineStatus = () => updateToast()
    const handleOfflineStatus = () => addToast()

    window.ononline = handleOnlineStatus
    window.onoffline = handleOfflineStatus
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!localUser) return
    socket.emit(CHAT_EVENT_LISTENERS.SETUP, localUser)
    socket.on(CHAT_EVENT_LISTENERS.CONNECTED, () => setSocketConnected(true))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localUser, socket])

  return (
    <div className="App">
      {!isEmpty(localUser) && <TopNavigation />}
      <Routes>
        {isEmpty(localUser) ? (
          <>
            <Route path="/" element={<Auth />} />
            <Route path={APP_ROUTES.FORGET_PASSWORD} element={<ForgetPassword />} />
            <Route path={APP_ROUTES.CONFIRM_LOGIN} element={<ConfirmLogin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path={APP_ROUTES.CHATS} element={<Chat />} />
            <Route path={APP_ROUTES.TODAY_PATIENTS_LIST} element={<TodayPatientsList />} />
            <Route path={APP_ROUTES.CALENDAR} element={<Calendar />} />
            <Route path={APP_ROUTES.STATISTICS} element={<Statistics />} />
            <Route path="*" element={<Navigate to={getPageRoute()} replace />} />
          </>
        )}
      </Routes>
    </div>
  )
}

export default App
