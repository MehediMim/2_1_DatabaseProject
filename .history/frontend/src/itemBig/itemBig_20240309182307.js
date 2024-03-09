import React, { useEffect, useState, Fragment } from 'react';
import styles from './itemBig.module.css';
import defaultImage from "../Item/itemMini.webp";
import { useLocation } from 'react-router-dom';
import _mini_miniItemPage from '../Item/_mini_miniItemPage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faStar, faThumbsDown, faDollarSign, faCircleChevronRight, faCircleChevronLeft, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
const ItemBig = () => {
    const [messageToSend, setMessageToSend] = useState('');
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const location = useLocation();
    const [showMessageInput, setShowMessageInput] = useState(false);
    const navigate = useNavigate();
    const [itemDetails, setItemDetails] = useState({
        item_id: '',
        item_name: '',
        description: '',
        image: '',
        price: '',
        category_name: '',
        subcategory_name: '',
        user_id: '',
        seller_name: '',
        email: '',
        phone_number: '',
        average_rating: '',
        unsplashImages: [],
        currentImageIndex: 0,
        reviews: [],
    });
    const { item } = location.state;
    const { item_id } = item.item_id;
    const [recommendedItems, setRecommendedItems] = useState([]);
    console.log(item.item_id);

    useEffect(() => {
        const fetchItemDetailsAndReviews = async () => {
            try {
                const { item } = location.state;
                // Fetch item details
                const detailsResponse = await fetch(`http://localhost:5000/additem/getDetails/${item.item_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: localStorage.token,
                    },
                });
    
                if (!detailsResponse.ok) {
                    throw new Error('Failed to fetch item details');
                }
                const detailsData = await detailsResponse.json();
    
                // Fetch item reviews
                const reviewsResponse = await fetch(`http://localhost:5000/additem/getreviews/${item.item_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: localStorage.token,
                    },
                });
    
                if (!reviewsResponse.ok) {
                    throw new Error('Failed to fetch item reviews');
                }
                const reviewsData = await reviewsResponse.json();
    
                // Combine item details with reviews
                const combinedData = {
                    ...detailsData,
                    reviews: reviewsData.reviews || [],
                };
    
                setItemDetails(prevDetails => ({ ...prevDetails, ...combinedData }));
            } catch (error) {
                console.error('Error:', error);
            }
        };
    
        // Call the function immediately to ensure data is fetched on component mount
        if (item && item.item_id) {
            fetchItemDetailsAndReviews();
    
            // Set up an interval to refresh the data automatically
            const intervalId = setInterval(fetchItemDetailsAndReviews, 3); // Refresh every 30 seconds
    
            // Clear the interval when the component unmounts
            return () => clearInterval(intervalId);
        }
    }, [item.item_id]); // Dependencies array, useEffect will re-run if item.item_id changes
    

    useEffect(() => {
        const fetchItemDetails = async () => {
            try {

            } catch (error) {
                console.error('Error:', error);
            }
        };

        const fetchRecommendedItems = async (category_name) => {
            try {
                const response = await fetch(`http://localhost:5000/additem/getitems/${category_name}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: localStorage.token,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch recommended items');
                }
                const data = await response.json();
                setRecommendedItems(data);
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (item.item_id) {
            fetchItemDetails();
            // Call fetchRecommendedItems after itemDetails is set
            // For this example, let's assume itemDetails includes a category_name once fetched
            fetchRecommendedItems(itemDetails.category_name);
        }
    }, [item.item_id, itemDetails.category_name]); // Ensure effect runs when category_name changes


    useEffect(() => {
        const fetchItemDetails = async () => {
            try {
                const { item } = location.state;
                console.log("II ", item.item_id);
                const response = await fetch(`http://localhost:5000/additem/getDetails/${item.item_id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        token: localStorage.token,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch item details');
                }
                const data = await response.json();
                setItemDetails(prevDetails => ({ ...prevDetails, ...data }));
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (item.item_id) {
            fetchItemDetails();
        }
    }, [item.item_id]);


    useEffect(() => {
        const fetchUnsplashImages = async () => {
            if (!itemDetails.item_name) return; // Ensure there's a name to search for

            const accessKey = 'uG-SeNJmzLR11udbsR_y8x_qP-1aZZSK9GmiZmi3haQ';
            const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(itemDetails.item_name)}&client_id=${accessKey}&per_page=4`;

            try {
                const response = await fetch(url);
                const data = await response.json();
                const imageUrls = data.results.map(result => result.urls.regular);
                setItemDetails(prevDetails => ({
                    ...prevDetails,
                    unsplashImages: imageUrls,
                }));
                console.log(response);
            } catch (error) {
                console.error('Error fetching images from Unsplash:', error);
            }
        };

        fetchUnsplashImages();
    }, [itemDetails.item_name]);


    const defaultQuantity = 1;
    const addToCart = async () => {
        const token = localStorage.getItem('token');

        try {
            const response = await fetch(`http://localhost:5000/items/cart/add/${item.item_id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                },
                body: JSON.stringify({
                    quantity: defaultQuantity
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            alert('Item added to cart successfully');
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleButtonClick = () => {
        if (isAuthenticated) {
            addToCart(item.id, defaultQuantity);
        } else {
            window.location.href = '/login';
        }
    };
    const renderStars = (rating) => {
        let stars = [];

        for (let i = 0; i < rating; i++) {
            stars.push(<FontAwesomeIcon icon={faStar} style={{ color: "#ec648a", }} />);
        }
        for (let i = rating; i < 5; i++) {
            stars.push(<FontAwesomeIcon icon={faStar} style={{ color: "#d7c0ed", }} />);
        }
        return stars;
    };
    const handleNextImage = () => {
        setItemDetails(prevDetails => ({
            ...prevDetails,
            currentImageIndex: (prevDetails.currentImageIndex + 1) % prevDetails.unsplashImages.length,
        }));
    };
    const handleMessageSend = async () => {
        if (!messageToSend.trim()) {
            alert("Please enter a message.");
            return; // Don't send an empty message
        }

        const sellerUserId = itemDetails.user_id; // Extracting the seller's user ID from itemDetails
        const formattedMessage = `[${itemDetails.item_name} (ID: ${itemDetails.item_id})]: ${messageToSend}`;
        try {
            const response = await fetch(`http://localhost:5000/messages/send`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Assuming the authorization token is stored under the key 'token' in localStorage
                    token: localStorage.token,
                },
                body: JSON.stringify({
                    user_id_receiver: sellerUserId, // Sending as user_id_receiver
                    message: formattedMessage // The message text
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to send message to the seller');
            }

            alert('Message sent successfully to the seller.');
            setMessageToSend(''); // Clear the input field after sending the message
            setShowMessageInput(false); // Optionally, hide the message input box
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message to the seller.');
        }
    };

    const handleItemClick = (item) => {
        navigate('/itemExpand', { state: { item } });
    };

    const handleVote = async (userId, itemId, voteType) => {
        try {
            const response = await fetch(`http://localhost:5000/additem/vote`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'token': localStorage.token,
                },
                body: JSON.stringify({
                    user_id: userId,
                    item_id: itemId,
                    vote_type: voteType, // 'upvote' or 'downvote'
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to register vote');
            }

            console.log('Vote registered successfully');

        } catch (error) {
            console.error('Error:', error);
        }
    };


    const handleprevImage = () => {
        setItemDetails(prevDetails => ({
            ...prevDetails,
            currentImageIndex: (prevDetails.currentImageIndex - 1) % prevDetails.unsplashImages.length,
        }));
    };
    console.log(item);
    return (
        <div className={styles.maincontainer}>

            <div className={styles.container}>
                <div className={styles.containerleft}>
                    <img
                        src={itemDetails.unsplashImages[itemDetails.currentImageIndex] || defaultImage}
                        alt={item.name}
                        className={styles.image}
                    />
                    <div className={styles.changebuttons}>
                        {itemDetails.unsplashImages.length > 1 && (
                            <button onClick={handleprevImage} ><FontAwesomeIcon icon={faCircleChevronLeft} size="2xl" style={{ color: "#ffffff", }} /></button>
                        )}
                        {itemDetails.currentImageIndex + 1}/{itemDetails.unsplashImages.length}
                        {itemDetails.unsplashImages.length > 1 && (
                            <button onClick={handleNextImage} ><FontAwesomeIcon icon={faCircleChevronRight} size="2xl" style={{ color: "#ffffff", }} /></button>
                        )}
                    </div>
                </div>
                <div className={styles.containermiddle}>
                    <h2>{item.name}</h2>
                    <div className={styles.itemrating}>
                        {itemDetails && renderStars(itemDetails.average_rating)}
                    </div>
                    <div className={styles.discounted_price}> ${itemDetails.discounted_price}</div>
                    <div className={styles.old_price}>
                        <div className={styles.lined}>${itemDetails.old_price}</div>
                        <div>-{itemDetails.discount}%</div>
                    </div>
                    <p>Quantity: {item.quantity}</p>
                    <button className={styles.animated_button} onClick={handleButtonClick}>
                        {isAuthenticated ? 'Add to Cart' : 'Log In To Add To Cart'}
                    </button>
                    <br></br>
                    <br></br>
                    <br></br>
                    <br></br>
                    <div className={styles.messageInputContainer}>
                        <input
                            type="text"
                            className={styles.messageInput}
                            placeholder="Type your message here..."
                            value={messageToSend}
                            onChange={(e) => setMessageToSend(e.target.value)}
                        />
                    </div>
                    <button className={styles.animated_button} onClick={handleMessageSend}>
                        {'Chat With The Seller'}
                    </button>

                </div>
                <div className={styles.containerright}>
                    <div className={styles.sellerdetails}>
                        <h4>Sold By:</h4>
                        <h4>{itemDetails.seller_name}</h4>
                        <button className={styles.animated_button} onClick={handleButtonClick}>
                            {'Report'}
                        </button>
                        <h4>positive Seller Ratings</h4>
                        <div className={styles.seller_rating}>{itemDetails.user_rating * 20}%</div>
                        <div className={styles.seller_allgoods}>All Goods</div>
                    </div>
                </div>
            </div>
            <div className={styles.container2}>
                <div className={styles.container2left}>
                    <div>
                        <div className={styles.title}>
                            <h3>Product details of {itemDetails.item_name}</h3>
                        </div>
                        <div>{itemDetails.description}</div>
                        <br></br>
                        <br></br>
                    </div>
                    <div>
                        <div className={styles.title}>
                            <h3>Ratings & Reviews</h3>
                        </div>
                        <div className={styles.reviewsContainer}>
                            {itemDetails.reviews.length > 0 ? itemDetails.reviews.map((review, index) => (
                                <div key={index} className={styles.review}>

                                    <div className={styles.reviewerName}>{review.reviewer_name}</div>
                                    <div className={styles.reviewRating}>
                                        {review.star_rating && renderStars(review.star_rating)}
                                    </div>
                                    <div className={styles.reviewContent}>{review.content}</div>
                                    <div className={styles.voteButtons}>
                                        <button onClick={() => handleVote(review.user_id, review.item_id, 'upvote')} className={styles.votes}><FontAwesomeIcon icon={faThumbsUp} size="2xl" /> {review.upvotes}</button>
                                        <button onClick={() => handleVote(review.user_id, review.item_id, 'downvote')} className={styles.votes}><FontAwesomeIcon icon={faThumbsDown} size="2xl" /> {review.downvotes}</button>
                                    </div>
                                </div>
                            )) : <p>No reviews available</p>}

                        </div>
                    </div>
                </div>
                <div className={styles.container2right}>
                    <div className={styles.title}>
                        <h3>You May Want To See</h3>
                    </div>
                    <div className={styles.contItem}>
                        {recommendedItems.length > 0 ? recommendedItems.map((recommendedItem, index) => (
                            <div className={styles.item} key={index} onClick={() => handleItemClick(recommendedItem)}>
                                <_mini_miniItemPage
                                    item_id={recommendedItem.item_id}
                                    image={recommendedItem.image} // Assuming a valid image link is always provided
                                    name={recommendedItem.name}
                                    price={recommendedItem.price}
                                    discount={recommendedItem.discount}
                                />
                            </div>
                        )) : <p>No recommendations available</p>}
                    </div>
                </div>

            </div>
        </div >
    );
};

export default ItemBig;
