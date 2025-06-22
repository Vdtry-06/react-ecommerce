import { useState, useEffect } from "react";
import { Button, Typography, Card } from "antd";
import { PlusOutlined, AppstoreOutlined } from "@ant-design/icons";
import CategoryTable from "../../../components/admin/category/CategoryTable";
import CategoryFormModal from "../../../components/admin/category/CategoryFormModal";
import CategoryDeleteModal from "../../../components/admin/category/CategoryDeleteModal";
import ApiService from "../../../service/ApiService";
import { message } from "antd";

const { Title } = Typography;

const AdminCategoryPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await ApiService.Category.getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách danh mục");
      console.error("Error fetching category list:", error);
    } finally {
      setLoading(false);
    }
  };

  const showModal = (category = null) => {
    setEditingCategory(category);
    setIsModalVisible(true);
  };

  const handleDelete = (categoryId) => {
    setCategoryToDelete(categoryId);
    setIsDeleteModalVisible(true);
  };

  return (
    <div style={{ padding: "24px" }}>
      <div
        style={{
          marginTop: -20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AppstoreOutlined style={{ color: "white", fontSize: "20px" }} />
          </div>
          <Title
            level={2}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #1e3c72, #2a5298)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Quản lý danh mục
          </Title>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
          style={{
            height: "48px",
            borderRadius: "12px",
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            border: "none",
            fontSize: "16px",
            fontWeight: "600",
            paddingLeft: "24px",
            paddingRight: "24px",
          }}
        >
          Thêm danh mục
        </Button>
      </div>

      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <CategoryTable
          categories={categories}
          loading={loading}
          onEdit={showModal}
          onDelete={handleDelete}
        />
      </Card>

      <CategoryFormModal
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        editingCategory={editingCategory}
        setCategories={setCategories}
        categories={categories}
        setLoading={setLoading}
        setEditingCategory={setEditingCategory}
      />

      <CategoryDeleteModal
        visible={isDeleteModalVisible}
        categoryId={categoryToDelete}
        onCancel={() => {
          setIsDeleteModalVisible(false);
          setCategoryToDelete(null);
        }}
        onOk={() => {
          setCategories(categories.filter((c) => c.id !== categoryToDelete));
          setIsDeleteModalVisible(false);
          setCategoryToDelete(null);
        }}
        setLoading={setLoading}
      />
    </div>
  );
};

export default AdminCategoryPage;