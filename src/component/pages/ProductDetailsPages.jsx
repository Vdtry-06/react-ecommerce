import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import ApiService from "../../service/ApiService";
import {
  Row,
  Col,
  Typography,
  Rate,
  Button,
  Tabs,
  Tag,
  List,
  Space,
  Spin,
  message,
  Form,
  Input,
  Avatar,
  Popconfirm,
  Checkbox,
} from "antd";
import {
  CheckOutlined,
  UserOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import ProductList from "../common/ProductList";
import "../../static/style/productDetailsPages.css";

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { TextArea } = Input;

const ProductDetailsPages = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, syncCartWithBackend, isLoading } = useCart();
  const [product, setProduct] = useState(null);
  const [comments, setComments] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("description");
  const [selectedImage, setSelectedImage] = useState(0);
  const [hoveredImage, setHoveredImage] = useState(null);
  const [userRating, setUserRating] = useState(5);
  const [wishlist, setWishlist] = useState([]);
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [form] = Form.useForm();
  const [editingComment, setEditingComment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);
  const [hasCommented, setHasCommented] = useState(false);

  const fetchData = async () => {
    try {
      if (ApiService.isAuthenticated()) {
        const userInfo = await ApiService.User.getMyInfo();
        setUserId(userInfo.data.id);
      }
    } catch (error) {
      throw new Error("Không thể tải thông tin người dùng!");
    }
  };

  const fetchComments = async () => {
    try {
      const response = await ApiService.Review.getReviewsByProductId(productId);
      setComments(response.data || []);
      if (userId) {
        const userComment = response.data.find((comment) => comment.userId === userId);
        setHasCommented(!!userComment);
      }
    } catch (error) {
      message.error("Không thể tải bình luận!");
    }
  };

  const fetchAllProducts = async () => {
    try {
      const response = await ApiService.Product.getAllProduct();
      setAllProducts(response.data || []);
    } catch (error) {
      setError(error.response?.data?.message || error.message || "Lỗi khi tải sản phẩm!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const response = await ApiService.Product.getProduct(productId);
        setProduct(response.data);
        await fetchData();
        await fetchComments();
        await fetchAllProducts();

        const cartItem = cart.find((item) => item.id === parseInt(productId));
        if (cartItem) {
          setSelectedToppings(cartItem.toppingIds || []);
        }
      } catch (error) {
        throw new Error(error.response?.data?.message || error.message || "Không thể tải thông tin sản phẩm!");
      } finally {
        setLoading(false);
      }
    };

    loadData();

    if (location.search.includes("payment=success")) {
      fetchData();
    }

    window.addEventListener("cartChanged", fetchData);
    return () => {
      window.removeEventListener("cartChanged", fetchData);
    };
  }, [productId, location.search, cart]);

  useEffect(() => {
    if (userId) {
      const userComment = comments.find((comment) => comment.userId === userId);
      setHasCommented(!!userComment);
    }
  }, [userId, comments]);

  const calculateTotalPrice = () => {
    if (!product) return 0;
    let total = product.price;
    if (selectedToppings.length > 0) {
      const toppingPrices = product.toppings
        ?.filter((topping) => selectedToppings.includes(topping.id))
        ?.reduce((sum, topping) => sum + topping.price, 0) || 0;
      total += toppingPrices;
    }
    return total;
  };

  const handleToppingChange = async (toppingId) => {
    if (!product) return;
    try {
      setIsProcessing(true);
      if (!ApiService.isAuthenticated()) {
        const confirmLogin = window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng! Đến trang đăng nhập?");
        if (confirmLogin) navigate("/login");
        return;
      }

      const newToppings = selectedToppings.includes(toppingId)
        ? selectedToppings.filter((id) => id !== toppingId)
        : [...selectedToppings, toppingId];
      setSelectedToppings(newToppings);

      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;
      const cartItem = cart.find((item) => item.id === parseInt(productId));


      if (cartItem) {
        await syncCartWithBackend(userId, "UPDATE_ITEM", {
          id: parseInt(productId),
          qty: cartItem.qty,
          toppingIds: newToppings,
        });
        message.success("Topping đã được cập nhật!");
      } else if (newToppings.length > 0) {
        await syncCartWithBackend(userId, "ADD_ITEM", {
          id: parseInt(productId),
          qty: 1,
          toppingIds: newToppings,
        });
        message.success("Sản phẩm và topping đã được thêm vào giỏ hàng!");
      } else {
        await syncCartWithBackend(userId, "REMOVE_ITEM", { id: parseInt(productId) });
        message.info("Sản phẩm đã được xóa khỏi giỏ hàng!");
      }

      window.dispatchEvent(new Event("cartChanged"));
    } catch (error) {
      console.error("Error in handleToppingChange:", error);
      message.error(error.response?.data?.message || "Lỗi khi cập nhật toppings!");
      setSelectedToppings(selectedToppings);
    } finally {
      setIsProcessing(false);
    }
  };

  const addToCart = async () => {
    if (!product) return;
    try {
      setIsProcessing(true);
      if (!ApiService.isAuthenticated()) {
        const confirmLogin = window.confirm("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng! Đến trang đăng nhập?");
        if (confirmLogin) navigate("/login");
        return;
      }

      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;
      const cartItem = cart.find((item) => item.id === parseInt(productId));

      if (cartItem) {
        await syncCartWithBackend(userId, "INCREMENT_ITEM", {
          id: parseInt(productId),
          qty: cartItem.qty,
          toppingIds: selectedToppings,
        });
        message.success("Số lượng sản phẩm đã được tăng!");
      } else {
        await syncCartWithBackend(userId, "ADD_ITEM", {
          id: parseInt(productId),
          qty: 1,
          toppingIds: selectedToppings,
        });
        message.success("Sản phẩm đã được thêm vào giỏ hàng!");
      }

      window.dispatchEvent(new Event("cartChanged"));
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng!");
    } finally {
      setIsProcessing(false);
    }
  };

  const buyNow = async () => {
    try {
      setIsProcessing(true);
      await addToCart();
      const userInfo = await ApiService.User.getMyInfo();
      await ApiService.Cart.toggleSelectItem(userInfo.data.id, {
        productId: parseInt(productId),
        selected: true,
      });
      message.success("Sản phẩm đã được chọn để mua ngay!");
      window.dispatchEvent(new Event("cartChanged"));
      navigate("/cart");
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi mua hàng!");
    } finally {
      setIsProcessing(false);
    }
  };

  const updateQuantity = async (increment) => {
    if (!product) return;
    try {
      setIsProcessing(true);
      const userInfo = await ApiService.User.getMyInfo();
      const userId = userInfo.data.id;
      const cartItem = cart.find((item) => item.id === parseInt(productId));
      if (!cartItem) return;

      const newQuantity = cartItem.qty + (increment ? 1 : -1);
      if (newQuantity > 0) {
        await syncCartWithBackend(userId, "UPDATE_ITEM", {
          id: parseInt(productId),
          qty: newQuantity,
          toppingIds: selectedToppings,
        });
        message.success(increment ? "Số lượng đã được tăng!" : "Số lượng đã được giảm!");
      } else {
        await syncCartWithBackend(userId, "REMOVE_ITEM", { id: parseInt(productId) });
        setSelectedToppings([]);
        message.info("Sản phẩm đã được xóa khỏi giỏ hàng!");
      }

      window.dispatchEvent(new Event("cartChanged"));
    } catch (error) {
      message.error(increment ? "Lỗi khi tăng số lượng!" : "Lỗi khi giảm số lượng!");
      fetchData();
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      setWishlist(wishlist.filter((id) => id !== productId));
    } else {
      setWishlist([...wishlist, productId]);
    }
  };

  const handleReviewSubmit = async (values) => {
    try {
      setIsProcessing(true);
      const userInfo = await ApiService.User.getMyInfo();
      const request = {
        productId: parseInt(productId),
        userId: userInfo.data.id,
        ratingScore: values.rating,
        comment: values.comment,
      };
      const response = await ApiService.Review.addReview(request);
      message.success("Bình luận đã được gửi thành công!");
      form.resetFields();
      setComments((prevComments) => [...prevComments, { ...response.data, visible: true }]);
      setHasCommented(true);
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể gửi bình luận!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUpdateComment = async (commentId, values) => {
    try {
      setIsProcessing(true);
      const request = {
        ratingScore: values.rating,
        comment: values.comment,
      };
      const response = await ApiService.Review.updateReview(commentId, request);
      message.success("Bình luận đã được cập nhật thành công!");
      setComments((prevComments) =>
        prevComments.map((c) => (c.id === commentId ? { ...response.data, visible: true } : c))
      );
      setEditingComment(null);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể cập nhật bình luận!");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setIsProcessing(true);
      await ApiService.Review.deleteReview(commentId);
      message.success("Bình luận đã được xóa thành công!");
      setComments((prevComments) => prevComments.filter((c) => c.id !== commentId));
      setHasCommented(false);
      setEditingComment(null);
      form.resetFields();
    } catch (error) {
      message.error(error.response?.data?.message || "Không thể xóa bình luận!");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <Spin size="large" tip="Đang tải thông tin sản phẩm..." />
      </div>
    );
  }

  if (!product) {
    return <div className="error-container">Không tìm thấy sản phẩm</div>;
  }

  const cartItem = cart.find((item) => item.id === parseInt(productId));

  const displayProduct = {
    ...product,
    name: product.name,
    price: calculateTotalPrice(),
    originalPrice: product.originalPrice || product.price * 1.05,
    discount: product.discount || 5,
    description: product.description || "Không có mô tả",
    sku: product.id,
    categories: product.categories?.map((cat) => cat.name).join(", ") || "Không có danh mục",
    categoriesDescription: product.categories?.map((cat) => cat.description).join(", ") || "Không có mô tả danh mục",
    toppings: product.toppings?.map((top) => top.name).join(", ") || "Không có toppings",
    toppingsPrice: product.toppings?.map((top) => top.price).join(", ") || "",
  };

  return (
    <div>
      <div className="product-details-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="product-detail-top">
          <div className="product-detail-layout" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div className="product-images-container" style={{ flex: "1", minWidth: "300px" }}>
              <div className="main-image-container" style={{ position: "relative", marginBottom: "20px" }}></div>
              <div className="main-image" style={{ position: "relative", marginBottom: "10px" }}>
                <img
                  src={
                    hoveredImage !== null && product.imageUrls?.[hoveredImage]
                      ? product.imageUrls[hoveredImage]
                      : product.imageUrls?.[selectedImage] || "/placeholder.svg?height=300&width=300"
                  }
                  alt={displayProduct.name}
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
                {displayProduct.discount > 0 && (
                  <div
                    style={{
                      position: "absolute",
                      top: "10px",
                      left: "10px",
                      background: "#f50",
                      color: "white",
                      padding: "5px 10px",
                      borderRadius: "4px",
                    }}
                  >
                    -{displayProduct.discount}%
                  </div>
                )}
              </div>
              <div className="thumbnails" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {product.imageUrls?.map((url, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                    onMouseEnter={() => setHoveredImage(index)}
                    onMouseLeave={() => setHoveredImage(null)}
                    style={{
                      width: "60px",
                      height: "60px",
                      border: `2px solid ${selectedImage === index ? "#1890ff" : "#ddd"}`,
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={url || "/placeholder.svg?height=60&width=60"}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "4px" }}
                    />
                  </div>
                )) || (
                  <div className="thumbnail">
                    <img src="/placeholder.svg?height=60&width=60" alt="No thumbnail" style={{ width: "60px", height: "60px" }} />
                  </div>
                )}
              </div>
            </div>

            <div className="product-info" style={{ flex: "1", minWidth: "300px" }}>
              <Rate disabled value={5} style={{ color: "#FFD700", fontSize: 16, marginBottom: "16px" }} />

              <Title level={2} style={{ margin: "0 0 16px", fontWeight: "600", color: "#333" }}>
                {displayProduct.name}
              </Title>

              <Paragraph style={{ marginBottom: "24px", color: "#666", lineHeight: "1.6" }}>
                {displayProduct.description}
              </Paragraph>

              <div className="price" style={{ marginBottom: "20px" }}>
                <Tag color="#f50" style={{ marginRight: "8px", fontSize: "14px" }}>
                  -{displayProduct.discount}%
                </Tag>
                <span style={{ fontSize: "24px", fontWeight: "700", color: "#f50" }}>
                  {displayProduct.price.toFixed(2)} VNĐ
                </span>
                {displayProduct.originalPrice > 0 && (
                  <span style={{ fontSize: "16px", color: "#999", textDecoration: "line-through", marginLeft: "10px" }}>
                    {displayProduct.originalPrice.toFixed(2)} VNĐ
                  </span>
                )}
              </div>

              <div className="toppings-list">
                <h3 className="toppings-title">Chọn Toppings:</h3>
                {product.toppings?.length > 0 ? (
                  <ul className="topping-items">
                    {product.toppings
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((topping) => (
                        <li key={topping.id} className="topping-item">
                          <label className="topping-label">
                            <Checkbox
                              checked={selectedToppings.includes(topping.id)}
                              onChange={() => handleToppingChange(topping.id)}
                              disabled={isProcessing || isLoading}
                            />
                            <span className="topping-name">{topping.name}</span>
                            <span className="topping-price">+{topping.price.toFixed(2)} VNĐ</span>
                          </label>
                        </li>
                      ))}
                  </ul>
                ) : (
                  <p className="no-toppings">Không có topping nào.</p>
                )}
              </div>

              {cartItem ? (
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                  <Button
                    onClick={() => updateQuantity(false)}
                    disabled={isProcessing || isLoading}
                    style={{ background: "#ff5722", color: "#fff", border: "none", borderRadius: "4px" }}
                  >
                    <span style={{ fontSize: "20px" }}>−</span>
                  </Button>
                  <span style={{ fontSize: "16px", minWidth: "30px", textAlign: "center" }}>
                    {isProcessing || isLoading ? "..." : cartItem.qty}
                  </span>
                  <Button
                    onClick={() => updateQuantity(true)}
                    disabled={isProcessing || isLoading}
                    style={{ background: "#ff5722", color: "#fff", border: "none", borderRadius: "4px" }}
                  >
                    <span style={{ fontSize: "20px" }}>+</span>
                  </Button>
                </div>
              ) : (
                <div style={{ display: "flex", gap: "10px" }}>
                  <Button
                    type="primary"
                    size="large"
                    onClick={addToCart}
                    disabled={isProcessing || isLoading || product.availableQuantity <= 0}
                    style={{ background: "#007bff", borderColor: "#007bff", borderRadius: "4px" }}
                  >
                    {isProcessing || isLoading ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
                  </Button>
                  <Button
                    type="primary"
                    size="large"
                    onClick={buyNow}
                    disabled={isProcessing || isLoading || product.availableQuantity <= 0}
                    style={{ background: "#ff4500", borderColor: "#ff4500", borderRadius: "4px" }}
                  >
                    {isProcessing || isLoading ? "Đang xử lý..." : "Mua ngay"}
                  </Button>
                </div>
              )}

              <div className="meta" style={{ marginTop: "20px" }}>
                <div style={{ marginBottom: "8px" }}>
                  <Text strong style={{ color: "#333" }}>Danh mục:</Text>
                  <span style={{ marginLeft: "8px", color: "#666" }}>{displayProduct.categories}</span>
                </div>
                <div style={{ marginBottom: "8px" }}>
                  <Text strong style={{ color: "#333" }}>Mô tả:</Text>
                  <span style={{ marginLeft: "8px", color: "#666" }}>{displayProduct.categoriesDescription}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ marginTop: "40px" }}>
          <Tabs activeKey={activeTab} onChange={setActiveTab} type="card">
            <TabPane tab="MÔ TẢ" key="description">
              <Title level={4}>TRẢI NGHIỆM ẨM THỰC ĐỈNH CAO</Title>
              <Paragraph>{displayProduct.description}</Paragraph>
            </TabPane>
            <TabPane tab={`BÌNH LUẬN (${comments.length})`} key="comment">
              <div className="comments">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div key={comment.id} style={{ display: "flex", gap: "15px", padding: "15px 0", borderBottom: "1px solid #eee" }}>
                      <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#007bff" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ fontSize: "16px", color: "#333" }}>{`Người dùng ${comment.userId}`}</strong>
                          <span style={{ color: "#999", fontSize: "12px" }}>
                            {new Date(comment.reviewDate).toLocaleString()}
                          </span>
                        </div>
                        <Rate disabled value={comment.ratingScore} style={{ margin: "5px 0" }} />
                        <p style={{ color: "#666", lineHeight: "1.5" }}>{comment.comment}</p>
                        {userId === comment.userId && !editingComment && (
                          <Space>
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => {
                                setEditingComment(comment);
                                form.setFieldsValue({
                                  rating: comment.ratingScore,
                                  comment: comment.comment,
                                });
                                setActiveTab("edit-comment");
                              }}
                            >
                              Sửa
                            </Button>
                            <Popconfirm
                              title="Bạn có chắc muốn xóa bình luận này?"
                              onConfirm={() => handleDeleteComment(comment.id)}
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button icon={<DeleteOutlined />} danger>
                                Xóa
                              </Button>
                            </Popconfirm>
                          </Space>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <p style={{ color: "#999", fontStyle: "italic" }}>Chưa có bình luận nào.</p>
                )}
              </div>
            </TabPane>
            {!hasCommented && (
              <TabPane tab="ĐĂNG BÌNH LUẬN" key="post-comment">
                <div style={{ maxWidth: "600px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <strong style={{ color: "#333" }}>Đánh giá:</strong>
                    <Rate value={userRating} onChange={setUserRating} style={{ marginLeft: "8px" }} />
                  </div>
                  <Form form={form} onFinish={handleReviewSubmit} layout="vertical">
                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
                      Chia sẻ ý kiến của bạn:
                    </h3>
                    <Form.Item
                      name="rating"
                      label="Đánh giá"
                      rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
                    >
                      <Rate onChange={setUserRating} value={userRating} />
                    </Form.Item>
                    <Form.Item
                      name="comment"
                      label="Bình luận"
                      rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
                    >
                      <TextArea rows={6} placeholder="Viết bình luận..." />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isProcessing}
                        style={{ background: "#007bff", borderColor: "#007bff" }}
                      >
                        {isProcessing ? "Đang xử lý..." : "Gửi bình luận"}
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </TabPane>
            )}
            {editingComment && (
              <TabPane tab="SỬA BÌNH LUẬN" key="edit-comment">
                <div style={{ maxWidth: "600px" }}>
                  <div style={{ marginBottom: "16px" }}>
                    <strong style={{ color: "#333" }}>Đánh giá:</strong>
                    <Rate value={userRating} onChange={setUserRating} style={{ marginLeft: "8px" }} />
                  </div>
                  <Form
                    form={form}
                    onFinish={(values) => handleUpdateComment(editingComment.id, values)}
                    layout="vertical"
                  >
                    <h3 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px" }}>
                      Sửa bình luận:
                    </h3>
                    <Form.Item
                      name="rating"
                      label="Đánh giá"
                      rules={[{ required: true, message: "Vui lòng chọn số sao!" }]}
                    >
                      <Rate onChange={setUserRating} value={userRating} />
                    </Form.Item>
                    <Form.Item
                      name="comment"
                      label="Bình luận"
                      rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
                    >
                      <TextArea rows={6} placeholder="Viết bình luận..." />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isProcessing}
                        style={{ background: "#007bff", borderColor: "#007bff" }}
                      >
                        {isProcessing ? "Đang xử lý..." : "Cập nhật bình luận"}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingComment(null);
                          form.resetFields();
                          setActiveTab("comment");
                        }}
                        style={{ marginLeft: "10px" }}
                      >
                        Hủy
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </TabPane>
            )}
          </Tabs>
        </div>

        <div style={{ marginTop: "40px" }}>
          <Title level={3}>THÔNG TIN CHI TIẾT</Title>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={12}>
              <List
                itemLayout="horizontal"
                dataSource={product.categories || []}
                renderItem={(category) => (
                  <List.Item>
                    <Space>
                      <CheckOutlined style={{ color: "#006241" }} />
                      <strong>{category.name}</strong>
                    </Space>
                  </List.Item>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <List
                itemLayout="horizontal"
                dataSource={product.categories || []}
                renderItem={(category) => (
                  <List.Item>
                    <Space>
                      <CheckOutlined style={{ color: "#006241" }} />
                      <span>{category.description || "N/A"}</span>
                    </Space>
                  </List.Item>
                )}
              />
            </Col>
          </Row>
        </div>

        <div style={{ marginTop: "40px" }}>
          <Title level={2}>SẢN PHẨM LIÊN QUAN</Title>
          <div>
            {loading ? (
              <Text>Đang tải...</Text>
            ) : error ? (
              <Text type="error">{error}</Text>
            ) : allProducts.length === 0 ? (
              <Text>Không có sản phẩm nào.</Text>
            ) : (
              <ProductList products={allProducts.slice(0, 4)} gap="16px" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPages;