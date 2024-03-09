import React, { useState, useEffect } from 'react';
import styles from './orders.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [ordersByStatus, setOrdersByStatus] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await fetch('http://localhost:5000/orders/', {
          method: "GET",
          headers: { token },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const jsonData = await response.json();
        // setOrders(jsonData);
        organizeOrdersByStatus(jsonData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);
  const organizeOrdersByStatus = (orders) => {
    const organized = orders.reduce((acc, order) => {
      (acc[order.status] = acc[order.status] || []).push(order);
      return acc;
    }, {});
    setOrdersByStatus(organized);
  };

  const renderStars = (rating) => {
    let stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<FontAwesomeIcon key={i} icon={faStar} />);
    }
    for (let i = rating; i < 5; i++) {
      stars.push(<FontAwesomeIcon key={i + 5} icon={faStar} style={{ color: "#d7c0ed" }} />);
    }
    return stars;
  };

  const submitReview = async (item_id, content, star_rating) => {
    // const token = localStorage.getItem('token');
    console.log(item_id);
    console.log(content);
    console.log(star_rating);
    try {
      const response = await fetch('http://localhost:5000/additem/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          token:localStorage.token,
        },
        body: JSON.stringify({
          item_id: item_id,
          content: content,
          star_rating: star_rating,
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Handle successful review submission here (e.g., show a message)
    } catch (error) {
      console.error('Error submitting review:', error);
    }
  };

  const unicodeStars = (count) => {
    const starSymbol = '★'; // Unicode character for a solid star
    return starSymbol.repeat(count);
  };

  return (

    <div className={styles.orders_container}>
      <h2 className={styles.title}>My Orders</h2>
      {Object.entries(ordersByStatus).map(([status, orders]) => (
        <div key={status} className={styles.statusSection}>
          <div className={styles.title}>{status.charAt(0).toUpperCase() + status.slice(1)}</div>
          {orders.map((order) => (
            <div key={order.id} className={styles.order}>
              <div className={styles.newiv}><h4>Order #{order.id} - Status: {order.status}</h4></div>
              <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
              <p>Total Price: ${Number(order.total_price).toFixed(2)}</p>
              {order.status === "delivered" && (
                order.items.map((item, index) => (
                  <div key={index} className={styles.reviewSection}>
                    <p>{item.name} - Quantity: {item.quantity} - Price: ${Number(item.price).toFixed(2)}</p>
                    <input type="text" placeholder="Write a review..." onChange={(e) => item.content = e.target.value} />
                    <select className={styles.star} onChange={(e) => item.star_rating = parseInt(e.target.value, 10)} defaultValue={0}>
                      <option value={0} disabled>Rate...</option>
                      {[1, 2, 3, 4, 5].map(star => <option key={star} value={star}>{unicodeStars(star)}</option>)}
                    </select>
                    <button onClick={() => submitReview(item.item_id, item.content, item.star_rating)}>Submit Review</button>
                  </div>
                ))
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Orders;
