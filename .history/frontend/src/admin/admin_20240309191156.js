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
    const response = await fetch('http://localhost:5000/admin/orders', {
      headers: {
        // If your API requires authentication headers, include them here
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, // Example header
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
      <div className={styles.container}>
        <ul className={styles.orderList}>
          {orders.map((order) => (
            <li key={order.order_id} className={styles.eachOrder}>
              Order ID: {order.order_id}, Total Price: {order.total_price}
              {/* Optionally display more order details here */}
            </li>
          ))}
        </ul>
      </div>
      {/* More admin functionalities here */}
    </div>
  );
};

export default Admin;
