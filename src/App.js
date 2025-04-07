import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ProtectedRoute, AdminRoute  } from "./service/Guard";
import Navbar from './component/common/Navbar';
import Footer from './component/common/Footer'; 
import { CartProvider } from './component/context/CartContext';
import Home from './component/pages/Home';
import ProductDetailsPages from './component/pages/ProductDetailsPages';
import RegisterPage from './component/pages/RegisterPage';
import LoginPage from './component/pages/LoginPage';
import Account from './component/pages/Account';
import UpdateProfile from './component/pages/UpdateProfile';
import CategoryListPage from './component/pages/CategoryListPage';
import CategoryProductsPage from './component/pages/CategoryProductsPage';
import CartPage from './component/pages/CartPage';
import CheckoutPage from './component/pages/CheckoutPage';
import OrdersPage from './component/pages/OrdersPage';
import AddressPage from './component/pages/AddressPage';
import AdminPage from './component/admin/AdminPage';
import ForgotPasswordPage from './component/pages/ForgotPasswordPage';
import AdminCategoryPage from './component/admin/AdminCategoryPage';
import AddCategory from './component/admin/AddCategory';
import EditCategory from './component/admin/EditCategory';
import AdminProductPage from './component/admin/AdminProductPage';
import AddProduct from './component/admin/AddProduct';
import EditProduct from './component/admin/EditProductPage';
import AdminUserPage from './component/admin/AdminUserPage';
import UserDetailPage from './component/admin/UserDetailPage';
import ToppingManagement from './component/admin/ToppingManagement';

function Layout({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');
  return (
    <>
      {/* {!isAdminPage && <Navbar />} */}
      <Navbar/>
      <div className="main-content">{children}</div>
      {!isAdminPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div id="root">
          <Layout>
            <div className="main-content">
              <Routes>
                  <Route exact path='/' element={<Home/>}/>
                  <Route path="/product/:productId" element={<ProductDetailsPages />} />
                  <Route path="/categories" element={<CategoryListPage />} />
                  <Route path="/category-products" element={<CategoryProductsPage />} /> 
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/orders" element={<OrdersPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/update-profile" element={<UpdateProfile />} />

                  <Route path='/edit-address' element={<ProtectedRoute element={<AddressPage/>} />} />
                  <Route path='/add-address' element={<ProtectedRoute element={<AddressPage/>} />} />
              
                  <Route path="/admin" element={<AdminRoute element={<AdminPage />} />}>
                  <Route path="dashboard" element={<p>Chào mừng bạn đến với Bảng điều khiển Quản trị!</p>} />
                  <Route path="categories" element={<AdminCategoryPage />} />
                  <Route path="add-category" element={<AddCategory />} />
                  <Route path="edit-category/:categoryId" element={<EditCategory />} />
                  <Route path="products" element={<AdminProductPage />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route path="edit-product/:productId" element={<EditProduct />} />
                  <Route path="users" element={<AdminUserPage />} />
                  <Route path="user-detail/:userId" element={<UserDetailPage />} />
                  <Route path="toppings" element={<ToppingManagement />} />
                  {/* Thêm các route khác như orders, users, toppings nếu cần */}
                </Route>
              </Routes>
            </div>
          </Layout>
        </div>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
