interface PaginationProps {
  page: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}

const Pagination = ({ page, currentPage, setCurrentPage }: PaginationProps) => {
  return (
    <button
      type="button"
      className={`rounded px-3 py-1 text-sm ${
        currentPage === page
          ? "bg-blue-600 text-white"
          : "bg-gray-200 hover:bg-gray-300"
      }`}
      onClick={() => setCurrentPage(page)}
    >
      {page}
    </button>
  );
};

export default Pagination;
