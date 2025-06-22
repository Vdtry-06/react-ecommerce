import { Modal, message } from "antd";
import ApiService from "../../../service/ApiService";

const CategoryDeleteModal = ({ visible, categoryId, onCancel, onOk, setLoading }) => {
  const handleDeleteOk = async () => {
    setLoading(true);
    try {
      await ApiService.Category.deleteCategory(categoryId);
      message.success("Danh mục đã được xóa thành công");
      onOk();
    } catch (error) {
      message.error("Không thể xóa: Danh mục này có thể đang được liên kết với sản phẩm.");
      console.error("Error deleting category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Xác nhận xóa danh mục"
      open={visible}
      onOk={handleDeleteOk}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể hoàn tác.
    </Modal>
  );
};

export default CategoryDeleteModal;