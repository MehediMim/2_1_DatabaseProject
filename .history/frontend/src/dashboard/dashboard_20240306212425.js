import React, { Fragment, useState, useEffect } from 'react';
import styles from './dashboard.module.css'
import dp from '../dashboard/dp.png'
import {firebaseApp,storage} from '../firebase'
import {ref , uploadBytesResumable  , getDownloadURL} from 'firebase/storage';
const Dashboard = ({ setAuth }) => {

    const [formData, setFormData] = useState({
        first_name: "",
        middle_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        optionalPhone: "",
        photo_url: ""
    });


    const { first_name, middle_name, last_name, email, phone_number, optionalPhone ,photo_url } = formData;
    const getProfile = async () => {
        try {
            const res = await fetch("http://localhost:5000/dashboard/", {
                method: "GET",
                headers: {
                    token: localStorage.token
                }
            });
            const parseData = await res.json();
            //   console.log(parseData);
            if (res.ok) {
                // console.log(res.phone_number);
                setFormData({
                    first_name: parseData.first_name ,
                    middle_name: parseData.middle_name,
                    last_name: parseData.last_name,
                    email: parseData.email,
                    phone_number: parseData.phone_number,
                    optionalPhone: parseData.phone_number2,
                    photo_url: parseData.photo_url
                    // password field is not updated since it's not typically included in profile data
                });
            } else {
                // Handle any errors, such as unauthorized access
                console.error("Failed to fetch profile data");
            }
            console.log(parseData);
            //   setName(parseData.user_name);
        } catch (err) {
            console.error(err.message);
        }
    };
    useEffect(() => {
        getProfile();
    }, []);

    const logout = (e) => {
        e.preventDefault(); // Prevent form submission if it's inside a form
        localStorage.removeItem('token'); // Assuming the token is stored with the key 'token'
        setAuth(false); // Set the authentication state to false
    };
//////shadman abid////////////////////////////////////////////////////////
const [isEditing, setIsEditing] = useState(false);
const [isPicediting, setIsPicEditing] = useState(false);
const handleEdit = () => {
    setIsEditing(true);
};

const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
};


const handleImgchange = async (event) => {
    const file = event.target.files[0];
     const  storageRef = ref(storage, 'profile_pictures/' + file.name);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed',(snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
           
        } , (error) => {
            console.log(error.message);
        } , () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                console.log('File available at', downloadURL);
                setFormData({ ...formData, photo_url: downloadURL });
            });
        }
        );
     setIsPicEditing(false);
};


const handleSubmit = async (event) => {
    event.preventDefault();
    setIsEditing(false);
    try {
        const response = await fetch('http://localhost:5000/update_profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            token: localStorage.token
          },
          body: JSON.stringify(formData)
        });
    
        const parseRes = await response.json();
        //console.log(parseRes);
        if(parseRes) window.location = "/dashboard";
      } catch (err) {
        console.error(err.message);
      }
};


    return (
        <div>
            <div class={styles.container}>
                <div className={styles.user_info}>
                    <h2 className={styles.title}>Personal Information</h2>
                    <div>
                        {
                            isPicediting? (
                                <div>
                                    <input type="file"  onChange={handleImgchange}/>
                                   
                                </div>
                            ):(
                                <img src={photo_url} alt="User photo" className={styles.user_photo}></img>
                            )
                        }
                    </div>
                    <div>
                       
                        {
                            isEditing ? (
                                <div>
                                      <button className={styles.animated_button} onClick={handleSubmit}
                                      
                                      >SAVE</button>

                                      <button className={styles.animated_button} onClick={() => setIsPicEditing(true)}> Change Profile Picturet</button>
                                </div>
                                  
                            ):(
                                <div>
                                    <button className={styles.animated_button} onClick={handleEdit}>EDIT</button>
                                    <button className={styles.animated_button} onClick={() => window.location='/enlistItem'}>Enlist Item</button>
                                </div>
                                
                            )
                        }
                    </div>
                        {
                            isEditing ? (
                                <div>
                                <form onSubmit={handleSubmit}>
                                  <label>
                                    First Name:
                                    <input className='input_field' name='first_name' value={first_name} onChange={handleChange} />
                                  </label>
                                  <label>
                                    Middle Name:
                                    <input className='input_field' name='middle_name' value={middle_name} onChange={handleChange} />
                                  </label>
                                  <label>
                                    Last Name:
                                    <input className='input_field' name='last_name' value={last_name} onChange={handleChange} />
                                  </label>
                                  <label>
                                    Email:
                                    <input className='input_field' name='email' value={email} disabled />
                                  </label>
                                  <label>
                                    Phone:
                                    <input className='input_field' name='phone_number' value={phone_number} disabled />
                                  </label>
                                  <label>
                                    Optional Phone:
                                    <input className='input_field' name='optionalPhone' value={optionalPhone} onChange={handleChange} />
                                  </label>
                                </form>
                              </div>
                             ):(
                        
                        <div>
                        <div className={styles.userDetail}>
                        <strong className={styles.detailLabel}>FULL NAME:</strong>
                         <span className={styles.detailValue}>
                         {(first_name !== null && first_name !== ' ') ? first_name : ''} 
                         {(middle_name !== null && middle_name !== ' ') ? ` ${middle_name}` : ''} 
                         {(last_name !== null && last_name !== ' ') ? ` ${last_name}` : ''}
                         </span>
                        </div>
                         <div className={styles.userDetail}>
                        <strong className={styles.detailLabel}>EMAIL:</strong>
                        <span className={styles.detailValue}>{email}</span>
                         </div>
                         <div className={styles.userDetail}>
                        <strong className={styles.detailLabel}>PHONE:</strong>
                        <span className={styles.detailValue}>{phone_number}</span>
                    </div>
                    <div className={styles.userDetail}>
                        <strong className={styles.detailLabel}>OPTIONAL PHONE:</strong>
                        <span className={styles.detailValue}>{optionalPhone}</span>
                    </div>
                    </div>
                            )
                        }
                    <button className={styles.animated_button} onClick={logout}>LOG OUT</button>
                </div>

                <div class={styles.order_info}>
                    <h2 className={styles.title}>Order Information</h2>
                    <p><strong>Order ID:</strong> 123456</p>
                    <p><strong>Item:</strong> Example Item</p>
                    <p><strong>Selling Price:</strong> $100</p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard; 
