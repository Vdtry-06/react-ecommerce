import { Table, Button, Space, Typography, Tag, Tooltip, Avatar, Badge } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  InboxOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

const ProductTable = ({ products, loading, onDelete, navigate }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  const getStockStatus = (quantity) => {
    if (quantity === 0)
      return { color: "#ef4444", text: "Hết hàng", status: "error" };
    if (quantity <= 5)
      return { color: "#f59e0b", text: "Sắp hết", status: "warning" };
    return { color: "#10b981", text: "Còn hàng", status: "success" };
  };

  const columns = [
    {
      title: "Sản phẩm",
      key: "product",
      fixed: "left",
      width: 300,
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar
            size={64}
            src={
              record.imageUrls && record.imageUrls.length > 0
                ? record.imageUrls[0]
                : ""
            }
            icon={<InboxOutlined />}
            style={{
              borderRadius: "12px",
              border: "2px solid #e2e8f0",
              background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
            }}
          />
          <div>
            <Text
              strong
              style={{ fontSize: "16px", color: "#1e293b", display: "block" }}
            >
              {record.name}
            </Text>
            <Text type="secondary" style={{ fontSize: "12px" }}>
              ID: #{record.id}
            </Text>
            <div style={{ marginTop: "4px" }}>
              <Text
                style={{
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#059669",
                }}
              >
                {formatPrice(record.price)}
              </Text>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Tồn kho",
      dataIndex: "availableQuantity",
      key: "availableQuantity",
      width: 120,
      align: "center",
      render: (quantity) => {
        const status = getStockStatus(quantity);
        return (
          <div style={{ textAlign: "center" }}>
            <Badge
              count={quantity}
              style={{
                backgroundColor: status.color,
                fontSize: "12px",
                fontWeight: "600",
                minWidth: "24px",
                height: "24px",
                lineHeight: "24px",
                borderRadius: "12px",
              }}
            />
            <div style={{ marginTop: "4px" }}>
              <Text
                style={{
                  fontSize: "11px",
                  color: status.color,
                  fontWeight: "600",
                }}
              >
                {status.text}
              </Text>
            </div>
          </div>
        );
      },
    },
    {
      title: "Danh mục",
      dataIndex: "categories",
      key: "categories",
      width: 200,
      render: (categories) =>
        categories && categories.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {categories.slice(0, 2).map((category) => (
              <Tag
                key={category.id}
                style={{
                  background:
                    "linear-gradient(135deg, #ddd6fe 0%, #c4b5fd 100%)",
                  color: "#7c3aed",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                {category.name}
              </Tag>
            ))}
            {categories.length > 2 && (
              <Tooltip
                title={categories
                  .slice(2)
                  .map((cat) => cat.name)
                  .join(", ")}
              >
                <Tag
                  style={{
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                >
                  +{categories.length - 2}
                </Tag>
              </Tooltip>
            )}
          </div>
        ) : (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Chưa phân loại
          </Text>
        ),
    },
    {
      title: "Toppings",
      dataIndex: "toppings",
      key: "toppings",
      width: 200,
      render: (toppings) =>
        toppings && toppings.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {toppings.slice(0, 2).map((topping) => (
              <Tag
                key={topping.id}
                style={{
                  background:
                    "linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)",
                  color: "#059669",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: "500",
                }}
              >
                {topping.name}
              </Tag>
            ))}
            {toppings.length > 2 && (
              <Tooltip
                title={toppings
                  .slice(2)
                  .map((top) => top.name)
                  .join(", ")}
              >
                <Tag
                  style={{
                    background: "#f1f5f9",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                >
                  +{toppings.length - 2}
                </Tag>
              </Tooltip>
            )}
          </div>
        ) : (
          <Text type="secondary" style={{ fontSize: "12px" }}>
            Không có
          </Text>
        ),
    },
    {
      title: "Thao tác",
      key: "actions",
      fixed: "right",
      width: 150,
      align: "center",
      render: (_, record) => (
        <Space
          size="small"
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/edit-product/${record.id}`)}
              style={{
                color: "#3b82f6",
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(59, 130, 246, 0.1)",
                border: "1px solid rgba(59, 130, 246, 0.2)",
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa sản phẩm">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => onDelete(record.id)}
              style={{
                borderRadius: "8px",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#ef4444",
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={products}
      rowKey="id"
      loading={loading}
      scroll={{ x: 1200 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} sản phẩm`,
        style: { padding: "16px 24px" },
      }}
      locale={{
        emptyText: (
          <div style={{ padding: "40px", textAlign: "center" }}>
            <InboxOutlined
              style={{
                fontSize: "48px",
                color: "#d1d5db",
                marginBottom: "16px",
              }}
            />
            <Text type="secondary" style={{ fontSize: "16px" }}>
              Chưa có sản phẩm nào. Thêm một sản phẩm để bắt đầu!
            </Text>
          </div>
        ),
      }}
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row-light" : "table-row-dark"
      }
    />
  );
};

export default ProductTable;