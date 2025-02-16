import React from "react";
import '../../style/pagination.css';


const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    
    const pageNumber = [];

    for(let i = 1; i <= totalPages; i++) {
        pageNumber.push(i);
    }

    return (
        <div className="pagination">
            {pageNumber.map((number) => (
                <button
                    key={number}
                    onClick={() => onPageChange(number)}
                    className={number === currentPage ? "active" : ""}
                >
                    {number}
                </button>
            ))}
        </div>
    );
}

export default Pagination;