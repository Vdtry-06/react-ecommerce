import { useState, useEffect } from "react";
import { Card, Form } from "antd";
import ReviewsHeader from "../../../components/admin/review/ReviewHeader";
import ReviewsStats from "../../../components/admin/review/ReviewStats";
import ReviewsTable from "../../../components/admin/review/ReviewTable";
import ReviewEditModal from "../../../components/admin/review/ReviewEditModal";
import ReviewDeleteModal from "../../../components/admin/review/ReviewDeleteModal";
import ApiService from "../../../service/ApiService";
import { message } from "antd";

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [form] = Form.useForm();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await ApiService.Review.getAllReviews();
      const sortedReviews = (response.data || []).sort((a, b) => {
        if (a.visible !== b.visible) return b.visible ? -1 : 1;
        return new Date(b.reviewDate) - new Date(a.reviewDate);
      });
      setReviews(sortedReviews);
    } catch (error) {
      message.error("Không thể tải danh sách đánh giá");
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (reviewId) => {
    setReviewToDelete(reviewId);
    setIsDeleteModalVisible(true);
  };

  const handleDeleteOk = async () => {
    setLoading(true);
    try {
      await ApiService.Review.deleteReview(reviewToDelete);
      message.success("Đánh giá đã được xóa thành công");
      setReviews((prevReviews) =>
        prevReviews.filter((review) => review.id !== reviewToDelete)
      );
    } catch (error) {
      message.error("Không thể xóa đánh giá");
      console.error("Error deleting review:", error);
    } finally {
      setLoading(false);
      setIsDeleteModalVisible(false);
      setReviewToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalVisible(false);
    setReviewToDelete(null);
  };

  const handleToggleVisibility = async (reviewId, currentVisibility) => {
    try {
      setReviews((prevReviews) =>
        prevReviews.map((review) =>
          review.id === reviewId
            ? { ...review, visible: !currentVisibility }
            : review
        )
      );
      await ApiService.Review.toggleVisibility(reviewId);
      message.success(
        `Đánh giá đã được ${currentVisibility ? "ẩn" : "hiển thị"} thành công`
      );
    } catch (error) {
      message.error("Không thể thay đổi trạng thái hiển thị");
      console.error("Error toggling visibility:", error);
      fetchReviews();
    }
  };

  const handleEdit = (record) => {
    setEditingReview(record);
    form.setFieldsValue({
      ratingScore: record.ratingScore,
      comment: record.comment,
    });
  };

  const handleUpdate = async (values) => {
    try {
      setLoading(true);
      await ApiService.Review.adminUpdateReview(editingReview.id, {
        ratingScore: values.ratingScore,
        comment: values.comment,
      });
      message.success("Đánh giá đã được cập nhật thành công");
      setEditingReview(null);
      form.resetFields();
      fetchReviews();
    } catch (error) {
      message.error("Không thể cập nhật đánh giá");
      console.error("Error updating review:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingReview(null);
    form.resetFields();
  };

  return (
    <div style={{ padding: "24px" }}>
      <ReviewsHeader />
      <ReviewsStats reviews={reviews} />
      <Card
        style={{
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
          border: "1px solid #e2e8f0",
        }}
        bodyStyle={{ padding: 0 }}
      >
        <ReviewsTable
          reviews={reviews}
          loading={loading}
          onDelete={handleDelete}
          onEdit={handleEdit}
          onToggleVisibility={handleToggleVisibility}
        />
      </Card>
      <ReviewEditModal
        visible={!!editingReview}
        form={form}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
        loading={loading}
      />
      <ReviewDeleteModal
        visible={isDeleteModalVisible}
        onOk={handleDeleteOk}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
};

export default AdminReviewsPage;