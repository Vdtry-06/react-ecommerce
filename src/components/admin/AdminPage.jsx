import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import {
  DashboardOutlined,
  AppstoreOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  StarOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

const { Content, Sider } = Layout;

const AdminPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const menuItems = [
    {
      key: "dashboard",
      label: "Dashboard",
      icon: DashboardOutlined,
      path: "/admin/dashboard",
    },
    {
      key: "categories",
      label: "Categories",
      icon: AppstoreOutlined,
      path: "/admin/categories",
    },
    {
      key: "products",
      label: "Products",
      icon: ShoppingOutlined,
      path: "/admin/products",
    },
    {
      key: "orders",
      label: "Orders",
      icon: ShoppingCartOutlined,
      path: "/admin/orders",
    },
    { key: "users", label: "Users", icon: UserOutlined, path: "/admin/users" },
    {
      key: "reviews",
      label: "Reviews",
      icon: StarOutlined,
      path: "/admin/reviews",
    },
    {
      key: "toppings",
      label: "Toppings",
      icon: PlusCircleOutlined,
      path: "/admin/toppings",
    },
  ];

  let activeSection = "dashboard";
  let breadcrumbTitle = "Dashboard";
  if (location.pathname === "/admin/dashboard/charts") {
    activeSection = "dashboard";
    breadcrumbTitle = "Charts";
  } else if (
    location.pathname.startsWith("/admin/products") ||
    location.pathname === "/admin/add-product" ||
    location.pathname.startsWith("/admin/edit-product") ||
    location.pathname === "/admin/edit-product"
  ) {
    activeSection = "products";
    breadcrumbTitle = "Products";
  } else if (location.pathname.startsWith("/admin/orders")) {
    activeSection = "orders";
    breadcrumbTitle = "Orders";
  } else if (
    location.pathname.startsWith("/admin/user") ||
    location.pathname === "/admin/user-detail"
  ) {
    activeSection = "users";
    breadcrumbTitle = "Users";
  } else {
    const matchedItem = menuItems.find(
      (item) => location.pathname === item.path
    );
    if (matchedItem) {
      activeSection = matchedItem.key;
      breadcrumbTitle = matchedItem.label;
    }
  }

  const handleMenuClick = ({ key }) => {
    const item = menuItems.find((i) => i.key === key);
    if (item) navigate(item.path);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout>
        <Sider
          width={250}
          style={{
            background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)",
            position: "fixed",
            height: "100%",
            marginTop: -26,
            overflowY: "auto",
            zIndex: 999,
            borderRight: "1px solid #e2e8f0",
            boxShadow: "2px 0 8px rgba(0,0,0,0.06)",
          }}
        >
          <Menu
            mode="inline"
            selectedKeys={[activeSection]}
            style={{
              height: "100%",
              borderRight: 0,
              background: "transparent",
              paddingTop: "16px",
            }}
            items={menuItems.map((item) => ({
              key: item.key,
              icon: React.createElement(item.icon),
              label: item.label,
              style: {
                margin: "4px 8px",
                borderRadius: "8px",
                height: "48px",
                lineHeight: "48px",
                color: "#fff",
              },
            }))}
            onClick={handleMenuClick}
            theme="light"
          />
        </Sider>
        <Layout
          style={{
            marginLeft: 250,
            padding: "0 24px 24px",
            marginTop: -21,
            background: "linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Breadcrumb
            items={[
              { title: "Home", href: "/admin" },
              { title: breadcrumbTitle },
            ]}
            style={{
              margin: "16px 0",
              padding: "8px 16px",
              background: "rgba(255,255,255,0.7)",
              borderRadius: "8px",
              backdropFilter: "blur(10px)",
            }}
          />
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
              border: "1px solid #e2e8f0",
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
