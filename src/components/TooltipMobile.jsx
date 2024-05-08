import { useState, useEffect } from 'react'
import { Tooltip } from '@chakra-ui/react'

const TooltipMobile = (props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    const detectTouchDevice = () => {
      setIsTouchDevice(!!('ontouchstart' in window || navigator.maxTouchPoints))
    }

    detectTouchDevice()

    window.addEventListener('touchstart', detectTouchDevice)

    return () => {
      window.removeEventListener('touchstart', detectTouchDevice)
    }
  }, [])

  const handleMouseOver = () => {
    if (!isTouchDevice) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isTouchDevice) {
      setIsOpen(false)
    }
  }

  const handleClick = () => {
    if (isTouchDevice) {
      setIsOpen((openState) => !openState)
    }
  }

  return (
    <button
      style={{ all: 'unset', cursor: 'pointer' }}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}>
      <Tooltip isOpen={isOpen} {...props}>
        {props.children}
      </Tooltip>
    </button>
  )
}

export default TooltipMobile
