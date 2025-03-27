import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/productList.css";

const ProductList = ({ products }) => {
    const navigate = useNavigate();

    // Hàm lấy đơn hàng PENDING từ backend
    const getPendingOrder = async () => {
        try {
            const userInfo = await ApiService.getMyInfo();
            const userId = userInfo.data.id;
            const ordersResponse = await ApiService.getAllOrdersOfUser(userId);
            const orders = ordersResponse.data || [];
            return orders.find(order => order.status === "PENDING");
        } catch (error) {
            console.error("Error fetching pending order:", error);
            throw error;
        }
    };

    const addToCart = async (product) => {
        try {
            if (!ApiService.isAuthenticated()) {
                alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
                navigate("/login");
                return;
            }

            const userInfo = await ApiService.getMyInfo();
            const userId = userInfo.data.id;
            let pendingOrder = await getPendingOrder();

            const orderLineRequest = { productId: product.id, quantity: 1 };

            if (!pendingOrder) {
                const orderRequest = {
                    userId,
                    orderLines: [orderLineRequest],
                    paymentMethod: "CASH_ON_DELIVERY"
                };
                await ApiService.createOrder(orderRequest);
            } else {
                const existingLine = pendingOrder.orderLines.find(line => line.productId === product.id);
                if (existingLine) {
                    await ApiService.updateOrderLine(
                        pendingOrder.id,
                        existingLine.id,
                        { productId: product.id, quantity: existingLine.quantity + 1 }
                    );
                } else {
                    await ApiService.addOrderLine(pendingOrder.id, orderLineRequest);
                }
            }
            alert("Đã thêm sản phẩm vào giỏ hàng!");
            window.dispatchEvent(new Event("cartChanged")); // Thông báo thay đổi giỏ hàng
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng!");
        }
    };

    const incrementItem = async (product) => {
        try {
            const pendingOrder = await getPendingOrder();
            if (!pendingOrder) return;

            const orderLine = pendingOrder.orderLines.find(line => line.productId === product.id);
            if (!orderLine) return;

            const orderLineRequest = { productId: product.id, quantity: orderLine.quantity + 1 };
            await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, orderLineRequest);
            window.dispatchEvent(new Event("cartChanged")); // Thông báo thay đổi giỏ hàng
        } catch (error) {
            console.error("Error incrementing item:", error);
            alert(error.response?.data?.message || "Lỗi khi tăng số lượng!");
        }
    };

    const decrementItem = async (product) => {
        try {
            const pendingOrder = await getPendingOrder();
            if (!pendingOrder) return;

            const orderLine = pendingOrder.orderLines.find(line => line.productId === product.id);
            if (!orderLine) return;

            if (orderLine.quantity > 1) {
                const orderLineRequest = { productId: product.id, quantity: orderLine.quantity - 1 };
                await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, orderLineRequest);
            } else {
                await ApiService.deleteOrderLine(pendingOrder.id, orderLine.id);
            }
            window.dispatchEvent(new Event("cartChanged")); // Thông báo thay đổi giỏ hàng
        } catch (error) {
            console.error("Error decrementing item:", error);
            alert(error.response?.data?.message || "Lỗi khi giảm số lượng!");
        }
    };

    const [cart, setCart] = React.useState([]);
    React.useEffect(() => {
        const fetchCart = async () => {
            try {
                if (ApiService.isAuthenticated()) {
                    const pendingOrder = await getPendingOrder();
                    if (pendingOrder) {
                        const cartItems = await Promise.all(
                            pendingOrder.orderLines.map(async (line) => ({
                                id: line.productId,
                                qty: line.quantity
                            }))
                        );
                        setCart(cartItems);
                    } else {
                        setCart([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching cart:", error);
            }
        };
        fetchCart();

        // Lắng nghe sự kiện cartChanged để cập nhật giỏ hàng realtime
        const handleCartUpdate = () => fetchCart();
        window.addEventListener("cartChanged", handleCartUpdate);
        return () => window.removeEventListener("cartChanged", handleCartUpdate);
    }, [products]);

    console.log("Product List Render:", products);

    return (
        <div className="product-list">
            {products.map((product, index) => {
                const cartItem = cart.find(item => item.id === product.id);
                return (
                    <div className="product-item" key={index}>
                        <Link to={`/product/${product.id}`}>
                            <img src={product.imageUrl} alt={product.name} className="product-image" />
                            <h3>{product.name}</h3>
                            <p>{product.description}</p>
                            <span>${product.price.toFixed(2)}</span>
                        </Link>
                        {cartItem ? (
                            <div className="quantity-controls">
                                <button onClick={() => decrementItem(product)}> - </button>
                                <span>{cartItem.qty}</span>
                                <button onClick={() => incrementItem(product)}> + </button>
                            </div>
                        ) : (
                            <button onClick={() => addToCart(product)}>Add to Cart</button>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default ProductList;