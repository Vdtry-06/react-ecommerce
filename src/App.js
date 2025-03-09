import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { ProtectedRoute, AdminRoutes  } from "./service/Guard";
import Navbar from './component/common/Navbar';
import Footer from './component/common/Footer'; 
import { CartProvider } from './component/context/CartContext';
import Home from './component/pages/Home';
import ProductDetailsPages from './component/pages/ProductDetailsPages';
import RegisterPage from './component/pages/RegisterPage';
import LoginPage from './component/pages/LoginPage';
import Account from './component/pages/Account';

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
            </Routes>
          </div>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}


export default App;
