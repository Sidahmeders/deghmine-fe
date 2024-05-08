import propTypes from 'prop-types'
import LoadingOverlay from 'react-loading-overlay-ts'
import { ScaleLoader } from 'react-spinners'

import './Loader.scss'

export default function Loader({ loading, children }) {
  return (
    <LoadingOverlay active={loading} spinner={<ScaleLoader color="#474aff" />}>
      {children}
    </LoadingOverlay>
  )
}

Loader.propTypes = {
  loading: propTypes.bool,
  children: propTypes.node.isRequired,
}

Loader.defaultProps = {
  loading: false,
}
