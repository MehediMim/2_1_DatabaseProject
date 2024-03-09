import React, { useEffect, useState } from 'react';
import styles from './admin.module.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const authenticateAndFetchOrders = async () => {
      const password = prompt("Enter the admin password:");
      if (password === "admin") {
        setIsAuthenticated(true);
        const response = await fetch('http://localhost:5000/admin/orders-with-details', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setOrders(data);
        } else {
          console.error('Failed to fetch orders with details');
        }
      } else {
        alert("Incorrect password.");
      }
    };

    authenticateAndFetchOrders();
  }, []);

  if (!isAuthenticated) {
    return <div className={styles.adminContainer}><p>Access Denied</p></div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard. Here are all the orders with their details:</p>
      {orders.map((order) => (
        <div key={order.order_id} className={styles.orderItem}>
          <h3>Order ID: {order.order_id}</h3>
          <p>User ID: {order.user_id}</p>
          <p>Total Price: {order.total_price}</p>
          <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
          <p>Status: {order.status}</p>
          <div>
            <h4>Items:</h4>
            {order.details.map((detail) => (
              <div key={detail.item_id}>
                <p>Item ID: {detail.item_id}</p>
                <p>Quantity: {detail.quantity}</p>
                <p>Price: {detail.price}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Admin;
