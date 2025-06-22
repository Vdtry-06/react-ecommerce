import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../../auth/context/CartContext";
import ApiService from "../../../service/ApiService";
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
import ProductList from "../../../components/common/ProductList";
import ProductImages from "../../../components/user/product-detail/ProductImages";
import ProductInfo from "../../../components/user/product-detail/ProductInfo";
import ProductTabs from "../../../components/user/product-detail/ProductTabs";
import ProductDetailInfo from "../../../components/user/product-detail/ProductDetailInfo";
import RelatedProducts from "../../../components/user/product-detail/RelatedProducts";
import "../../../static/style/productDetailsPages.css";

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
        const userComment = response.data.find(
          (comment) => comment.userId === userId
        );
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
      setError(
        error.response?.data?.message ||
          error.message ||
          "Lỗi khi tải sản phẩm!"
      );
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
        throw new Error(
          error.response?.data?.message ||
            error.message ||
            "Không thể tải thông tin sản phẩm!"
        );
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
      const toppingPrices =
        product.toppings
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
        const confirmLogin = window.confirm(
          "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng! Đến trang đăng nhập?"
        );
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
        await syncCartWithBackend(userId, "REMOVE_ITEM", {
          id: parseInt(productId),
        });
        message.info("Sản phẩm đã được xóa khỏi giỏ hàng!");
      }

      window.dispatchEvent(new Event("cartChanged"));
    } catch (error) {
      console.error("Error in handleToppingChange:", error);
      message.error(
        error.response?.data?.message || "Lỗi khi cập nhật toppings!"
      );
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
        const confirmLogin = window.confirm(
          "Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng! Đến trang đăng nhập?"
        );
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
      message.error(
        error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng!"
      );
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
        message.success(
          increment ? "Số lượng đã được tăng!" : "Số lượng đã được giảm!"
        );
      } else {
        await syncCartWithBackend(userId, "REMOVE_ITEM", {
          id: parseInt(productId),
        });
        setSelectedToppings([]);
        message.info("Sản phẩm đã được xóa khỏi giỏ hàng!");
      }

      window.dispatchEvent(new Event("cartChanged"));
    } catch (error) {
      message.error(
        increment ? "Lỗi khi tăng số lượng!" : "Lỗi khi giảm số lượng!"
      );
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
      setComments((prevComments) => [
        ...prevComments,
        { ...response.data, visible: true },
      ]);
      setHasCommented(true);
    } catch (error) {
      message.error(
        error.response?.data?.message || "Không thể gửi bình luận!"
      );
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
        prevComments.map((c) =>
          c.id === commentId ? { ...response.data, visible: true } : c
        )
      );
      setEditingComment(null);
      form.resetFields();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Không thể cập nhật bình luận!"
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      setIsProcessing(true);
      await ApiService.Review.deleteReview(commentId);
      message.success("Bình luận đã được xóa thành công!");
      setComments((prevComments) =>
        prevComments.filter((c) => c.id !== commentId)
      );
      setHasCommented(false);
      setEditingComment(null);
      form.resetFields();
    } catch (error) {
      message.error(
        error.response?.data?.message || "Không thể xóa bình luận!"
      );
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

  const displayProduct = {
    ...product,
    name: product.name,
    price: calculateTotalPrice(),
    originalPrice: product.originalPrice || product.price * 1.05,
    discount: product.discount || 5,
    description: product.description || "Không có mô tả",
    sku: product.id,
    categories:
      product.categories?.map((cat) => cat.name).join(", ") ||
      "Không có danh mục",
    categoriesDescription:
      product.categories?.map((cat) => cat.description).join(", ") ||
      "Không có mô tả danh mục",
    toppings:
      product.toppings?.map((top) => top.name).join(", ") ||
      "Không có toppings",
    toppingsPrice: product.toppings?.map((top) => top.price).join(", ") || "",
  };

  return (
    <div>
      <div
        className="product-details-container"
        style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}
      >
        <div className="product-detail-top">
          <div
            className="product-detail-layout"
            style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}
          >
            <ProductImages
              product={product}
              selectedImage={selectedImage}
              hoveredImage={hoveredImage}
              setSelectedImage={setSelectedImage}
              setHoveredImage={setHoveredImage}
            />
            <ProductInfo
              product={product} // Pass original product for toppings
              displayProduct={displayProduct} // Pass displayProduct for other fields
              cartItem={cart.find((item) => item.id === parseInt(productId))}
              selectedToppings={selectedToppings}
              isProcessing={isProcessing}
              isLoading={isLoading}
              handleToppingChange={handleToppingChange}
              addToCart={addToCart}
              buyNow={buyNow}
              updateQuantity={updateQuantity}
              toggleWishlist={toggleWishlist}
              productId={productId}
              wishlist={wishlist}
            />
          </div>
        </div>

        <ProductTabs
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          comments={comments}
          userId={userId}
          editingComment={editingComment}
          setEditingComment={setEditingComment}
          form={form}
          userRating={userRating}
          setUserRating={setUserRating}
          hasCommented={hasCommented}
          isProcessing={isProcessing}
          handleReviewSubmit={handleReviewSubmit}
          handleUpdateComment={handleUpdateComment}
          handleDeleteComment={handleDeleteComment}
          product={displayProduct}
        />
        <ProductDetailInfo product={product} />
        <RelatedProducts allProducts={allProducts} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default ProductDetailsPages;