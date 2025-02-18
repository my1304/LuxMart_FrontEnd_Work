import React from "react";
import PropTypes from "prop-types";
import styles from "../../styles/CustomBank.module.css";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/user/userSlice"; // Исправленный импорт

const LogoutUser = ({ userData, onConfirm, onClose }) => {
  const dispatch = useDispatch();

  const handleConfirm = async () => {
    try {
      // Вызов logoutUser для выполнения логаута
      await dispatch(logoutUser()).unwrap(); // Используем unwrap для обработки возможных ошибок
      await onConfirm();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.dialogBox}>
        <div className={styles.titleBar}>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.contentArea}>
          <h2 className={styles.alertText}>
            You want to exit! {userData?.username}!
          </h2>
          <div className={styles.buttonGroup}>
            <button className={styles.okBtn} onClick={handleConfirm}>
              Yes
            </button>
            <button className={styles.cancelBtn} onClick={onClose}>
              Exit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

LogoutUser.propTypes = {
  userData: PropTypes.object.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default LogoutUser;
