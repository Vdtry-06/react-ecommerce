import { Modal } from "antd";

const ToppingDeleteModal = ({ visible, onOk, onCancel }) => {
  return (
    <Modal
      title="Xác nhận xóa Topping"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      Bạn có chắc chắn muốn xóa Topping này? Hành động này không thể hoàn tác.
    </Modal>
  );
};

export default ToppingDeleteModal;