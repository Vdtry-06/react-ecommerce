import './App.css';
import { BrowserRouter } from 'react-router-dom';
import { CartProvider } from './component/context/CartContext';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
