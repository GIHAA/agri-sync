import ReactPaginate from 'react-paginate'

interface PaginationProps {
  currentPage: number
  totalPages: number
  handlePageClick: (event: { selected: number }) => void
}

function Pagination({
  currentPage,
  totalPages,
  handlePageClick,
}: PaginationProps) {
  return (
    <ReactPaginate
      previousLabel="<"
      nextLabel=">"
      breakLabel="..."
      pageCount={totalPages}
      forcePage={currentPage - 1} // Convert 1-based page to 0-based index for ReactPaginate
      marginPagesDisplayed={2}
      pageRangeDisplayed={6}
      onPageChange={handlePageClick}
      containerClassName="pagination flex gap-3 "
      activeClassName="active text-black bg-white "
      pageClassName="page-item flex items-center justify-center  w-8 h-8 "
      pageLinkClassName="page-link w-full h-full flex items-center justify-center"
      previousClassName="page-item lg:w-8 h-8 flex items-center justify-center "
      previousLinkClassName="page-link w-full h-full flex items-center justify-center"
      nextClassName="page-item lg:w-8 h-8 flex items-center justify-center "
      nextLinkClassName="page-link w-full h-full flex items-center justify-center"
      breakClassName="page-item w-8 h-8 flex items-center justify-center "
      breakLinkClassName="page-link w-full h-full flex items-center justify-center"
    />
  )
}

export default Pagination
