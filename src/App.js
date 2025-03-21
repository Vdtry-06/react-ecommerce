import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoutes  } from "./service/Guard";
import Navbar from './component/common/Navbar';
import Footer from './component/common/Footer'; 
import { CartProvider } from './component/context/CartContext';
import Home from './component/pages/Home';
import ProductDetailsPages from './component/pages/ProductDetailsPages';
import RegisterPage from './component/pages/RegisterPage';
import LoginPage from './component/pages/LoginPage';
import Account from './component/pages/Account';
import CategoryListPage from './component/pages/CategoryListPage';
import CategoryProductsPage from './component/pages/CategoryProductsPage';
import CartPage from './component/pages/CartPage';
import AddressPage from './component/pages/AddressPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div id="root">
          <Navbar />
          <div className="main-content">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/product/:productId" element={<ProductDetailsPages />} />
                <Route path="/account" element={<Account />} />
                <Route path="/categories" element={<CategoryListPage />} />
                <Route path="/category-products" element={<CategoryProductsPage />} /> 
                <Route path="/cart" element={<CartPage />} />
                <Route path='/edit-address' element={<ProtectedRoute element={<AddressPage/>} />} />
                <Route path='/add-address' element={<ProtectedRoute element={<AddressPage/>} />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}


export default App;
