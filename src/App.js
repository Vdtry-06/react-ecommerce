import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute, AdminRoutes  } from "./service/Guard";
import Navbar from './component/common/Navbar';
import Footer from './component/common/Footer'; 
import { CartProvider } from './component/context/CartContext';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Navbar />
          <Routes>
            
          </Routes>

        <Footer />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
