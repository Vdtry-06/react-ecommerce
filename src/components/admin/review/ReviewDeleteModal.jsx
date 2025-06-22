import { Modal } from "antd";

const ReviewDeleteModal = ({ visible, onOk, onCancel }) => {
  return (
    <Modal
      title="Xác nhận xóa đánh giá"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      Bạn có chắc chắn muốn xóa đánh giá này? Hành động này không thể hoàn tác.
    </Modal>
  );
};

export default ReviewDeleteModal;