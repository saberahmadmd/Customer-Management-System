import "./Pagination.css";

const Pagination = ({ pagination, onPageChange, loading }) => {
  const { page, totalPages, hasNext, hasPrev } = pagination;

  if (totalPages <= 1) return null;

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages || newPage === page || loading) return;
    onPageChange(newPage);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`page-btn ${i === page ? 'active' : ''}`}
          disabled={loading}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  return (
    <div className="pagination">
      <button
        onClick={() => handlePageChange(1)}
        disabled={!hasPrev || loading}
        className="page-btn nav-btn"
      >
        « First
      </button>

      <button
        onClick={() => handlePageChange(page - 1)}
        disabled={!hasPrev || loading}
        className="page-btn nav-btn"
      >
        ‹ Prev
      </button>

      {renderPageNumbers()}

      <button
        onClick={() => handlePageChange(page + 1)}
        disabled={!hasNext || loading}
        className="page-btn nav-btn"
      >
        Next ›
      </button>

      <button
        onClick={() => handlePageChange(totalPages)}
        disabled={!hasNext || loading}
        className="page-btn nav-btn"
      >
        Last »
      </button>
    </div>
  );
};

export default Pagination;