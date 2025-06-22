import { Modal, message } from "antd";
import ApiService from "../../../service/ApiService";

const ProductDeleteModal = ({ visible, productId, onCancel, onOk, setLoading }) => {
  const handleDeleteOk = async () => {
    setLoading(true);
    try {
      await ApiService.Product.deleteProduct(productId);
      message.success("Xóa sản phẩm thành công");
      onOk();
    } catch (error) {
      if (error.response?.status === 401) {
        message.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      } else {
        message.error(
          error.response?.data?.message ||
            "Không thể xóa sản phẩm vì đã có ràng buộc."
        );
      }
      console.error("Error deleting product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Xác nhận xóa sản phẩm"
      open={visible}
      onOk={handleDeleteOk}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      Bạn có chắc chắn muốn xóa sản phẩm này? Hành động này không thể hoàn tác.
    </Modal>
  );
};

export default ProductDeleteModal;