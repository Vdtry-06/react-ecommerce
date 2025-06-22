import { useState, useEffect } from "react";
import { Card, Form } from "antd";
import ToppingsHeader from "../../../components/admin/topping/ToppingHeader";
import ToppingsTable from "../../../components/admin/topping/ToppingTable";
import ToppingFormModal from "../../../components/admin/topping/ToppingFormModal";
import ToppingDeleteModal from "../../../components/admin/topping/ToppingDeleteModal";
import ApiService from "../../../service/ApiService";
import { message } from "antd";

const AdminToppingPage = () => {
  const [toppings, setToppings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTopping, setEditingTopping] = useState(null);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [toppingToDelete, setToppingToDelete] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchToppings();
  }, []);

  const fetchToppings = async () => {
    setLoading(true);
    try {
      const response = await ApiService.Topping.getAllToppings();
      setToppings(response.data || []);
    } catch (error) {
      message.error("Không thể tải danh sách toppings");
      console.error("Error fetching toppings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      if (editingTopping) {
        const response = await ApiService.Topping.updateTopping(
          editingTopping.id,
          values
        );
        setToppings(
          toppings.map((t) => (t.id === editingTopping.id ? response.data : t))
        );
        message.success("Topping đã được cập nhật thành công");
      } else {
        const response = await ApiService.Topping.addTopping(values);
        setToppings([...toppings, response.data]);
        message.success("Topping đã được thêm thành công");
      }
      setIsModalVisible(false);
      form.resetFields();
      setEditingTopping(null);
    } catch (error) {
      message.error(
        `Không thể ${editingTopping ? "cập nhật" : "thêm"} topping`
      );
      console.error("Error saving topping:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (toppingId) => {
    setToppingToDelete(toppingId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    setLoading(true);
    try {
      await ApiService.Topping.deleteTopping(toppingToDelete);
      setToppings(toppings.filter((t) => t.id !== toppingToDelete));
      message.success("Topping đã được xóa thành công");
    } catch (error) {
      message.error("Không thể xóa topping");
      console.error("Error deleting topping:", error);
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setToppingToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setToppingToDelete(null);
  };

  const showModal = (topping = null) => {
    setEditingTopping(topping);
    if (topping) {
      form.setFieldsValue(topping);
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  return (
    <div style={{ padding: "24px" }}>
      <ToppingsHeader onAdd={() => showModal()} />
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <ToppingsTable
          toppings={toppings}
          loading={loading}
          onEdit={showModal}
          onDelete={handleDelete}
        />
      </Card>
      <ToppingFormModal
        visible={isModalVisible}
        form={form}
        onSubmit={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        editingTopping={editingTopping}
        loading={loading}
      />
      <ToppingDeleteModal
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default AdminToppingPage;