import React, { useState, useEffect } from "react";
import styles from "./addItem.module.css";

function ItemSaleForm() {
  const [item, setItem] = useState({
    itemName: "",
    itemDescription: "",
    itemPrice: "",
    itemImage: "",
    itemCategory: "",
    itemSubcategory: "",
  });
  const {
    itemName,
    itemDescription,
    itemPrice,
    itemImage,
    itemCategory,
    itemSubcategory,
  } = item;
  const [categories, setCategories] = useState(["Add New Category..."]);
  const [subcategories, setSubcategories] = useState([]);
  const [showSubcategoryInput, setShowSubcategoryInput] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "itemCategory") {
      if (value === "Add New Category...") {
        const newCategory = prompt("Enter the name of the new category:");
        if (newCategory && !categories.includes(newCategory)) {
          // Add the new category and update the item's category
          const updatedCategories = [...categories, newCategory].sort();
          setCategories(updatedCategories);
          setItem((prevItem) => ({
            ...prevItem,
            itemCategory: newCategory,
            itemSubcategory: "",
          }));

          // Reset the subcategories to only include the option to add a new one
          // This no longer automatically prompts for a new subcategory
          setSubcategories(["Add New Subcategory..."]);
        }
      } else {
        // Existing category selected, reset subcategory
        setItem((prevItem) => ({
          ...prevItem,
          [name]: value,
          itemSubcategory: "",
        }));
      }
    } else if (name === "itemSubcategory") {
      if (value === "Add New Subcategory...") {
        // Optionally keep or adjust this part if you want a different flow for adding new subcategories
        // For example, showing an input field directly in the form instead of using a prompt
      } else {
        // Subcategory selected
        setItem((prevItem) => ({ ...prevItem, itemSubcategory: value }));
      }
    } else {
      // Handle changes for other input fields
      setItem((prevItem) => ({ ...prevItem, [name]: value }));
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/addItem/getCategory"
        );
        if (!response.ok)
          throw new Error(
            `Network response was not ok: ${response.statusText}`
          );
        const data = await response.json();
        setCategories(
          [...data.map((cat) => cat.name), "Add New Category..."].sort()
        );
      } catch (error) {
        console.error("There was a problem fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (item.itemCategory && item.itemCategory !== "Add New Category...") {
        try {
          const response = await fetch(
            `http://localhost:5000/addItem/getSubcategory/${item.itemCategory}`
          );
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          // Always include "Add New Subcategory..." option
          setSubcategories([...data, "Add New Subcategory..."]);
        } catch (error) {
          console.error("There was a problem fetching subcategories:", error);
          setSubcategories(["Add New Subcategory..."]); // Ensure the option is present even on fetch failure
        }
      } else {
        setSubcategories(["Add New Subcategory..."]); // Reset or initialize
      }
    };

    fetchSubcategories();
  }, [item.itemCategory]);

  //shadman Abid //////////////////////////////////////////////////////////////
    const [isDiscount, setDiscount] = useState(false);
    const [discountTypeData, setDiscountTypeData] = useState([]);
     const [discountData, setDiscountData] = useState({
    discountType: "",
    description: "",
    startDate: "",
    duration: "",
  });

    const handleAddDiscount = () => { 
        // try {
        //     const res = await fetch('http://localhost:5000/add_discount', {
        //         method: 'GET',
        //         headers: {
        //             token: localStorage.token
        //         }
        //     });
        //     const resData = await res.json();
        //     console.log('resData', resData);
        //     if (res.ok) {
        //         setDiscountTypeData();
        //   }
          setDiscount(true);

        // }catch(error){
        //     console.error( error.message);
        // }


  };
  
  useEffect(() => { 
    const fetchDiscountType = async () => {
      try {
        const response = await fetch('http://localhost:5000/add_discount', {
          method: 'GET',
          headers: {
            token: localStorage.token
          }
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setDiscountTypeData(data.map((type) => type.discount_type)  || []);
        console.log('discountTypeData', discountTypeData);
      } catch (error) {
        console.error('There was a problem fetching discount types:', error.message);
      }
    };

    fetchDiscountType();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      itemName,
      itemDescription,
      itemPrice,
      itemImage,
      itemCategory,
      itemSubcategory,
    };
    try {
      const response = await fetch("http://localhost:5000/addItem/addItem", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Remove 'Content-Type' header when using FormData
          // Add any additional headers like authentication tokens here
          token: localStorage.token,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
    } catch (error) {
      console.error("There was a problem adding the item:", error);
      // Handle errors here
    }
  };

  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Add Your Item for Sale</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {/* Item Name */}
        <div className={styles.divName}>
          <label htmlFor="itemName" className={styles.namelabel}>
            Item Name:
          </label>
          <input
            type="text"
            name="itemName"
            value={item.itemName}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        {/* Item Description */}
        <div className={styles.divDescription}>
          <label htmlFor="itemDescription" className={styles.descriptionlabel}>
            Item Description:
          </label>
          <input
            type="text"
            name="itemDescription"
            value={item.itemDescription}
            onChange={handleChange}
            required
            className={styles.textarea}
          />
        </div>

        {/* Item Price */}
        <div className={styles.divPrice}>
          <label htmlFor="itemPrice" className={styles.pricelabel}>
            Price:
          </label>
          <input
            type="number"
            name="itemPrice"
            value={item.itemPrice}
            onChange={handleChange}
            required
            className={styles.input}
          />
        </div>

        {/* Item Image */}
        <div className={styles.divImage}>
          <label htmlFor="itemImage" className={styles.imagelabel}>
            Upload Image:
          </label>
          <input
            type="text"
            name="itemImage"
            placeholder="Upload minimum 1 & maximum 5 images"
            value={item.itemImage}
            onChange={handleChange}
            className={styles.inputFile}
          />
        </div>

        {/* Item Category */}
        <div className={styles.divCategory}>
          <label htmlFor="itemCategory" className={styles.categorylabel}>
            Category:
          </label>
          <select
            name="itemCategory"
            value={item.itemCategory}
            onChange={handleChange}
            className={styles.select}
            required
          >
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Item Subcategory */}
        {subcategories.length > 0 && (
          <div className={styles.divsubcategory}>
            <label
              htmlFor="itemSubcategory"
              className={styles.subcategorylabel}
            >
              Subcategory:
            </label>
            <select
              name="itemSubcategory"
              value={item.itemSubcategory}
              onChange={handleChange}
              className={styles.select}
              required
            >
              {subcategories.map((subcategory, index) => (
                <option key={index} value={subcategory}>
                  {subcategory}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add discount*/}
        <div>
          {isDiscount ? (
            <div className="discount-fields">
              <div className={styles.divCategory}>
              <label htmlFor="discountType" className={styles.categorylabel}> Discount Type:</label>
              <select
                id="discountType"
                  value={discountData.discountType}
                  className={styles.select}
                onChange={(e)=> setDiscountData({ ...discountData, discountType: e.target.value }) }
                required
              >
                {/* Assuming your enum values are in an array called discountTypeEnum */}
                {discountTypeData && discountTypeData.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              </div >
              <div  className={styles.textarea}>
              <label htmlFor="description" className={styles.categorylabel}>Description:</label>
              <textarea
                id="description"
                  value={discountData.description}
               
                onChange={(e) => setDiscountData({ ...discountData, description: e.target.value })}
                required
              />
              </div>
              <label htmlFor="startDate">Start Date:</label>
              <input
                id="startDate"
                type="date" // Use the appropriate date picker component if needed
                value={discountData.startDate}
                onChange={(e) => setDiscountData({ ...discountData, startDate: e.target.value })}
                required
              />
              <input
                id="duration"
                type="number"
                value={discountData.duration}
                onChange={(e) => setDiscountData({ ...discountData, duration: e.target.value })}
                required
              />
            </div>
          ) : (
            <div className="add-discount-btn">
              <button onClick={handleAddDiscount} className={styles.animated_button}>Add Discount</button>
            </div>
          )}
        </div>
        <button className={styles.animated_button} >Submit</button>
      </form>
    </div>
  );
}

export default ItemSaleForm;

// import React from 'react';

// function ItemSaleForm() {
//     const handleClick = async () => {
//         try {
//             const response = await fetch('http://localhost:5000/addItem/addItem', {
//                 method: 'POST',
//                 headers: {
//                     token: localStorage.token // Ensure your server is configured to handle this token correctly
//                 }
//             });

//             if (!response.ok) {
//                 throw new Error('Network response was not ok');
//             }

//             const data = await response.json();
//             console.log('Response data:', data);
//         } catch (error) {
//             console.error('There was a problem with the fetch operation:', error);
//         }
//     };

//     return (
//         <div>
//             <button onClick={handleClick}>Send POST Request</button>
//         </div>
//     );
// }

// export default ItemSaleForm;
