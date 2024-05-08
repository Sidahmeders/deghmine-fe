import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import io from 'socket.io-client'
import * as serviceWorker from './serviceWorkerRegistration'

import { ChatProvider, AppointmentsProvider } from '@context'
import { ENDPOINT } from '@config'

import App from './App'

const root = ReactDOM.createRoot(document.getElementById('root'))
const socket = io(ENDPOINT)

root.render(
  <BrowserRouter>
    <ChakraProvider
      toastOptions={{
        defaultOptions: {
          title: "quelque chose s'est mal passé. veuillez réessayer plus tard",
          status: 'error',
          duration: 7500,
          isClosable: true,
          position: 'top-right',
          variant: 'left-accent',
        },
      }}>
      <ChatProvider socket={socket}>
        <AppointmentsProvider>
          <App />
        </AppointmentsProvider>
      </ChatProvider>
    </ChakraProvider>
  </BrowserRouter>,
)

serviceWorker.register()
