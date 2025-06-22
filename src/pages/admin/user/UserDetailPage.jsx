import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Spin, Button, Typography } from "antd";
import { ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import UserInfoCard from "../../../components/admin/user/UserInfoCard";
import UserAddressCard from "../../../components/admin/user/UserAddressCard";
import UserOrdersCard from "../../../components/admin/user/UserOrdersCard";
import ApiService from "../../../service/ApiService";
import { message } from "antd";

const { Title } = Typography;

const UserDetailPage = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserInfo(userId);
  }, [userId]);

  const fetchUserInfo = async (id) => {
    setLoading(true);
    try {
      const response = await ApiService.User.getUserInfoById(id);
      setUser(response.data);
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể tải thông tin người dùng");
      console.error("Error fetching user info:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user && !loading) {
    return (
      <div style={{ padding: "24px", textAlign: "center" }}>
        <p style={{ color: "#64748b", fontSize: "16px" }}>Không thể tải thông tin người dùng.</p>
        <Button type="primary" onClick={() => navigate("/admin/users")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "32px",
          gap: "16px",
        }}
      >
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/admin/users")}
          style={{
            borderRadius: "8px",
            height: "40px",
            display: "flex",
            alignItems: "center",
          }}
        >
          Quay lại
        </Button>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div
            style={{
              background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
              borderRadius: "12px",
              padding: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <UserOutlined style={{ color: "white", fontSize: "20px" }} />
          </div>
          <Title
            level={2}
            style={{
              margin: 0,
              background: "linear-gradient(135deg, #1e3c72, #2a5298)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Chi tiết người dùng: {user?.username || "Đang tải..."}
          </Title>
        </div>
      </div>

      <Spin spinning={loading}>
        {user && (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <UserInfoCard user={user} />
            <UserAddressCard address={user.address} />
            <UserOrdersCard orders={user.orders || []} />
          </div>
        )}
      </Spin>
    </div>
  );
};

export default UserDetailPage;