import React, { useState, useEffect } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import NavBar from './NavBar/nav';
import SignUp from './signUp/signup';
import LogIn from './logIn/login';
import Home from './Home/home';
import Dashboard from './dashboard/dashboard';
import Cart from './cart/cart';
import Bigitem from './itemBig/itemBig'
import Menu from './menu/menu'
import Orders from './orders/orders';
import AddItems from './addItem/addItem';
import MyList from './myList/myList';
import Messaging from './messaging/messaging';
import SearchResults from './seach/search';
import ItemBig from './itemBig/itemBig';
import Admin from './admin/admin';
import Checkout from './checkout/checkout';
import Store from './store/store';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [showAdminPasswordPrompt, setShowAdminPasswordPrompt] = useState(false);
  const handleAdminAccess = () => {
    const password = prompt("Please enter the admin password:");
    if (password === "admin") {
      setIsAdminAuthenticated(true);
    } else {
      alert("Incorrect password.");
      setIsAdminAuthenticated(false);
    }
  };
  

  useEffect(() => {
    // Ideally, you should verify the authentication status with the backend
    // Here, we simply check if isAuthenticated is stored in localStorage
    const authState = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(authState === 'true'); // Ensure correct boolean conversion
  }, []);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
    localStorage.setItem('isAuthenticated', boolean.toString()); // Store as a string
  };

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LogIn setAuth={setAuth} /> : <Navigate replace to="/dashboard" />} />
        <Route path="/signup" element={!isAuthenticated ? <SignUp setAuth={setAuth} /> : <Navigate replace to="/dashboard" />} />
        <Route path="/dashboard" element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate replace to="/login" />} />
        <Route path="/cart" element={isAuthenticated ? <Cart setAuth={setAuth} /> : <Navigate replace to="/login" />} />
        <Route path="/menu" element={isAuthenticated ? <Menu setAuth={setAuth} /> : <Navigate replace to="/login" />} />
        <Route path="/myList" element={isAuthenticated ? <MyList setAuth={setAuth} /> : <Navigate replace to="/login" />} />
        <Route path="/messages" element={isAuthenticated ? <Messaging setAuth={setAuth} /> : <Navigate replace to="/login" />} />
        <Route path="/admin" element={  <Admin />  }/>
        <Route path="/checkout" element={  <Checkout />  }/>
        <Route path="/orders" element={<Orders />} />
        <Route path="/itemExpand" element={<ItemBig />} />
        <Route path="/addItems" element={<AddItems />} />
        <Route path="/store" element={<Store />} />
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/item/:itemId" element={<Bigitem />} />
        <Route path="*" element={<Navigate replace to="/" />} />
        <Route path="/admin" element={<Adminpage />} />
      </Routes>
    </Router>
  );
}

export default App;
