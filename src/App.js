import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import Navbar from "./components/user/Navbar";
import AdminHeader from "./components/admin/AdminHeader";
import Footer from "./components/user/Footer";
import { CartProvider } from "./pages/auth/context/CartContext";
import FirstPage from "./pages/user/beverage/FirstPage";
import Home from "./pages/user/home/Home";
import ProductDetailsPages from "./pages/user/product-detail/ProductDetailsPages";
import RegisterPage from "./pages/auth/register/RegisterPage";
import LoginPage from "./pages/auth/login/LoginPage";
import RequestVerificationCode from "./pages/auth/register/RequestVerificationCode";
import VerifyAccount from "./pages/auth/login/VerifyAccount";
import Account from "./pages/user/account/Account";
import UpdateProfile from "./pages/user/account/UpdateProfile";
import CategoryProductsPage from "./pages/user/home/CategoryProductsPage";
import CartPage from "./pages/user/cart/CartPage";
import CheckoutPage from "./pages/user/checkout/CheckoutPage";
import OrdersPage from "./pages/user/order/OrdersPage";
import OrdersCancelledPage from "./pages/user/order/OrdersCancelledPage";
import AddressPage from "./pages/user/account/AddressPage";

import Chatbot from "./components/user/Chatbot";
import ForgotPasswordPage from "./pages/auth/forgot-password/ForgotPasswordPage";

import AdminPage from "./pages/admin/admin/AdminPage";
import AdminDashboard from "./pages/admin/dashboard/Dashboard";
import ChartView from "./pages/admin/dashboard/ChartView";
import AdminCategoryPage from "./pages/admin/category/AdminCategoryPage";
import AdminProductPage from "./pages/admin/product/AdminProductPage";
import AddProduct from "./pages/admin/product/AddProductPage";
import EditProduct from "./pages/admin/product/EditProductPage";
import AdminOrdersPage from "./pages/admin/order/AdminOrdersPage";
import OrderDetailPage from "./pages/admin/order/OrderDetailPage";
import AdminUserPage from "./pages/admin/user/AdminUserPage";
import UserDetailPage from "./pages/admin/user/UserDetailPage";
import AdminReviewsPage from "./pages/admin/review/AdminReviewsPage";
import AdminToppingPage from "./pages/admin/topping/AdminToppingPage";

function Layout({ children }) {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      {isAdminPage ? <AdminHeader /> : <Navbar />}
      <div className={`main-content ${isAdminPage ? "admin-content" : ""}`}>
        {children}
      </div>
      {!isAdminPage && <Footer />}
      {!isAdminPage && <Chatbot />}
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
                <Route exact path="/beverage" element={<FirstPage />} />
                <Route path="/" element={<Home />} />
                <Route
                  path="/product/:productId"
                  element={<ProductDetailsPages />}
                />
                <Route
                  path="/category-products"
                  element={<CategoryProductsPage />}
                />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route
                  path="/orders"
                  element={<ProtectedRoute element={<OrdersPage />} />}
                />
                <Route
                  path="/orders-cancelled"
                  element={<OrdersCancelledPage />}
                />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route
                  path="/request-verification"
                  element={<RequestVerificationCode />}
                />
                <Route path="/verify-account" element={<VerifyAccount />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotPasswordPage />}
                />
                <Route path="/account" element={<Account />} />
                <Route path="/update-profile" element={<UpdateProfile />} />
                <Route
                  path="/edit-address"
                  element={<ProtectedRoute element={<AddressPage />} />}
                />
                <Route
                  path="/add-address"
                  element={<ProtectedRoute element={<AddressPage />} />}
                />

                <Route
                  path="/admin"
                  element={<AdminRoute element={<AdminPage />} />}
                >
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="dashboard/charts" element={<ChartView />} />
                  <Route path="categories" element={<AdminCategoryPage />} />
                  <Route path="products" element={<AdminProductPage />} />
                  <Route path="add-product" element={<AddProduct />} />
                  <Route
                    path="edit-product/:productId"
                    element={<EditProduct />}
                  />
                  <Route path="orders" element={<AdminOrdersPage />} />
                  <Route path="orders/:orderId" element={<OrderDetailPage />} />
                  <Route path="users" element={<AdminUserPage />} />
                  <Route
                    path="user-detail/:userId"
                    element={<UserDetailPage />}
                  />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="toppings" element={<AdminToppingPage />} />
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
