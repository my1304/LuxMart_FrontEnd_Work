import React from 'react';
import PropTypes from 'prop-types';
import styles from "../../styles/Orders.module.css";

const ModalCustom = ({ Parameter, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.worktBox}>
        <div className={styles.titleBar}>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.contentArea}>
          <h2>List for Parameter: {Parameter}</h2>
          {/* Здесь рендеринг данных заказов, загруженных из Redux */}
        </div>
      </div>
    </div>
  );
};

ModalCustom.propTypes = {
  usParametererId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalCustom;