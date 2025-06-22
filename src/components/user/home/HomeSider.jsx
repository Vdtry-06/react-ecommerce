import React from "react";
import { Space, Button, Dropdown } from "antd";
import { Layout } from 'antd';
const { Sider } = Layout;

const HomeSider = () => {
  const functionItems = [
    {
      key: "1-1",
      label: "Sắp xếp theo giá tăng dần",
      onClick: () => (window.location.href = "/home?sort=price-asc"),
    },
    {
      key: "1-2",
      label: "Sắp xếp theo giá giảm dần",
      onClick: () => (window.location.href = "/home?sort=price-desc"),
    },
    {
      key: "1-3",
      label: "Lọc theo tính năng",
      children: [
        {
          key: "1-3-1",
          label: "Giao hàng nhanh",
          onClick: () => (window.location.href = "/home?feature=fast"),
        },
        {
          key: "1-3-2",
          label: "Bền lâu",
          onClick: () => (window.location.href = "/home?feature=durable"),
        },
      ],
    },
  ];

  const utilityItems = [
    {
      key: "2-1",
      label: "Sản phẩm mới nhất",
      onClick: () => (window.location.href = "/home?filter=new"),
    },
    {
      key: "2-2",
      label: "Tiện ích đặc biệt",
      children: [
        {
          key: "2-2-1",
          label: "Thân thiện môi trường",
          onClick: () => (window.location.href = "/home?utility=eco"),
        },
        {
          key: "2-2-2",
          label: "Thông minh",
          onClick: () => (window.location.href = "/home?utility=smart"),
        },
      ],
    },
  ];

  const reviewItems = [
    {
      key: "3-1",
      label: "Sản phẩm phổ biến",
      onClick: () => (window.location.href = "/home?filter=popular"),
    },
    {
      key: "3-2",
      label: "Đánh giá chi tiết",
      children: [
        {
          key: "3-2-1",
          label: "5 sao",
          onClick: () => (window.location.href = "/home?review=5star"),
        },
        {
          key: "3-2-2",
          label: "Đánh giá cao",
          onClick: () => (window.location.href = "/home?review=high"),
        },
      ],
    },
  ];

  const orderItems = [
    {
      key: "4-1",
      label: "Sản phẩm giảm giá",
      onClick: () => (window.location.href = "/home?extra=discount"),
    },
    {
      key: "4-2",
      label: "Ưu đãi từ 2 lần đặt trở lên",
      children: [
        {
          key: "4-2-1",
          label: "Giảm 10% sản phẩm",
          onClick: () => (window.location.href = "/home?promo=discount-10"),
        },
        {
          key: "4-2-2",
          label: "Thêm 1 đồ uống",
          onClick: () => (window.location.href = "/home?promo=free-drink"),
        },
      ],
    },
  ];

  const extraItems = [
    {
      key: "5-1",
      label: "Sản phẩm giảm giá",
      onClick: () => (window.location.href = "/home?extra=discount"),
    },
    {
      key: "5-2",
      label: "Khuyến mãi",
      children: [
        {
          key: "5-2-1",
          label: "Miễn phí vận chuyển",
          onClick: () => (window.location.href = "/home?promo=free-shipping"),
        },
        {
          key: "5-2-2",
          label: "Gói ưu đãi",
          onClick: () => (window.location.href = "/home?promo=bundle"),
        },
      ],
    },
  ];

  return (
    <Sider className="home-sider">
      <Space direction="vertical" size="middle" className="sider-space">
        <Dropdown menu={{ items: functionItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
          <Button className="sider-button">Chức năng</Button>
        </Dropdown>
        <Dropdown menu={{ items: utilityItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
          <Button className="sider-button">Tiện ích</Button>
        </Dropdown>
        <Dropdown menu={{ items: reviewItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
          <Button className="sider-button">Đánh giá tốt</Button>
        </Dropdown>
        <Dropdown menu={{ items: orderItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
          <Button className="sider-button">Đặt hàng ngay</Button>
        </Dropdown>
        <Dropdown menu={{ items: extraItems }} placement="bottomLeft" arrow={{ pointAtCenter: true }}>
          <Button className="sider-button">Khác</Button>
        </Dropdown>
      </Space>
    </Sider>
  );
};

export default HomeSider;