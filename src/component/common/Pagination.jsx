import React from "react";
import '../../static/style/pagination.css';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 3;

    if (totalPages <= maxPageNumbersToShow) {
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }
    } else {
        let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
        let endPage = startPage + maxPageNumbersToShow - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = endPage - maxPageNumbersToShow + 1;
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        if (startPage > 1) {
            pageNumbers.unshift('...');
            pageNumbers.unshift(1);
        }

        if (endPage < totalPages) {
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }
    }

    return (
        <div className="pagination">
            {currentPage > 1 && (
                <button onClick={() => onPageChange(currentPage - 1)}>&lt;</button>
            )}
            {pageNumbers.map((number, index) => (
                <button
                    key={index}
                    onClick={() => number !== '...' && onPageChange(number)}
                    className={number === currentPage ? "active" : ""}
                    disabled={number === '...'}
                >
                    {number}
                </button>
            ))}
            {currentPage < totalPages && (
                <button onClick={() => onPageChange(currentPage + 1)}>&gt;</button>
            )}
        </div>
    );
}

export default Pagination;