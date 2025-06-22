import React from "react";
import { Card, Space, Checkbox, Button, Typography } from "antd";

const { Text } = Typography;

const HomeCategoryFilter = ({
  categories = [],
  tempSelectedCategories = new Set(),
  onToggle,
  onApply,
  loading,
  error,
}) => {
  return (
    <Card title="Danh mục" className="category-filter">
      {loading ? (
        <Text>Đang tải danh mục...</Text>
      ) : error ? (
        <Text type="danger">{error}</Text>
      ) : (
        <Space direction="vertical" size="middle">
          <Checkbox.Group
            value={Array.from(tempSelectedCategories)}
            onChange={(checkedValues) => onToggle(new Set(checkedValues))}
          >
            {(categories || []).map((category) => (
              <Checkbox key={category.id} value={category.id}>
                {category.name}
              </Checkbox>
            ))}
          </Checkbox.Group>
          <Button
            type="primary"
            onClick={onApply}
            disabled={tempSelectedCategories.size === 0}
            block
          >
            Lọc sản phẩm
          </Button>
        </Space>
      )}
    </Card>
  );
};

export default HomeCategoryFilter;
