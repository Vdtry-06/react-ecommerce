import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { LaptopOutlined, NotificationOutlined, UserOutlined } from "@ant-design/icons";

const { Header, Content, Sider } = Layout;

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: UserOutlined, path: "/admin/dashboard" },
    { key: "categories", label: "Categories", icon: LaptopOutlined, path: "/admin/categories" },
    { key: "products", label: "Products", icon: NotificationOutlined, path: "/admin/products" },
    { key: "orders", label: "Orders", icon: LaptopOutlined, path: "/admin/orders" },
    { key: "users", label: "Users", icon: UserOutlined, path: "/admin/users" },
    { key: "toppings", label: "Toppings", icon: NotificationOutlined, path: "/admin/toppings" },
  ];

  const activeSection = menuItems.find(item => item.path === location.pathname)?.key || "dashboard";

  const handleMenuClick = ({ key }) => {
    const item = menuItems.find(i => i.key === key);
    if (item) navigate(item.path);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider width={200} style={{ background: colorBgContainer }}>
          <Menu
            mode="inline"
            selectedKeys={[activeSection]}
            style={{ height: "100%", borderRight: 0 }}
            items={menuItems.map(item => ({
              key: item.key,
              icon: React.createElement(item.icon),
              label: item.label,
            }))}
            onClick={handleMenuClick}
          />
        </Sider>
        <Layout style={{ padding: "0 24px 24px" }}>
          <Breadcrumb
            items={[
              { title: "Home" },
              { title: menuItems.find(item => item.key === activeSection)?.label || "Admin" },
            ]}
            style={{ margin: "16px 0" }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminPage;