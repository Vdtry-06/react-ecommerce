import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ProtectedRoute, AdminRoute } from "./service/Guard";
import Navbar from "./component/common/Navbar";
import AdminHeader from "./component/admin/admin/AdminHeader";
import Footer from "./component/common/Footer";
import { CartProvider } from "./component/context/CartContext";
import FirstPage from "./component/pages/beverage/FirstPage";
import Home from "./component/pages/home/Home";
import ProductDetailsPages from "./component/pages/product-detail/ProductDetailsPages";
import RegisterPage from "./component/pages/register/RegisterPage";
import LoginPage from "./component/pages/login/LoginPage";
import RequestVerificationCode from "./component/pages/register/RequestVerificationCode";
import VerifyAccount from "./component/pages/login/VerifyAccount";
import Account from "./component/pages/account/Account";
import UpdateProfile from "./component/pages/account/UpdateProfile";
import CategoryProductsPage from "./component/pages/home/CategoryProductsPage";
import CartPage from "./component/pages/cart/CartPage";
import CheckoutPage from "./component/pages/checkout/CheckoutPage";
import OrdersPage from "./component/pages/order/OrdersPage";
import OrdersCancelledPage from "./component/pages/order/OrdersCancelledPage";
import AddressPage from "./component/pages/account/AddressPage";

import Chatbot from "./component/common/Chatbot";
import ForgotPasswordPage from "./component/pages/login/ForgotPasswordPage";

import AdminPage from "./component/admin/admin/AdminPage";
import AdminDashboard from "./component/admin/dashboard/Dashboard";
import ChartView from "./component/admin/dashboard/ChartView";
import AdminCategoryPage from "./component/admin/category/AdminCategoryPage";
import AddCategory from "./component/admin/category/AddCategory";
import EditCategory from "./component/admin/category/EditCategory";
import AdminProductPage from "./component/admin/product/AdminProductPage";
import AddProduct from "./component/admin/product/AddProduct";
import EditProduct from "./component/admin/product/EditProductPage";
import AdminOrdersPage from "./component/admin/order/AdminOrdersPage";
import OrderDetailPage from "./component/admin/order/OrderDetailPage";
import AdminUserPage from "./component/admin/user/AdminUserPage";
import UserDetailPage from "./component/admin/user/UserDetailPage";
import AdminReviewsPage from "./component/admin/review/AdminReviewsPage";
import AdminToppingPage from "./component/admin/topping/AdminToppingPage";

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
                  <Route path="add-category" element={<AddCategory />} />
                  <Route
                    path="edit-category/:categoryId"
                    element={<EditCategory />}
                  />
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
