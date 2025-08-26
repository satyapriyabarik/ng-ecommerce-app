import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Checkout from './components/pages/Checkout';
import { ApolloProvider } from '@apollo/client';
import { client } from './apollo/client';
import AdminAddProduct from './components/pages/AdminAddProduct';
import Register from './components/pages/Register';
import Header from './components/pages/Header';
import Footer from './components/pages/Footer';
import './App.css';
import ErrorPage from './components/pages/error';
import { useAuth } from './context/AuthContext';
import PaymentFailed from './components/pages/Payment-failed';
import OrderSuccess from './components/pages/OrderSuccess';
import MyOrders from './components/pages/MyOrder';
import Profile from './components/pages/Profile';
import ProductDetails from './components/pages/ProductDetails';
import { CartIconProvider } from './context/CartIconContext';

export default function App() {
  const { token } = useAuth();

  const PrivateRoute = ({ children }) => {
    return token ? children : <Navigate to="/" replace />;
  };
  return (
    <ApolloProvider client={client}>
      <CartProvider>
        <BrowserRouter>
          <div className="d-flex flex-column min-vh-100 container-flex">
            <CartIconProvider>
              <Header />
              <main className="flex-grow-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/error" element={<ErrorPage />} />
                  <Route path="/home" element={<Home />} />
                  <Route path="/product/:id" element={<ProductDetails />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/admin/add-product" element={<PrivateRoute><AdminAddProduct /></PrivateRoute>} />
                  <Route path="/my-orders" element={<PrivateRoute><MyOrders /></PrivateRoute>} />
                  <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                  <Route path="/payment-failed" element={<PaymentFailed />} />
                  <Route path="/order-success" element={<OrderSuccess />} />

                </Routes>
              </main>
            </CartIconProvider>
            <Footer />
          </div>
        </BrowserRouter>
      </CartProvider>
    </ApolloProvider>
  );
}
