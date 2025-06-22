import { Table, Button, Space, Rate, Switch } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  CalendarOutlined,
  StarOutlined,
} from "@ant-design/icons";

const ReviewsTable = ({ reviews, loading, onDelete, onEdit, onToggleVisibility }) => {
  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      fixed: "left",
      render: (id) => (
        <span
          style={{
            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
            color: "#0369a1",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          #{id}
        </span>
      ),
    },
    {
      title: "Sản phẩm",
      dataIndex: "productId",
      key: "productId",
      fixed: "left",
      render: (productId) => (
        <span
          style={{
            background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
            color: "#7c3aed",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          SP #{productId}
        </span>
      ),
    },
    {
      title: "Người dùng",
      dataIndex: "userId",
      key: "userId",
      fixed: "left",
      render: (userId) => (
        <span
          style={{
            background: "linear-gradient(135deg, #fef3c7, #fde68a)",
            color: "#92400e",
            padding: "4px 8px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          User #{userId}
        </span>
      ),
    },
    {
      title: "Đánh giá",
      dataIndex: "ratingScore",
      key: "ratingScore",
      render: (rating) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Rate disabled value={rating} style={{ fontSize: "16px" }} />
          <span style={{ fontWeight: "600", color: "#f59e0b" }}>({rating})</span>
        </div>
      ),
    },
    {
      title: "Bình luận",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      render: (comment) => (
        <span style={{ color: "#64748b", fontSize: "14px" }}>
          {comment || "Không có bình luận"}
        </span>
      ),
    },
    {
      title: "Ngày đánh giá",
      dataIndex: "reviewDate",
      key: "reviewDate",
      render: (date) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <CalendarOutlined style={{ color: "#64748b" }} />
          <span style={{ color: "#64748b", fontSize: "13px" }}>
            {new Date(date).toLocaleString("vi-VN")}
          </span>
        </div>
      ),
      sorter: (a, b) => new Date(b.reviewDate) - new Date(a.reviewDate),
    },
    {
      title: "Hiển thị",
      dataIndex: "visible",
      key: "visible",
      filters: [
        { text: "Hiển thị", value: true },
        { text: "Ẩn", value: false },
      ],
      onFilter: (value, record) => record.visible === value,
      render: (visible, record) => (
        <Switch
          checked={visible}
          onChange={() => onToggleVisibility(record.id, visible)}
          checkedChildren={<EyeOutlined />}
          unCheckedChildren={<EyeInvisibleOutlined />}
          disabled={loading}
          style={{
            background: visible ? "#10b981" : "#ef4444",
          }}
        />
      ),
    },
    {
      title: "Thao tác",
      key: "actions",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            style={{
              color: "#3b82f6",
              borderRadius: "6px",
            }}
            disabled={loading}
          >
            Sửa
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => onDelete(record.id)}
            style={{
              borderRadius: "6px",
            }}
            disabled={loading}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={reviews}
      rowKey="id"
      loading={loading}
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50"],
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} đánh giá`,
      }}
      style={{ borderRadius: "16px", overflow: "hidden" }}
      rowClassName={(record) => (record.visible ? "" : "opacity-60")}
      locale={{
        emptyText: (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <StarOutlined
              style={{
                fontSize: "48px",
                color: "#cbd5e1",
                marginBottom: "16px",
              }}
            />
            <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>
              Chưa có đánh giá nào từ khách hàng
            </p>
          </div>
        ),
      }}
    />
  );
};

export default ReviewsTable;