import propTypes from 'prop-types'
import { Search, X } from 'react-feather'

import './Searchbar.scss'

export default function Searchbar({ onFilter, onClear, filterText }) {
  return (
    <div className="input-wrap">
      <Search className="search-icon" />
      <input
        onChange={onFilter}
        value={filterText}
        type="text"
        name="patient-search"
        id="patient-search"
        placeholder="rechercher patients..."
      />
      <X color="#ddd" onClick={onClear} className="x-clear" />
    </div>
  )
}

Searchbar.propTypes = {
  filterText: propTypes.string,
  onFilter: propTypes.func,
  onClear: propTypes.func,
}

Searchbar.defaultProps = {
  filterText: '',
  onFilter: () => {},
  onClear: () => {},
}
