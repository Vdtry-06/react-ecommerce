import { Card, Table } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";

const OrderItemsCard = ({ orderLines }) => {
  const orderLineColumns = [
    {
      title: "Sản phẩm",
      dataIndex: "productId",
      key: "productId",
      width: 120,
      render: (productId) => (
        <span
          style={{
            background: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
            color: "#7c3aed",
            padding: "6px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          SP #{productId}
        </span>
      ),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (quantity) => (
        <span
          style={{
            background: "linear-gradient(135deg, #e0f2fe, #bae6fd)",
            color: "#0369a1",
            padding: "4px 12px",
            borderRadius: "8px",
            fontSize: "12px",
            fontWeight: "600",
          }}
        >
          {quantity}
        </span>
      ),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      width: 150,
      render: (price) => (
        <span
          style={{
            color: "#059669",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {price.toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
    {
      title: "Thành tiền",
      key: "total",
      width: 150,
      render: (_, record) => (
        <span
          style={{
            color: "#dc2626",
            fontWeight: "700",
            fontSize: "14px",
          }}
        >
          {(record.price * record.quantity).toLocaleString("vi-VN")} VNĐ
        </span>
      ),
    },
  ];

  return (
    <Card
      title={
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <ShoppingOutlined style={{ color: "#3b82f6" }} />
          <span style={{ fontSize: "18px", fontWeight: "600", color: "#1e293b" }}>
            Chi tiết sản phẩm ({orderLines?.length || 0} sản phẩm)
          </span>
        </div>
      }
      style={{
        borderRadius: "16px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
        border: "1px solid #e2e8f0",
      }}
      bodyStyle={{ padding: "24px" }}
    >
      <Table
        columns={orderLineColumns}
        dataSource={orderLines}
        rowKey="id"
        pagination={false}
        locale={{
          emptyText: (
            <div style={{ padding: "40px", textAlign: "center" }}>
              <ShoppingOutlined style={{ fontSize: "48px", color: "#cbd5e1", marginBottom: "16px" }} />
              <p style={{ color: "#64748b", fontSize: "16px", margin: 0 }}>Đơn hàng không có sản phẩm nào</p>
            </div>
          ),
        }}
        style={{ borderRadius: "12px", overflow: "hidden" }}
        summary={(pageData) => {
          const totalQuantity = pageData.reduce((sum, record) => sum + record.quantity, 0);
          const totalAmount = pageData.reduce((sum, record) => sum + record.price * record.quantity, 0);

          return (
            <Table.Summary.Row
              style={{
                background: "linear-gradient(135deg, #f8fafc, #f1f5f9)",
                fontWeight: "600",
              }}
            >
              <Table.Summary.Cell index={0}>
                <span style={{ fontWeight: "700", color: "#1e293b" }}>Tổng cộng</span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <span
                  style={{
                    background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                    color: "white",
                    padding: "4px 12px",
                    borderRadius: "8px",
                    fontSize: "12px",
                    fontWeight: "600",
                  }}
                >
                  {totalQuantity}
                </span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2}>-</Table.Summary.Cell>
              <Table.Summary.Cell index={3}>
                <span
                  style={{
                    color: "#dc2626",
                    fontWeight: "700",
                    fontSize: "16px",
                  }}
                >
                  {totalAmount.toLocaleString("vi-VN")} VNĐ
                </span>
              </Table.Summary.Cell>
            </Table.Summary.Row>
          );
        }}
      />
    </Card>
  );
};

export default OrderItemsCard;