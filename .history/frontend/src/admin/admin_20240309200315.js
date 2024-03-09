import React, { useEffect, useState } from 'react';
import styles from './admin.module.css';

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState([]);
  const [month, setMonth] = useState('');

  useEffect(() => {
    authenticateAndFetchOrders(); // Initial load
  }, []);

  const authenticateAndFetchOrders = async (selectedMonth = '') => {
    // Simplified the prompt for the example. Consider a more secure authentication method for production.
    // const password = prompt("Enter the admin password:");
    // if (password !== "admin") {
    //   alert("Incorrect password.");
    //   return;
    // }

    setIsAuthenticated(true);
    const fetchUrl = `http://localhost:5000/admin/orders?month=${encodeURIComponent(selectedMonth)}`;
    const response = await fetch(fetchUrl, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`, // Adjust according to your actual token storage method
      },
    });

    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    } else {
      console.error('Failed to fetch orders with details');
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleSearch = () => {
    authenticateAndFetchOrders(month);
  };

  if (!isAuthenticated) {
    return <div className={styles.adminContainer}><p>Access Denied</p></div>;
  }

  return (
    <div className={styles.adminContainer}>
      <h1>Admin Dashboard</h1>
      <p>Welcome to the Admin Dashboard. Here are all the orders with their details:</p>
      <div>
        <input type="month" value={month} onChange={handleMonthChange} />
        <button onClick={handleSearch}>Search by Month</button>
      </div>
      {orders.map((order) => (
        <div key={order.order_id} className={styles.orderItem}>
          <h3>Order ID: {order.order_id}</h3>
          <p>User ID: {order.user_id}</p>
          <p>Total Price: {order.total_price}</p>
          <p>Created At: {new Date(order.created_at).toLocaleString()}</p>
          <p>Status: {order.status}</p>
          {order.order_details && (
            <div>
              <h4>Items:</h4>
              {order.order_details.map((detail, index) => (
                <div key={index}>
                  <p>Item ID: {detail.item_id}</p>
                  <p>Quantity: {detail.quantity}</p>
                  <p>Price: {detail.price}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Admin;
