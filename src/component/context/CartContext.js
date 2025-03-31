import React, {createContext, useReducer, useEffect} from "react";

const CartContext = createContext();

const initialState = {
    cart: JSON.parse(localStorage.getItem("cart")) || [],
}

const cartReducer = (state, action) => {
    switch(action.type) {

        case 'ADD_ITEM': {
            const existItem = state.cart.find(item => item.id === action.payload.id);
            let newCart = [];
            
            if (existItem) {
                newCart = state.cart.map(item => 
                    item.id === action.payload.id ? {...item, qty: item.qty + 1} : item
                );
            } else {
                newCart = [...state.cart, {...action.payload, qty: 1}];
            }
            localStorage.setItem("cart", JSON.stringify(newCart));
            return {...state, cart: newCart};
        }

        case 'REMOVE_ITEM': {
            const newCart = state.cart.filter(item => item.id !== action.payload.id);
            localStorage.setItem("cart", JSON.stringify(newCart));
            return {...state, cart: newCart};
        }

        case 'INCREMENT_ITEM': {
            const newCart = state.cart.map(item => 
                item.id === action.payload.id
                ? {...item, qty: item.qty + 1}
                : item
            );
            localStorage.setItem("cart", JSON.stringify(newCart));
            return {...state, cart: newCart};
        }

        case 'DECREMENT_ITEM': {
            const newCart = state.cart.map(item => 
                item.id === action.payload.id && item.qty > 1
                ? {...item, qty: item.qty - 1}
                : item
            );
            localStorage.setItem("cart", JSON.stringify(newCart));
            return {...state, cart: newCart};
        }

        case 'CLEAR_CART': {
            localStorage.removeItem("cart");
            return {...state, cart: []};
        }

        default:
            return state;

    }
};

/* Cart Provider */
export const CartProvider = ({children}) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state.cart));
    }, [state.cart]);

    return (
        <CartContext.Provider value={{cart: state.cart, dispatch}}>
            {children}
        </CartContext.Provider>
    );
}

/* Custom hook */
export const useCart = () => {
    const context = React.useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within a CartProvider");
    }
    return context;
}