import React, { createContext, useReducer, useEffect, useState } from "react";
import ApiService from "../../../service/ApiService";

const CartContext = createContext();

const initialState = {
  cart: [],
  totalCartItems: 0,
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case "SET_CART":
      const total = action.payload.reduce((sum, item) => sum + item.qty, 0);
      return { ...state, cart: action.payload, totalCartItems: total };
    case "ADD_ITEM":
    case "INCREMENT_ITEM":
    case "DECREMENT_ITEM":
    case "REMOVE_ITEM":
    case "CLEAR_CART":
      return state;
    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isLoading, setIsLoading] = useState(false);

  const fetchCart = async (userId) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      const cartResponse = await ApiService.Cart.getCart(userId);
      const cartItems = Object.entries(cartResponse.data || {}).map(
        async ([productId, item]) => {
          const basePrice = item.price || 0;
          const toppingPrice =
            item.toppingIds?.reduce((sum, toppingId) => {
              const topping = item.toppings?.find((t) => t.id === toppingId);
              return sum + (topping?.price || 0);
            }, 0) || 0;
          return {
            id: parseInt(productId),
            qty: item.quantity,
            selected: item.selected || false,
            toppingIds: item.toppingIds || [],
            productName: item.productName || `Product ${productId}`,
            price: basePrice + toppingPrice,
            productImageUrl: item.productImageUrl || "",
            description: item.description || "Không có mô tả",
          };
        }
      );
      const resolvedCartItems = await Promise.all(cartItems);
      dispatch({ type: "SET_CART", payload: resolvedCartItems });
    } catch (error) {
      console.error("Error fetching cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const updateCart = async () => {
      if (ApiService.isAuthenticated()) {
        const userInfo = await ApiService.User.getMyInfo();
        await fetchCart(userInfo.data.id);
      } else {
        dispatch({ type: "SET_CART", payload: [] });
      }
    };
    updateCart();
    const handleAuthChange = () => updateCart();
    window.addEventListener("authChanged", handleAuthChange);
    return () => window.removeEventListener("authChanged", handleAuthChange);
  }, []);

  const syncCartWithBackend = async (userId, actionType, payload) => {
    try {
      setIsLoading(true);
      switch (actionType) {
        case "ADD_ITEM":
          await ApiService.Cart.addToCart(userId, {
            productId: payload.id,
            quantity: payload.qty || 1,
            toppingIds: payload.toppingIds || [],
          });
          break;
        case "INCREMENT_ITEM":
          await ApiService.Cart.updateCartItem(userId, {
            productId: payload.id,
            quantity: payload.qty + 1,
            toppingIds: payload.toppingIds || [],
          });
          break;
        case "DECREMENT_ITEM":
          await ApiService.Cart.updateCartItem(userId, {
            productId: payload.id,
            quantity: payload.qty > 1 ? payload.qty - 1 : 0,
            toppingIds: payload.toppingIds || [],
          });
          if (payload.qty <= 1) {
            await ApiService.Cart.removeCartItem(userId, payload.id);
          }
          break;
        case "UPDATE_ITEM":
          await ApiService.Cart.updateCartItem(userId, {
            productId: payload.id,
            quantity: payload.qty,
            toppingIds: payload.toppingIds || [],
          });
          break;
        case "REMOVE_ITEM":
          await ApiService.Cart.removeCartItem(userId, payload.id);
          break;
        case "CLEAR_CART":
          break;
        default:
          console.warn(`Unknown actionType: ${actionType}`);
          break;
      }
      await fetchCart(userId);
      window.dispatchEvent(new Event("cartChanged"));
    } catch (error) {
      console.error(`Error syncing ${actionType} with backend:`, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <CartContext.Provider value={{ ...state, syncCartWithBackend, isLoading }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = React.useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
