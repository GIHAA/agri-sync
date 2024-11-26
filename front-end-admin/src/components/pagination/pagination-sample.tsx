import { SetStateAction } from 'react'
import ReactPaginate from 'react-paginate'

interface PaginationProps {
  data: any[]
  itemsPerPage: number
  handlePageClick: (event: { selected: number }) => void
}

function Pagination({ data, itemsPerPage, handlePageClick }: PaginationProps) {
  return (
    <ReactPaginate
      previousLabel="<"
      nextLabel="next"
      breakLabel="..."
      pageCount={Math.ceil(data.length / itemsPerPage)}
      marginPagesDisplayed={2}
      pageRangeDisplayed={5}
      onPageChange={handlePageClick} // This should match the expected type
      containerClassName="pagination"
      activeClassName="active"
      pageClassName="page-item"
      pageLinkClassName="page-link"
      previousClassName="page-item"
      previousLinkClassName="page-link"
      nextClassName="page-item"
      nextLinkClassName="page-link"
      breakClassName="page-item"
      breakLinkClassName="page-link"
    />
  )
}

export default Pagination
