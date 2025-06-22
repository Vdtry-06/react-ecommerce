import { Layout, Button, Dropdown, Avatar, Space, Typography } from "antd";
import {
  UserOutlined,
  LogoutOutlined,
  EyeOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";

const { Header } = Layout;
const { Text } = Typography;

const AdminHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmLogout) {
      ApiService.logout();
      navigate("/login");
    }
  };

  const handleViewUserInterface = () => {
    window.open("/", "_blank");
  };

  const menuItems = [
    {
      key: "view-user-interface",
      label: "Xem giao diện người dùng",
      icon: <EyeOutlined />,
      onClick: handleViewUserInterface,
    },
    {
      key: "settings",
      label: "Cài đặt",
      icon: <SettingOutlined />,
      onClick: () => navigate("/admin/settings"),
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      label: "Đăng xuất",
      icon: <LogoutOutlined />,
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <Header
      className="admin-header"
      style={{
        background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
        padding: "0 24px",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1001,
        height: "55px",
        lineHeight: "64px",
        width: "calc(100% - 6px)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/logo2.png"
          alt="Logo"
          style={{ height: "40px", marginRight: "16px" }}
        />
        <div>
          <Text strong style={{ fontSize: "18px", color: "#ffffff" }}>
            Bảng điều khiển quản trị
          </Text>
        </div>
      </div>

      <Space size="middle">
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={handleViewUserInterface}
          style={{
            borderRadius: "8px",
            height: "40px",
            background: "rgba(255,255,255,0.2)",
            border: "1px solid rgba(255,255,255,0.3)",
            color: "#ffffff",
            fontWeight: "500",
          }}
        >
          Giao diện người dùng
        </Button>

        <Dropdown
          menu={{ items: menuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button
            type="text"
            style={{
              height: "40px",
              width: "40px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
            }}
          >
            <Avatar
              size={32}
              icon={<UserOutlined />}
              style={{
                backgroundColor: "#ffffff",
                color: "#1e3c72",
              }}
            />
          </Button>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AdminHeader;