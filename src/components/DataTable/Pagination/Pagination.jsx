import ReactPaginate from 'react-paginate'
import { ArrowLeft, ArrowRight, MoreHorizontal } from 'react-feather'

import './Pagination.scss'

const Pagination = ({
  pageNumber,
  paginationTotalRows,
  onPageChange,
  paginationPerPage,
  paginationRowsPerPageOptions,
  onChangeRowsPerPage,
}) => {
  const pageCount = Math.floor(paginationTotalRows / paginationPerPage) + 1

  const updateRowPerPage = (e) => {
    onChangeRowsPerPage(Number(e.target.value))
    onPageChange(0)
  }

  return (
    <div className="pagination-container">
      <h3 className="pagination-page-count">
        {paginationPerPage * pageNumber} Sur {paginationTotalRows}
      </h3>

      <ReactPaginate
        containerClassName="pagination"
        activeClassName="active"
        nextLinkClassName="next"
        previousLinkClassName="previous"
        pageCount={pageCount}
        onPageChange={(props) => onPageChange(props.selected)}
        forcePage={pageNumber}
        breakLabel={<MoreHorizontal size="1.25rem" color="#474aff" />}
        nextLabel={<ArrowRight size="1.25rem" color="#474aff" />}
        previousLabel={<ArrowLeft size="1.25rem" color="#474aff" />}
      />

      <div className="pagination-row-options">
        lignes
        <select className="pagination-selectbox" defaultValue={paginationPerPage} onChange={updateRowPerPage}>
          {paginationRowsPerPageOptions.map((item, index) => (
            <option key={index} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default Pagination
