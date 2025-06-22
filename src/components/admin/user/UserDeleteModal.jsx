import { Modal } from "antd";

const UserDeleteModal = ({ visible, onOk, onCancel }) => {
  return (
    <Modal
      title="Xác nhận xóa người dùng"
      open={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Xóa"
      cancelText="Hủy"
      okButtonProps={{ danger: true }}
    >
      Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
    </Modal>
  );
};

export default UserDeleteModal;