import { Table, Button, Space, Avatar } from "antd";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, DeleteOutlined, UserOutlined } from "@ant-design/icons";

const UserTable = ({ users, loading, onDelete }) => {
  const navigate = useNavigate();

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
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      fixed: "left",
      render: (username) => <span style={{ fontWeight: "600", color: "#1e293b", fontSize: "14px" }}>{username}</span>,
    },
    {
      title: "Avatar",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (url, record) =>
        url ? (
          <Avatar
            src={url}
            size={48}
            style={{
              border: "2px solid #e2e8f0",
            }}
          />
        ) : (
          <Avatar
            icon={<UserOutlined />}
            size={48}
            style={{
              backgroundColor: "#3b82f6",
              border: "2px solid #e2e8f0",
            }}
          />
        ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => <span style={{ color: "#64748b" }}>{email}</span>,
    },
    {
      title: "Họ tên",
      key: "fullName",
      render: (_, record) => {
        const fullName = [record.firstName, record.lastName].filter(Boolean).join(" ");
        return <span style={{ color: "#64748b" }}>{fullName || "Chưa cập nhật"}</span>;
      },
    },
    {
      title: "Ngày sinh",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      render: (date) => <span style={{ color: "#64748b" }}>{date || "Chưa cập nhật"}</span>,
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
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/user-detail/${record.id}`)}
            style={{
              color: "#3b82f6",
              borderRadius: "6px",
            }}
          >
            Chi tiết
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
      dataSource={users}
      rowKey="id"
      loading={loading}
      scroll={{ x: "max-content" }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} người dùng`,
      }}
      locale={{ emptyText: "Chưa có người dùng nào." }}
      style={{ borderRadius: "16px", overflow: "hidden" }}
    />
  );
};

export default UserTable;