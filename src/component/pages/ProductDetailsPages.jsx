import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiService from "../../service/ApiService";
import "../../static/style/productDetailsPages.css";

const ProductDetailsPages = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState(new Set());
    const [cartItem, setCartItem] = useState(null); // State để lưu thông tin sản phẩm trong giỏ hàng

    useEffect(() => {
        fetchProduct();
        fetchCartItem(); // Lấy thông tin giỏ hàng khi component mount
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await ApiService.getProduct(productId);
            setProduct(response.data);
        } catch (error) {
            console.log(error.message || error);
        }
    };

    // Lấy thông tin giỏ hàng từ backend để kiểm tra sản phẩm đã có trong giỏ chưa
    const fetchCartItem = async () => {
        try {
            if (ApiService.isAuthenticated()) {
                const userInfo = await ApiService.getMyInfo();
                const userId = userInfo.data.id;
                const ordersResponse = await ApiService.getAllOrdersOfUser(userId);
                const orders = ordersResponse.data || [];
                const pendingOrder = orders.find(order => order.status === "PENDING");

                if (pendingOrder && pendingOrder.orderLines) {
                    const orderLine = pendingOrder.orderLines.find(line => line.productId === parseInt(productId));
                    if (orderLine) {
                        setCartItem({ id: orderLine.productId, qty: orderLine.quantity });
                    } else {
                        setCartItem(null);
                    }
                } else {
                    setCartItem(null);
                }
            }
        } catch (error) {
            console.error("Error fetching cart item:", error);
            setCartItem(null);
        }
    };

    const addToCart = async () => {
        if (!product) return;

        try {
            if (!ApiService.isAuthenticated()) {
                alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
                return;
            }

            const userInfo = await ApiService.getMyInfo();
            const userId = userInfo.data.id;
            const ordersResponse = await ApiService.getAllOrdersOfUser(userId);
            const orders = ordersResponse.data || [];
            let pendingOrder = orders.find(order => order.status === "PENDING");

            const orderLineRequest = { productId: product.id, quantity: 1 };

            if (!pendingOrder) {
                const orderRequest = {
                    userId,
                    orderLines: [orderLineRequest],
                    paymentMethod: "CASH_ON_DELIVERY"
                };
                await ApiService.createOrder(orderRequest);
            } else {
                await ApiService.addOrderLine(pendingOrder.id, orderLineRequest);
            }
            window.dispatchEvent(new Event("cartChanged")); // Thông báo thay đổi giỏ hàng
            fetchCartItem(); // Cập nhật lại thông tin giỏ hàng
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert(error.response?.data?.message || "Lỗi khi thêm vào giỏ hàng!");
        }
    };

    const incrementItem = async () => {
        if (!product) return;

        try {
            const userInfo = await ApiService.getMyInfo();
            const userId = userInfo.data.id;
            const ordersResponse = await ApiService.getAllOrdersOfUser(userId);
            const orders = ordersResponse.data || [];
            const pendingOrder = orders.find(order => order.status === "PENDING");

            if (pendingOrder) {
                const orderLine = pendingOrder.orderLines.find(line => line.productId === product.id);
                if (orderLine) {
                    const orderLineRequest = { productId: product.id, quantity: orderLine.quantity + 1 };
                    await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, orderLineRequest);
                    window.dispatchEvent(new Event("cartChanged"));
                    fetchCartItem(); // Cập nhật lại thông tin giỏ hàng
                }
            }
        } catch (error) {
            console.error("Error incrementing item:", error);
            alert(error.response?.data?.message || "Lỗi khi tăng số lượng!");
        }
    };

    const decrementItem = async () => {
        if (!product) return;

        try {
            const userInfo = await ApiService.getMyInfo();
            const userId = userInfo.data.id;
            const ordersResponse = await ApiService.getAllOrdersOfUser(userId);
            const orders = ordersResponse.data || [];
            const pendingOrder = orders.find(order => order.status === "PENDING");

            if (pendingOrder) {
                const orderLine = pendingOrder.orderLines.find(line => line.productId === product.id);
                if (orderLine) {
                    if (orderLine.quantity > 1) {
                        const orderLineRequest = { productId: product.id, quantity: orderLine.quantity - 1 };
                        await ApiService.updateOrderLine(pendingOrder.id, orderLine.id, orderLineRequest);
                    } else {
                        await ApiService.deleteOrderLine(pendingOrder.id, orderLine.id);
                    }
                    window.dispatchEvent(new Event("cartChanged"));
                    fetchCartItem(); // Cập nhật lại thông tin giỏ hàng
                }
            }
        } catch (error) {
            console.error("Error decrementing item:", error);
            alert(error.response?.data?.message || "Lỗi khi giảm số lượng!");
        }
    };

    const toggleTopping = (toppingId) => {
        setSelectedToppings(prev => {
            const newToppings = new Set(prev);
            newToppings.has(toppingId) ? newToppings.delete(toppingId) : newToppings.add(toppingId);
            return newToppings;
        });
    };

    if (!product) {
        return <p>Loading...</p>;
    }

    return (
        <div className="product-detail">
            {/* Ảnh + Thông tin sản phẩm */}
            <div className="product-info">
                <img src={product?.imageUrl} alt={product.name} />
                <h1>{product?.name}</h1>
                <p>{product?.description}</p>
                <p>Số lượng: {product?.availableQuantity}</p>
                <span>${product?.price.toFixed(2)}</span>
                {cartItem ? (
                    <div className="quantity-controls">
                        <button onClick={decrementItem}> - </button>
                        <span>{cartItem.qty}</span>
                        <button onClick={incrementItem}> + </button>
                    </div>
                ) : (
                    <button onClick={addToCart}>Add to Cart</button>
                )}
            </div>

            {/* Danh mục sản phẩm */}
            <div className="product-categories">
                <h2>Categories</h2>
                <ul>
                    {product?.categories?.map((category) => (
                        <li key={category.id}>
                            <strong>{category.name}</strong>: {category.description}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Topping */}
            <div className="product-toppings">
                <h2>Toppings</h2>
                <ul>
                    {product?.toppings?.map((topping) => (
                        <li key={topping.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() => toggleTopping(topping.id)}
                                    checked={selectedToppings.has(topping.id)}
                                />
                                <div className="topping-info">
                                    <strong>{topping.name}</strong>: {topping.price}
                                </div>
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProductDetailsPages;