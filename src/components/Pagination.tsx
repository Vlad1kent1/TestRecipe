import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const paginationItems = [];

  if (totalPages <= 9) {
    for (let i = 1; i <= totalPages; i++) {
      paginationItems.push(i);
    }
  } else {
    paginationItems.push(1);

    if (currentPage <= 5) {
      for (let i = 2; i <= 7; i++) {
        paginationItems.push(i);
      }
      paginationItems.push("...");
      paginationItems.push(totalPages);
    } else if (currentPage > 5 && currentPage <= totalPages - 4) {
      paginationItems.push("...");
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        paginationItems.push(i);
      }
      paginationItems.push("...");
      paginationItems.push(totalPages);
    } else {
      paginationItems.push("...");
      for (let i = totalPages - 6; i <= totalPages; i++) {
        paginationItems.push(i);
      }
    }
  }

  return (
    <div className="flex justify-center mt-4">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 bg-gray-200 text-gray-500 rounded-l"
      >
        &lt;
      </button>
      {paginationItems.map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`px-3 py-1 ${
            page === currentPage
              ? "bg-blue-500 text-white"
              : "bg-white text-blue-500"
          } border`}
          disabled={typeof page !== "number"}
        >
          {page}
        </button>
      ))}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 bg-gray-200 text-gray-500 rounded-r"
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
