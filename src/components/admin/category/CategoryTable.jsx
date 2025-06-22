import { Table, Button, Space } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const CategoryTable = ({ categories, loading, onEdit, onDelete }) => {
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
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      fixed: "left",
      render: (name) => (
        <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>
          {name}
        </span>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      render: (text) => (
        <span style={{ color: "#64748b" }}>{text || "Không có mô tả"}</span>
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
      dataSource={categories}
      rowKey="id"
      loading={loading}
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} danh mục`,
      }}
      locale={{
        emptyText: "Chưa có danh mục nào. Thêm danh mục để bắt đầu!",
      }}
      style={{ borderRadius: "16px", overflow: "hidden" }}
    />
  );
};

export default CategoryTable;