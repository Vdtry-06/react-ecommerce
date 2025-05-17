import React from "react";
import { Pagination as AntdPagination } from "antd";
import "../../static/style/pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="pagination">
      <AntdPagination
        current={currentPage}
        total={totalPages * 10}
        pageSize={10}
        onChange={onPageChange}
        showSizeChanger={false}
        showQuickJumper={false}
      />
    </div>
  );
};

export default Pagination;