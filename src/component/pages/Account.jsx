import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Spin, Empty, Tabs } from "antd";
import { EditOutlined } from "@ant-design/icons";
import ApiService from "../../service/ApiService";
import UpdateProfile from "./UpdateProfile";
import "../../static/style/profile.css";
import "../../static/style/account.css";
import Notification from "../common/Notification";

const { TabPane } = Tabs;

const Account = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [notification, setNotification] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  useEffect(() => {
    fetchUserInfo();
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const fetchUserInfo = async () => {
    try {
      const response = await ApiService.User.getMyInfo();
      setUserInfo(response.data);
      showNotification("Tải thông tin người dùng thành công", "success");
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Unable to fetch user info");
      showNotification("Không thể tải thông tin người dùng", "error");
    }
  };

  const handleUpdateProfile = async (userId, formData) => {
    try {
      console.log("Sending update for user ID:", userId);
      for (const pair of formData.entries()) {
        console.log(pair[0] + ": " + pair[1]);
      }

      const updateResponse = await ApiService.User.updateUser(userId, formData);
      console.log("Update response:", updateResponse);

      const userResponse = await ApiService.User.getMyInfo();
      setUserInfo(userResponse.data);

      showNotification("Cập nhật thông tin thành công", "success");
      return updateResponse;
    } catch (error) {
      console.error("Error updating profile:", error);
      showNotification(error.response?.data?.message || error.message || "Cập nhật thông tin thất bại", "error");
      throw error;
    } finally {
      setIsEditing(false);
    }
  };

  const handleAddressClick = () => {
    navigate(userInfo.address ? "/edit-address" : "/add-address", { state: { returnUrl: "/account" } });
  };

  if (!userInfo && !error) {
    return (
      <div className="loading-container">
        <Spin size="large" />
      </div>
    );
  }

  const renderPersonalInfo = () => {
    if (isEditing) {
      return <UpdateProfile userInfo={userInfo} onUpdate={handleUpdateProfile} onCancel={() => setIsEditing(false)} />;
    }

    return (
      <Card
        title="Thông tin cá nhân"
        extra={
          <Button icon={<EditOutlined />} type="link" onClick={() => setIsEditing(true)}>
            Sửa
          </Button>
        }
      >
        <div className="info-grid">
          <div className="info-item">
            <span className="info-label">Tên</span>
            <span className="info-value">{userInfo.firstName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Họ</span>
            <span className="info-value">{userInfo.lastName}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Ngày sinh</span>
            <span className="info-value">{userInfo.dateOfBirth}</span>
          </div>
          <div className="info-item">
            <span className="info-label">Email</span>
            <span className="info-value">{userInfo.email}</span>
          </div>
        </div>
      </Card>
    );
  };

  const renderAddressInfo = () => {
    return (
      <Card
        title="Thông tin địa chỉ"
        extra={
          <Button type="primary" onClick={handleAddressClick}>
            {userInfo.address ? "Sửa địa chỉ" : "Thêm địa chỉ"}
          </Button>
        }
      >
        {userInfo.address ? (
          <div className="info-grid">
            <div className="info-item">
              <span className="info-label">Số nhà</span>
              <span className="info-value">{userInfo.address.houseNumber}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Đường</span>
              <span className="info-value">{userInfo.address.street}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Phường</span>
              <span className="info-value">{userInfo.address.ward}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Quận</span>
              <span className="info-value">{userInfo.address.district}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Thành phố</span>
              <span className="info-value">{userInfo.address.city}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Quốc gia</span>
              <span className="info-value">{userInfo.address.country}</span>
            </div>
          </div>
        ) : (
          <Empty description="Chưa có thông tin địa chỉ" />
        )}
      </Card>
    );
  };

  return (
    <div className="account-container">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <div className="account-header">
        <div className="header-content">
          <div className="profile-image-wrapper">
            <img src={userInfo.imageUrl || "/placeholder.svg"} alt={userInfo.username} className="profile-image" />
          </div>
          <div className="user-intro">
            <h1>Xin chào, {userInfo.username}</h1>
            <p>{userInfo.email}</p>
          </div>
        </div>
      </div>

      <div className="account-sections">
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Thông tin cá nhân" key="1">
            {renderPersonalInfo()}
          </TabPane>
          <TabPane tab="Địa chỉ" key="2">
            {renderAddressInfo()}
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Account;