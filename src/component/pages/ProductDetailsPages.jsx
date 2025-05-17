import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  Divider,
  Popconfirm,
  Checkbox,
} from "antd";
import {
  CheckOutlined,
  HeartOutlined,
  HeartFilled,
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
  const [product, setProduct] = useState(null);
  const [cart, setCart] = useState([]);
  const [comments, setComments] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
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
        const ordersResponse = await ApiService.Order.getAllOrdersOfUser(userInfo.data.id);
        const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING");

        if (pendingOrder?.orderLines) {
          setCart(
            pendingOrder.orderLines.map((line) => ({
              id: line.productId,
              qty: line.quantity,
              orderLineId: line.id,
              toppingIds: line.selectedToppings?.map((topping) => topping.id) || [],
            }))
          );
          // Initialize selectedToppings from cart
          const cartItem = pendingOrder.orderLines.find((line) => line.productId === parseInt(productId));
          if (cartItem) {
            setSelectedToppings(cartItem.selectedToppings?.map((topping) => topping.id) || []);
          }
        }
      }
    } catch (error) {
      console.log(error.message || error);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await ApiService.Review.getReviewsByProductId(productId);
      setComments(response.data || []);
      // Check if the current user has commented
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
      setIsLoading(true);
      try {
        const response = await ApiService.Product.getProduct(productId);
        setProduct(response.data);
        await fetchData();
        await fetchComments();
        await fetchAllProducts();
      } catch (error) {
        console.log(error.message || error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [productId]);

  // Recheck hasCommented when userId or comments change
  useEffect(() => {
    if (userId) {
      const userComment = comments.find((comment) => comment.userId === userId);
      setHasCommented(!!userComment);
    }
  }, [userId, comments]);

  // Calculate total price including selected toppings
  const calculateTotalPrice = () => {
    if (!product) return 0;
    let total = product.price;
    if (selectedToppings.length > 0) {
      const toppingPrices = product.toppings
        .filter((topping) => selectedToppings.includes(topping.id))
        .reduce((sum, topping) => sum + topping.price, 0);
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
      const ordersResponse = await ApiService.Order.getAllOrdersOfUser(userInfo.data.id);
      const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING");
      const orderLineRequest = {
        productId: product.id,
        quantity: 1,
        toppingIds: newToppings,
      };

      if (!pendingOrder) {
        if (newToppings.length > 0) {
          const result = await ApiService.Order.createOrder({
            userId: userInfo.data.id,
            orderLines: [orderLineRequest],
            paymentMethod: "CASH_ON_DELIVERY",
          });
          setCart([
            {
              id: product.id,
              qty: 1,
              orderLineId: result.data.orderLines[0].id,
              toppingIds: newToppings,
            },
          ]);
        }
      } else {
        const existingLine = pendingOrder.orderLines.find((line) => line.productId === product.id);
        if (existingLine) {
          if (newToppings.length > 0) {
            await ApiService.Order.updateOrderLine(pendingOrder.id, existingLine.id, {
              productId: product.id,
              quantity: existingLine.quantity,
              toppingIds: newToppings,
            });
            setCart((prevCart) => {
              const updatedCart = [...prevCart];
              const itemIndex = updatedCart.findIndex((item) => item.id === product.id);
              if (itemIndex >= 0) {
                updatedCart[itemIndex] = {
                  ...updatedCart[itemIndex],
                  toppingIds: newToppings,
                };
              }
              return updatedCart;
            });
          } else {
            await ApiService.Order.deleteOrderLine(pendingOrder.id, existingLine.id);
            setCart((prevCart) => prevCart.filter((item) => item.id !== product.id));
          }
        } else if (newToppings.length > 0) {
          const result = await ApiService.Order.addOrderLine(pendingOrder.id, orderLineRequest);
          setCart((prevCart) => [
            ...prevCart,
            {
              id: product.id,
              qty: 1,
              orderLineId: result.data.id,
              toppingIds: newToppings,
            },
          ]);
        }
      }
    } catch (error) {
      message.error(error.response?.data?.message || "Lỗi khi cập nhật toppings!");
      // Revert topping change on error
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
      const ordersResponse = await ApiService.Order.getAllOrdersOfUser(userInfo.data.id);
      const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING");
      const orderLineRequest = {
        productId: product.id,
        quantity: 1,
        toppingIds: selectedToppings,
      };

      if (!pendingOrder) {
        const result = await ApiService.Order.createOrder({
          userId: userInfo.data.id,
          orderLines: [orderLineRequest],
          paymentMethod: "CASH_ON_DELIVERY",
        });
        setCart([
          {
            id: product.id,
            qty: 1,
            orderLineId: result.data.orderLines[0].id,
            toppingIds: selectedToppings,
          },
        ]);
      } else {
        const existingLine = pendingOrder.orderLines.find((line) => line.productId === product.id);
        if (existingLine) {
          const newQuantity = existingLine.quantity + 1;
          await ApiService.Order.updateOrderLine(pendingOrder.id, existingLine.id, {
            productId: product.id,
            quantity: newQuantity,
            toppingIds: selectedToppings,
          });
          setCart((prevCart) => {
            const updatedCart = [...prevCart];
            const itemIndex = updatedCart.findIndex((item) => item.id === product.id);
            if (itemIndex >= 0) {
              updatedCart[itemIndex] = {
                ...updatedCart[itemIndex],
                qty: newQuantity,
                toppingIds: selectedToppings,
              };
            }
            return updatedCart;
          });
        } else {
          const result = await ApiService.Order.addOrderLine(pendingOrder.id, orderLineRequest);
          setCart((prevCart) => [
            ...prevCart,
            {
              id: product.id,
              qty: 1,
              orderLineId: result.data.id,
              toppingIds: selectedToppings,
            },
          ]);
        }
      }
      message.success("Sản phẩm đã được thêm vào giỏ hàng!");
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
      const ordersResponse = await ApiService.Order.getAllOrdersOfUser(userInfo.data.id);
      const pendingOrder = ordersResponse.data?.find((order) => order.status === "PENDING");
      if (!pendingOrder) return;
      const orderLine = pendingOrder.orderLines.find((line) => line.productId === product.id);
      if (!orderLine) return;
      const newQuantity = orderLine.quantity + (increment ? 1 : -1);
      setCart((prevCart) => {
        const updatedCart = [...prevCart];
        const itemIndex = updatedCart.findIndex((item) => item.id === product.id);
        if (itemIndex >= 0) {
          if (newQuantity > 0) {
            updatedCart[itemIndex] = {
              ...updatedCart[itemIndex],
              qty: newQuantity,
            };
          } else {
            updatedCart.splice(itemIndex, 1);
          }
        }
        return updatedCart;
      });
      if (newQuantity > 0) {
        await ApiService.Order.updateOrderLine(pendingOrder.id, orderLine.id, {
          productId: product.id,
          quantity: newQuantity,
          toppingIds: selectedToppings,
        });
      } else {
        await ApiService.Order.deleteOrderLine(pendingOrder.id, orderLine.id);
      }
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
        productId: product.id,
        userId: userInfo.data.id,
        ratingScore: values.rating,
        comment: values.comment,
      };
      const response = await ApiService.Review.addReview(request);
      message.success("Bình luận đã được gửi thành công!");
      form.resetFields();
      setComments((prevComments) => [...prevComments, { ...response.data, visible: true }]);
      setHasCommented(true); // Hide post comment tab
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
      setHasCommented(false); // Show post comment tab again
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

  const cartItem = cart.find((item) => item.id === product.id);

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
    toppingsPrice: product.toppings?.map((top) => top.price).join(", ") || "Không có giá toppings",
  };

  return (
    <div className="product-details-container" style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      <div className="product-detail-top">
        <div className="product-detail-layout" style={{ display: "flex", gap: "30px", flexWrap: "wrap" }}>
          <div className="product-images-container" style={{ flex: "1", minWidth: "300px" }}>
            <div className="main-image-container" style={{ position: "relative", marginBottom: "10px" }}>
              <img
                src={
                  hoveredImage !== null && product.imageUrls && product.imageUrls[hoveredImage]
                    ? product.imageUrls[hoveredImage]
                    : product.imageUrls && product.imageUrls[selectedImage]
                    ? product.imageUrls[selectedImage]
                    : "/placeholder.svg?height=300&width=300"
                }
                alt={displayProduct.name}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
              />
              {displayProduct.discount > 0 && (
                <div
                  className="discount-badge"
                  style={{
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "#f50",
                    color: "white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                  }}
                >
                  -{displayProduct.discount}%
                </div>
              )}
            </div>
            <div className="thumbnails-container" style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
              {product.imageUrls && product.imageUrls.length > 0 ? (
                product.imageUrls.map((url, index) => (
                  <div
                    key={index}
                    className={`thumbnail-image ${selectedImage === index ? "active" : ""}`}
                    onClick={() => setSelectedImage(index)}
                    onMouseEnter={() => setHoveredImage(index)}
                    onMouseLeave={() => setHoveredImage(null)}
                    style={{
                      width: "60px",
                      height: "60px",
                      border: selectedImage === index ? "2px solid #1890ff" : "1px solid #ddd",
                      borderRadius: "5px",
                      cursor: "pointer",
                    }}
                  >
                    <img
                      src={url || "/placeholder.svg"}
                      alt={`Hình ảnh sản phẩm ${index + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "5px" }}
                    />
                  </div>
                ))
              ) : (
                <div className="thumbnail-image">
                  <img src="/placeholder.svg?height=60&width=60" alt="Không có hình ảnh" style={{ width: "60px", height: "60px" }} />
                </div>
              )}
            </div>
          </div>

          <div className="product-info" style={{ flex: "1", minWidth: "300px" }}>
            <Rate disabled defaultValue={5} style={{ color: "#FFD700", fontSize: 16, marginBottom: 16 }} />

            <Title level={2} style={{ margin: "0 0 16px 0", fontWeight: "bold", color: "#333" }}>
              {displayProduct.name}
            </Title>

            <Paragraph style={{ marginBottom: 24, color: "#666", lineHeight: 1.6 }}>
              {displayProduct.description}
            </Paragraph>

            <div className="product-price" style={{ marginBottom: 20 }}>
              <Tag color="#f50" style={{ marginRight: 8, fontSize: 14 }}>
                -{displayProduct.discount}%
              </Tag>
              <span className="current-price" style={{ fontSize: 24, fontWeight: "bold", color: "#f50" }}>
                {displayProduct.price?.toFixed(2)} VNĐ
              </span>
              {displayProduct.originalPrice && (
                <span className="original-price" style={{ fontSize: 16, color: "#999", textDecoration: "line-through", marginLeft: 10 }}>
                  {displayProduct.originalPrice.toFixed(2)} VNĐ
                </span>
              )}
            </div>

            <div className="toppings-container" style={{ marginBottom: 20 }}>
              <Text strong style={{ display: "block", marginBottom: 10 }}>Chọn Toppings:</Text>
              {product.toppings && product.toppings.length > 0 ? (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(3, 1fr)",
                    gap: 10,
                  }}
                >
                  {product.toppings.map((topping) => (
                    <Checkbox
                      key={topping.id}
                      checked={selectedToppings.includes(topping.id)}
                      onChange={() => handleToppingChange(topping.id)}
                      disabled={isProcessing}
                    >
                      {topping.name} (+{topping.price.toFixed(2)} VNĐ)
                    </Checkbox>
                  ))}
                </div>
              ) : (
                <Text type="secondary">Không có toppings nào.</Text>
              )}
            </div>


            {cartItem && cartItem.qty > 0 ? (
              <div
                className="quantity-controls"
                style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}
              >
                <Button
                  onClick={() => updateQuantity(false)}
                  disabled={isProcessing}
                  style={{ background: "#ff5722", color: "#fff", border: "none", borderRadius: "5px" }}
                >
                  <span style={{ color: "#fff", fontSize: 20 }}>−</span>
                </Button>
                <span style={{ fontSize: 16, minWidth: 30, textAlign: "center" }}>
                  {isProcessing ? "..." : cartItem.qty}
                </span>
                <Button
                  onClick={() => updateQuantity(true)}
                  disabled={isProcessing}
                  style={{ background: "#ff5722", color: "#fff", border: "none", borderRadius: "5px" }}
                >
                  <span style={{ color: "#fff", fontSize: 20 }}>+</span>
                </Button>
              </div>
            ) : (
              <div style={{ display: "flex", gap: 10 }}>
                <Button
                  type="primary"
                  size="large"
                  onClick={addToCart}
                  disabled={isProcessing || product.availableQuantity <= 0}
                  style={{ background: "#1890ff", borderColor: "#1890ff" }}
                >
                  {isProcessing ? "Đang xử lý..." : "Thêm vào giỏ hàng"}
                </Button>
                <Button
                  type="primary"
                  size="large"
                  onClick={buyNow}
                  disabled={isProcessing || product.availableQuantity <= 0}
                  style={{ background: "#ff4d4f", borderColor: "#ff4d4f" }}
                >
                  {isProcessing ? "Đang xử lý..." : "Mua ngay"}
                </Button>
              </div>
            )}

            <div className="product-meta" style={{ marginTop: 20 }}>
              <div className="meta-item" style={{ marginBottom: 8 }}>
                <Text strong style={{ color: "#333" }}>Danh mục:</Text>
                <Text style={{ marginLeft: 8, color: "#666" }}>{displayProduct.categories}</Text>
              </div>
              <div className="meta-item" style={{ marginBottom: 8 }}>
                <Text strong style={{ color: "#333" }}>Mô tả danh mục:</Text>
                <Text style={{ marginLeft: 8, color: "#666" }}>{displayProduct.categoriesDescription}</Text>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="product-detail-content" style={{ marginTop: 40 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} type="card" className="product-tabs">
          <TabPane tab="MÔ TẢ" key="description">
            <div className="tab-content">
              <Title level={3} style={{ fontWeight: "bold", marginBottom: 24, color: "#333" }}>
                TRẢI NGHIỆM ẨM THỰC ĐỈNH CAO
              </Title>
              <Paragraph style={{ color: "#666", lineHeight: 1.6 }}>
                {displayProduct.description}
              </Paragraph>
            </div>
          </TabPane>
          <TabPane tab={`BÌNH LUẬN (${comments.length})`} key="comment">
            <div className="tab-content">
              <div className="comments-section">
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="comment-item" style={{ display: "flex", gap: 15, padding: "15px 0", borderBottom: "1px solid #eee" }}>
                      <Avatar icon={<UserOutlined />} style={{ backgroundColor: "#1890ff" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <h3 className="comment-author" style={{ margin: 0, fontSize: 16, color: "#333" }}>
                            {`Người dùng ${comment.userId}`}
                          </h3>
                          <div className="comment-date" style={{ color: "#999", fontSize: 12 }}>
                            {new Date(comment.reviewDate).toLocaleString()}
                          </div>
                        </div>
                        <Rate disabled value={comment.ratingScore} style={{ margin: "5px 0" }} />
                        <p className="comment-content" style={{ margin: 0, color: "#666", lineHeight: 1.5 }}>
                          {comment.comment}
                        </p>
                        {userId === comment.userId && !editingComment && (
                          <Space style={{ marginTop: 10 }}>
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
                              style={{ borderRadius: "5px" }}
                            >
                              Sửa
                            </Button>
                            <Popconfirm
                              title="Bạn có chắc muốn xóa bình luận này?"
                              onConfirm={() => handleDeleteComment(comment.id)}
                              okText="Có"
                              cancelText="Không"
                            >
                              <Button
                                icon={<DeleteOutlined />}
                                danger
                                style={{ borderRadius: "5px" }}
                              >
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
            </div>
          </TabPane>
          {!hasCommented && (
            <TabPane tab="ĐĂNG BÌNH LUẬN" key="post-comment">
              <div className="tab-content">
                <div className="post-comment-section" style={{ maxWidth: "600px" }}>
                  <div className="rating-section" style={{ marginBottom: 20 }}>
                    <div className="rating-label" style={{ fontWeight: "bold", color: "#333" }}>
                      Đánh giá:
                    </div>
                    <Rate value={userRating} onChange={setUserRating} style={{ marginTop: 5 }} />
                  </div>

                  <Form form={form} onFinish={handleReviewSubmit} layout="vertical" className="comment-form">
                    <h3 className="form-title" style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20, color: "#333" }}>
                      Chia sẻ ý kiến của bạn về sản phẩm này:
                    </h3>

                    <Form.Item
                      name="rating"
                      label="Đánh giá"
                      rules={[{ required: true, message: "Vui lòng chọn số sao đánh giá!" }]}
                    >
                      <Rate onChange={setUserRating} value={userRating} />
                    </Form.Item>

                    <Form.Item
                      name="comment"
                      label="Bình luận"
                      rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
                    >
                      <TextArea rows={6} placeholder="Viết bình luận của bạn..." style={{ borderRadius: "5px" }} />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isProcessing}
                        style={{ background: "#1890ff", borderColor: "#1890ff", borderRadius: "5px" }}
                      >
                        {isProcessing ? "Đang xử lý..." : "Gửi bình luận"}
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </TabPane>
          )}
          {editingComment && (
            <TabPane tab="SỬA BÌNH LUẬN" key="edit-comment">
              <div className="tab-content">
                <div className="post-comment-section" style={{ maxWidth: "600px" }}>
                  <div className="rating-section" style={{ marginBottom: 20 }}>
                    <div className="rating-label" style={{ fontWeight: "bold", color: "#333" }}>
                      Đánh giá:
                    </div>
                    <Rate value={userRating} onChange={setUserRating} style={{ marginTop: 5 }} />
                  </div>

                  <Form
                    form={form}
                    onFinish={() => handleUpdateComment(editingComment.id, form.getFieldsValue())}
                    layout="vertical"
                    className="comment-form"
                  >
                    <h3 className="form-title" style={{ fontSize: 18, fontWeight: "bold", marginBottom: 20, color: "#333" }}>
                      Sửa bình luận của bạn:
                    </h3>

                    <Form.Item
                      name="rating"
                      label="Đánh giá"
                      rules={[{ required: true, message: "Vui lòng chọn số sao đánh giá!" }]}
                    >
                      <Rate onChange={setUserRating} value={userRating} />
                    </Form.Item>

                    <Form.Item
                      name="comment"
                      label="Bình luận"
                      rules={[{ required: true, message: "Vui lòng nhập bình luận!" }]}
                    >
                      <TextArea rows={6} placeholder="Viết bình luận của bạn..." style={{ borderRadius: "5px" }} />
                    </Form.Item>

                    <Form.Item>
                      <Button
                        type="primary"
                        htmlType="submit"
                        loading={isProcessing}
                        style={{ background: "#1890ff", borderColor: "#1890ff", borderRadius: "5px" }}
                      >
                        {isProcessing ? "Đang xử lý..." : "Cập nhật bình luận"}
                      </Button>
                      <Button
                        onClick={() => {
                          setEditingComment(null);
                          form.resetFields();
                          setActiveTab("comment");
                        }}
                        style={{ marginLeft: 10, borderRadius: "5px" }}
                      >
                        Hủy
                      </Button>
                    </Form.Item>
                  </Form>
                </div>
              </div>
            </TabPane>
          )}
        </Tabs>
      </div>

      <div className="product-detail-content" style={{ marginTop: 30 }}>
        <Title level={3} style={{ fontWeight: "bold", marginBottom: 24 }}>
          THÔNG TIN CHI TIẾT
        </Title>

        <Row gutter={[32, 16]}>
          <Col xs={24} md={12}>
            <List
              itemLayout="horizontal"
              dataSource={product.categories || []}
              renderItem={(category) => (
                <List.Item>
                  <Space>
                    <CheckOutlined style={{ color: "#006241" }} />
                    <Text strong>{category.name}</Text>
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
                    <Text>{category.description || "Không có mô tả"}</Text>
                  </Space>
                </List.Item>
              )}
            />
          </Col>
        </Row>
      </div>

      <div className="related-products-section" style={{ marginTop: 40 }}>
        <Title level={2} className="section-title">
          SẢN PHẨM LIÊN QUAN
        </Title>
        <div className="products-container-5">
          {loading ? (
            <Text>Đang tải sản phẩm...</Text>
          ) : error ? (
            <Text type="danger">{error}</Text>
          ) : allProducts.length === 0 ? (
            <Text>Không tìm thấy sản phẩm nào</Text>
          ) : (
            <ProductList
              products={[...allProducts].sort(() => Math.random() - 0.5).slice(0, 4)}
              gap="16px"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPages;