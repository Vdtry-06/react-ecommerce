import { Card, Statistic } from "antd";
import { StarOutlined, EyeOutlined } from "@ant-design/icons";

const ReviewsStats = ({ reviews }) => {
  const visibleReviews = reviews.filter((r) => r.visible).length;
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.ratingScore, 0) / reviews.length
      : 0;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: "24px",
        marginBottom: "32px",
      }}
    >
      <Card
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          border: "none",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(59, 130, 246, 0.3)",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Statistic
          title={
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
              Tổng đánh giá
            </span>
          }
          value={reviews.length}
          valueStyle={{
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: "700",
          }}
          prefix={<StarOutlined style={{ color: "#ffffff" }} />}
        />
      </Card>

      <Card
        style={{
          background: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
          border: "none",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(16, 185, 129, 0.3)",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Statistic
          title={
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
              Đánh giá hiển thị
            </span>
          }
          value={visibleReviews}
          valueStyle={{
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: "700",
          }}
          prefix={<EyeOutlined style={{ color: "#ffffff" }} />}
        />
      </Card>

      <Card
        style={{
          background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
          border: "none",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(245, 158, 11, 0.3)",
        }}
        bodyStyle={{ padding: "24px" }}
      >
        <Statistic
          title={
            <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "16px" }}>
              Điểm trung bình
            </span>
          }
          value={averageRating.toFixed(1)}
          valueStyle={{
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: "700",
          }}
          suffix={
            <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "16px" }}>
              /5
            </span>
          }
        />
      </Card>
    </div>
  );
};

export default ReviewsStats;