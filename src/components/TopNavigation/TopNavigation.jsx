import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Cast, Calendar, PieChart, UserPlus } from 'react-feather'
import { Button } from '@chakra-ui/react'
import { getPageRoute, setPageRoute } from '@utils'
import { APP_ROUTES } from '@config'
import PatientListModal from '../PatientsListModal/PatientsListModal'
import AddPatientModal from '../PatientsListModal/AddPatientModal'
import './TopNavigation.scss'

export default function TopNavigation() {
  const location = useLocation()
  const [selectedRoute, setSelectedRoute] = useState(getPageRoute())
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const handleTouchStart = () => setIsDragging(true)

  useEffect(() => {
    if (position.x < -250) {
      setPosition({ ...position, x: 5 })
    }
    if (position.x > window.outerWidth - 50) {
      setPosition({ ...position, x: position.x - 100 })
    }
    if (position.y > 50) {
      setPosition({ ...position, y: -5 })
    }
    if (Math.abs(position.y) > window.outerHeight - 50) {
      setPosition({ ...position, y: position.y + 25 })
    }
  }, [position])

  useEffect(() => {
    setSelectedRoute(getPageRoute())
  }, [location.pathname])

  return (
    <div
      className={`top-navigation-container ${isDragging ? 'dragging' : ''}`}
      style={{ transform: `translate(${position.x}px, ${position.y}px)` }}
      onTouchStart={handleTouchStart}>
      <Link
        className={`${selectedRoute === APP_ROUTES.TODAY_PATIENTS_LIST ? 'selected' : ''}`}
        onClick={() => setPageRoute(APP_ROUTES.TODAY_PATIENTS_LIST)}
        to={APP_ROUTES.TODAY_PATIENTS_LIST}>
        <Cast />
      </Link>
      <Link
        className={`${selectedRoute === APP_ROUTES.CALENDAR ? 'selected' : ''}`}
        onClick={() => setPageRoute(APP_ROUTES.CALENDAR)}
        to={APP_ROUTES.CALENDAR}>
        <Calendar />
      </Link>
      <Link
        className={`${selectedRoute === APP_ROUTES.STATISTICS ? 'selected' : ''}`}
        onClick={() => setPageRoute(APP_ROUTES.STATISTICS)}
        to={APP_ROUTES.STATISTICS}>
        <PieChart />
      </Link>
      <Link>
        <PatientListModal />
      </Link>
      <Link>
        <AddPatientModal
          children={
            <Button p={0} m={0} size={0} bg="#fff0" color="#fff0" _hover={{ backgroundColor: '#fff0' }}>
              <UserPlus color="green" />
            </Button>
          }
        />
      </Link>
    </div>
  )
}
