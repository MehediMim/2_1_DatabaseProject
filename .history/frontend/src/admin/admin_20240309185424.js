import React, { Fragment, useState, useEffect } from "react";
import styles from './admin.module.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const password = prompt("Enter the admin password:");
    if (password === "admin") {
      setIsAuthenticated(true);
      fetchOrders();
    } else {
      alert("Incorrect password.");
    }
  }, []);

  const fetchOrders = async () => {
    // Example URL - adjust based on your actual API
    const response = await fetch('/api/orders', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, // Assuming you store an admin token in localStorage
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    } else {
      console.error('Failed to fetch orders');
    }
  };

  if (!isAuthenticated) {
    return <div className={styles.adminContainer}><p>Access Denied</p></div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard.</p>
      <h2>Orders</h2>
      <ul>
        {orders.map((order) => (
          <li key={order.order_id}>
            Order ID: {order.order_id}, Total Price: {order.total_price}
          </li>
        ))}
      </ul>
      {/* More admin functionalities here */}
    </div>
  );
};

export default Admin;
