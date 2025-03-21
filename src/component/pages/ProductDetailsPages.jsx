import React, {useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext"
import ApiService from "../../service/ApiService";
import "../../static/style/productDetailsPages.css";

const ProductDetailsPages = () => {

    const { productId } = useParams();
    const {cart, dispatch} = useCart();
    const [product, setProduct] = useState(null);
    const [selectedToppings, setSelectedToppings] = useState(new Set());
    
    useEffect(() => {
        fetchProduct();
    }, [productId]);

    const fetchProduct = async () => {
        try {
            const response = await ApiService.getProduct(productId);
            setProduct(response.data);
        } catch (error) {
            console.log(error.message || error);
        }
    }

    const addToCart = () => {
        if (product) {
            const productWithToppings = {
                ...product,
                selectedToppings: Array.from(selectedToppings)
            };
            dispatch({type: 'ADD_ITEM', payload: product});
        }
    }

    const incrementItem = () => {
        if (product) {
            dispatch({type: 'INCREMENT_ITEM', payload: product});
        }
    }

    const decrementItem = () => {
        if (product) {
            const cartItem = cart.find(item => item.id === product.id);
            if (cartItem && cartItem.qty > 1) {
                dispatch({type: 'DECREMENT_ITEM', payload: product});
            } else {
                dispatch({type: 'REMOVE_ITEM', payload: product});
            }
        }
    }

    const toggleTopping = (toppingId) => {
        setSelectedToppings(prev => {
            const newToppings = new Set(prev);
            newToppings.has(toppingId) ? newToppings.delete(toppingId) : newToppings.add(toppingId);
            return newToppings;
        });
    }
    
    if (!product) {
        return <p>Loading...</p>;
    }

    const cartItem = cart.find(item => item.id === product.id);

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
    )
}

export default ProductDetailsPages;