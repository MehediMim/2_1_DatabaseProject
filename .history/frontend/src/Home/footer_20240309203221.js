import React, { Fragment, useState, useEffect } from "react";
import styles from './footer.module.css';


const footer = () => {
  const handleAdminPage = () => { 
    window.location = "/admin";
};

  return (
    <Fragment>
      <div className={styles.container2}>
        <div className={styles.title}> CSE216: Database Sessional Project</div>
        <div className={styles.container}>
        <div className={styles.man}>
          <div className={styles.maintitle}>MD MEHEDI HASAN MIM</div>
          <div className={styles.title}>
            <a href="https://github.com/MehediMim" target="_blank" rel="noopener noreferrer" className={styles.link}>
              GitHub Link
            </a>
          </div>
          <div className={styles.title}>Department Of Computer Science And Engineering</div>
          <div className={styles.title}>Bangladesh University Of Engineering And Technology</div>
          <div className={styles.title}>Student Id: 2105142</div>
        </div>
        <div className={styles.man}>
          <div className={styles.maintitle}>MD SHADMAN ABID</div>
          <div className={styles.title}>
            <a href="https://github.com/Shadman2024/" target="_blank" rel="noopener noreferrer" className={styles.link}>
              GitHub Link
            </a>
          </div>
          <div className={styles.title}>Department Of Computer Science And Engineering</div>
          <div className={styles.title}>Bangladesh University Of Engineering And Technology</div>
          <div className={styles.title}>Student Id: 2105124</div>
        </div>
      </div>
      <center>
                            <button onClick={handleAdminPage}>Admin</button>
                            </center>
      </div>
    </Fragment>
  );
};

export default footer;
