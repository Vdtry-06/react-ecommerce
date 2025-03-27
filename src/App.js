import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoute  } from "./service/Guard";
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
import CheckoutPage from './component/pages/CheckoutPage';
import AddressPage from './component/pages/AddressPage';
import AdminPage from './component/admin/AdminPage';
import AdminCategoryPage from './component/admin/AdminCategoryPage';
import AddCategory from './component/admin/AddCategory';
import EditCategory from './component/admin/EditCategory';
import AdminProductPage from './component/admin/AdminProductPage';
import AddProduct from './component/admin/AddProduct';
import EditProduct from './component/admin/EditProductPage';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div id="root">
          <Navbar />
          <div className="main-content">
            <Routes>
                <Route exact path='/' element={<Home/>}/>
                <Route path="/product/:productId" element={<ProductDetailsPages />} />
                <Route path="/categories" element={<CategoryListPage />} />
                <Route path="/category-products" element={<CategoryProductsPage />} /> 
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/account" element={<Account />} />

                <Route path='/edit-address' element={<ProtectedRoute element={<AddressPage/>} />} />
                <Route path='/add-address' element={<ProtectedRoute element={<AddressPage/>} />} />
            
                <Route path='/admin/*' element={<AdminRoute element={<AdminPage/>} />} />
                {/* <Route path='/admin/categories' element={<AdminRoute element={<AdminCategoryPage/>} />} />
                <Route path='/admin/add-category' element={<AdminRoute element={<AddCategory/>} />} />
                <Route path='/admin/edit-category/:categoryId' element={<AdminRoute element={<EditCategory/>} />} />
                <Route path='/admin/products' element={<AdminRoute element={<AdminProductPage/>} />} />
                <Route path='/admin/add-product' element={<AdminRoute element={<AddProduct/>} />} />
                <Route path='/admin/edit-product/:productId' element={<AdminRoute element={<EditProduct/>} />} /> */}
            </Routes>
          </div>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
