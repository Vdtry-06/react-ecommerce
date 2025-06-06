import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, Button, Spin, Empty, Tabs, message } from "antd";
import { EditOutlined } from "@ant-design/icons";
import ApiService from "../../service/ApiService";
import UpdateProfile from "./UpdateProfile";
import "../../static/style/profile.css";
import "../../static/style/account.css";

const { TabPane } = Tabs;

const Account = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("1"); // Default to "Thông tin cá nhân"
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchUserInfo();
    // Set active tab based on navigation state
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }
  }, [location.state]);

  const fetchUserInfo = async () => {
    try {
      const response = await ApiService.User.getMyInfo();
      setUserInfo(response.data);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Unable to fetch user info");
      message.error("Không thể tải thông tin người dùng");
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

      if (updateResponse && updateResponse.data) {
        setUserInfo(updateResponse.data);
      } else {
        const userResponse = await ApiService.User.getUser(userId);
        if (userResponse && userResponse.data) {
          setUserInfo(userResponse.data);
        } else {
          await fetchUserInfo();
        }
      }

      setIsEditing(false);
      message.success("Cập nhật thông tin thành công");
      return updateResponse;
    } catch (error) {
      console.error("Error updating profile:", error);
      message.error(error.response?.data?.message || error.message || "Cập nhật thông tin thất bại");
      throw error;
    }
  };

  const handleAddressClick = () => {
    navigate(userInfo.address ? "/edit-address" : "/add-address", { state: { returnUrl: "/account" } });
  };

  if (!userInfo) {
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