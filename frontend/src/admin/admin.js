import React, { Fragment, useState, useEffect } from "react";
import styles from "./admin.module.css";

const Admin = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [discountTypeData, setDiscountTypeData] = useState([]);
  const [discountData, setDiscountData] = useState({
    discountType: "",
    description: "",
    startDate: "",
    duration_days: "",
    duration_hours: "",
  });

  useEffect(() => {
    const fetchDiscountType = async () => {
      try {
        const response = await fetch("http://localhost:5000/add_discount", {
          method: "GET",
          // headers: {
          //   token: localStorage.token,
          // },
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        const discountTypes = data.map((type) => type.discount_type) || [];
        setDiscountTypeData(discountTypes);
        if (discountTypes.length > 0) {
          setDiscountData((prevData) => ({
            ...prevData,
            discountType: discountTypes[0],
          }));
        } else {
          setDiscountData((prevData) => ({
            ...prevData,
            discountType: "", // Reset the discount type if no types are fetched
          }));
        }

        console.log("discountTypeData", discountTypeData);
      } catch (error) {
        console.error(
          "There was a problem fetching discount types:",
          error.message
        );
      }
    };

    fetchDiscountType();
  }, []);

  const handleSubmit = async (e) => {
    try {
      const response = await fetch("http://localhost:5000/add_discount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Remove 'Content-Type' header when using FormData
          // Add any additional headers like authentication tokens here
          //token: localStorage.token,
        },
        body: JSON.stringify(discountData),
      });

      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      console.log("Response data:", data);
    } catch (error) {
      console.error("There was a problem adding the discount:", error.message);
    }
  };
  useEffect(() => {
    const password = prompt("Enter the admin password:");
    if (password === "admin") {
      //const token = jwtGenerator(user.user_id); // Corrected variable reference
              
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password.");
    }
  }, []);

  if (!isAuthenticated) {
    return (
      <Fragment>
        {/* Displaying nothing or a message because the password was incorrect. 
        Alternatively, you could redirect them to another page. */}
        <div className={styles.adminContainer}>
          <p>Access Denied</p>
        </div>
      </Fragment>
    );
  }

  // Admin content to show if the correct password is entered
  return (
    <Fragment>
      <div className={styles.adminContainer}>
        {/* Your admin page content here */}
        <h1>Admin Dashboard</h1>
        {/* Example content */}
        <p>Welcome to the Admin Dashboard.</p>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="discount-fields">
            <div className={styles.divCategory}>
              <label htmlFor="discountType" className={styles.categorylabel}>
                {" "}
                Discount Type:
              </label>
              <select
                id="discountType"
                value={discountData.discountType}
                className={styles.select}
                onChange={(e) =>
                  setDiscountData({
                    ...discountData,
                    discountType: e.target.value,
                  })
                }
                required
              >
                {/* Assuming your enum values are in an array called discountTypeEnum */}
                {discountTypeData &&
                  discountTypeData.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
              </select>
            </div>
            <div className={styles.textarea}>
              <label htmlFor="description" className={styles.categorylabel}>
                Description:
              </label>
              <textarea
                id="description"
                value={discountData.description}
                onChange={(e) =>
                  setDiscountData({
                    ...discountData,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
            <div className={styles.divPrice}>
              <label htmlFor="startDate" className={styles.pricelabel}>
                Start Date:
              </label>
              <input
                id="startDate"
                type="date" // Use the appropriate date picker component if needed
                min={new Date().toISOString().split("T")[0]}
                value={discountData.startDate}
                onChange={(e) => {
                  const selectedDate = new Date(e.target.value);
                  setDiscountData({
                    ...discountData,
                    startDate: selectedDate.toISOString().split("T")[0],
                  });
                }}
                required
              />
            </div>
            <div className={styles.divPrice}>
              <label htmlFor="durationDays" className={styles.pricelabel}>
                Duration (Days):
              </label>
              <input
                id="durationDays"
                type="number"
                value={discountData.duration_days}
                onChange={(e) =>
                  setDiscountData({
                    ...discountData,
                    duration_days: e.target.value,
                  })
                }
                required
              />

              <label htmlFor="durationHours" className={styles.pricelabel}>
                Duration (Hours):
              </label>
              <input
                id="durationHours"
                type="number"
                value={discountData.duration_hours}
                onChange={(e) =>
                  setDiscountData({
                    ...discountData,
                    duration_hours: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
          <button type="submit" className={styles.animated_button}>
            Submit
          </button>
        </form>
       
      </div>
    </Fragment>
  );
};

export default Admin;
