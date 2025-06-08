import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Form, Input, Button, Typography, Space } from "antd";
import ApiService from "../../service/ApiService";
import "../../static/style/address.css";
import Notification from "../common/Notification";

const { Title } = Typography;

const AddressPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = location.pathname === "/edit-address";

  useEffect(() => {
    if (isEditMode || location.pathname === "/add-address") {
      fetchUserInfo();
    }
  }, [location.pathname]);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const fetchUserInfo = async () => {
    setLoading(true);
    showNotification("Lấy thông tin địa chỉ thành công", "success");
    try {
      const response = await ApiService.User.getMyInfo();
      const userAddress = response?.data?.address || {
        country: "",
        city: "",
        district: "",
        ward: "",
        street: "",
        houseNumber: "",
      };
      form.setFieldsValue(userAddress);
    } catch (err) {
      showNotification("Không thể tải thông tin người dùng", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      await (isEditMode ? ApiService.Address.updateAddress(values) : ApiService.Address.addAddress(values));
      const successMessage = isEditMode ? "Cập nhật địa chỉ thành công" : "Thêm địa chỉ thành công";
      showNotification(successMessage, "success");

      setTimeout(() => {
        const returnUrl = location.state?.returnUrl || "/account";
        navigate(returnUrl, {
          state: {
            checkoutState: location.state?.checkoutState,
            ...(returnUrl === "/account" ? { activeTab: "2" } : {})
          }
        });
      }, 2000);
    } catch (err) {
      showNotification("Lỗi khi lưu địa chỉ", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="address-page">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Title level={2}>{isEditMode ? "Chỉnh sửa địa chỉ" : "Thêm địa chỉ"}</Title>
      <Form
        form={form}
        onFinish={handleSubmit}
        layout="vertical"
        className="address-form"
        disabled={loading}
      >
        <Form.Item
          name="country"
          label="Quốc gia"
          rules={[{ required: true, message: "Vui lòng nhập quốc gia" }]}
        >
          <Input placeholder="Nhập quốc gia" />
        </Form.Item>
        <Form.Item
          name="city"
          label="Thành phố"
          rules={[{ required: true, message: "Vui lòng nhập thành phố" }]}
        >
          <Input placeholder="Nhập thành phố" />
        </Form.Item>
        <Form.Item
          name="district"
          label="Quận"
          rules={[{ required: true, message: "Vui lòng nhập quận" }]}
        >
          <Input placeholder="Nhập quận" />
        </Form.Item>
        <Form.Item
          name="ward"
          label="Phường"
          rules={[{ required: true, message: "Vui lòng nhập phường" }]}
        >
          <Input placeholder="Nhập phường" />
        </Form.Item>
        <Form.Item
          name="street"
          label="Đường"
          rules={[{ required: true, message: "Vui lòng nhập đường" }]}
        >
          <Input placeholder="Nhập đường" />
        </Form.Item>
        <Form.Item
          name="houseNumber"
          label="Số nhà"
          rules={[{ required: true, message: "Vui lòng nhập số nhà" }]}
        >
          <Input placeholder="Nhập số nhà" />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditMode ? "Cập nhật" : "Lưu"}
            </Button>
            <Button
              onClick={() => {
                const returnUrl = location.state?.returnUrl || "/account";
                navigate(returnUrl, {
                  state: {
                    checkoutState: location.state?.checkoutState,
                    ...(returnUrl === "/account" ? { activeTab: "2" } : {})
                  },
                });
              }}
              disabled={loading}
            >
              Hủy bỏ
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddressPage;