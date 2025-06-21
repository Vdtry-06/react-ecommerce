import { useState, useEffect } from "react";
import { Form, Input, Button, Card, DatePicker, Upload } from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import "../../../static/style/profile.css";
import Notification from "../../../components/common/Notification";

const { Title } = Form;

export default function UpdateProfile({ userInfo, onUpdate, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(userInfo.imageUrl || "");
  const [imageFile, setImageFile] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    form.setFieldsValue({
      firstName: userInfo.firstName || "",
      lastName: userInfo.lastName || "",
      dateOfBirth: userInfo.dateOfBirth ? dayjs(userInfo.dateOfBirth) : null,
      email: userInfo.email || "",
    });
  }, [userInfo, form]);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (values.firstName) formData.append("firstName", values.firstName);
      if (values.lastName) formData.append("lastName", values.lastName);
      if (values.dateOfBirth)
        formData.append("dateOfBirth", values.dateOfBirth.format("YYYY-MM-DD"));
      if (imageFile) formData.append("file", imageFile);

      await onUpdate(userInfo.id, formData);
      showNotification("Cập nhật thông tin thành công", "success");

      setTimeout(() => {
        onCancel();
      }, 2000);
    } catch (error) {
      console.error("Update error:", error);
      showNotification(
        error.response?.data?.message ||
          error.message ||
          "Cập nhật thông tin thất bại",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      throw new Error("Bạn chỉ có thể tải lên file JPG/PNG!");
    }

    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      throw new Error("Kích thước ảnh phải nhỏ hơn 2MB!");
    }

    setImageFile(file);
    return false;
  };

  const handleChange = (info) => {
    if (info.file) {
      getBase64(info.file, (url) => setImageUrl(url));
    }
  };

  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result));
    reader.readAsDataURL(img);
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="upload-text">Tải ảnh lên</div>
    </div>
  );

  return (
    <Card title="Cập nhật thông tin cá nhân">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          firstName: userInfo.firstName || "",
          lastName: userInfo.lastName || "",
          dateOfBirth: userInfo.dateOfBirth
            ? dayjs(userInfo.dateOfBirth)
            : null,
          email: userInfo.email || "",
        }}
      >
        <div className="avatar-container">
          <Upload
            name="file"
            listType="picture-circle"
            className="avatar-uploader"
            showUploadList={false}
            beforeUpload={beforeUpload}
            onChange={handleChange}
          >
            {imageUrl ? (
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="avatar"
                className="avatar-image"
              />
            ) : (
              uploadButton
            )}
          </Upload>
        </div>

        <div className="form-row">
          <Form.Item
            name="firstName"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
          >
            <Input placeholder="Nhập tên" />
          </Form.Item>
          <Form.Item
            name="lastName"
            label="Họ"
            rules={[{ required: true, message: "Vui lòng nhập họ!" }]}
          >
            <Input placeholder="Nhập họ" />
          </Form.Item>
        </div>

        <Form.Item name="dateOfBirth" label="Ngày sinh">
          <DatePicker
            className="full-width"
            format="YYYY-MM-DD"
            placeholder="Chọn ngày sinh"
          />
        </Form.Item>

        <Form.Item name="email" label="Email">
          <Input disabled />
        </Form.Item>
        <div className="email-note">Email không thể thay đổi</div>

        <div className="form-actions">
          <Button onClick={onCancel}>Hủy</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Lưu thay đổi
          </Button>
        </div>
      </Form>
    </Card>
  );
}
