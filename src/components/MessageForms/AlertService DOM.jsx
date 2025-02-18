import React from 'react';
import ReactDOM from 'react-dom/client';
import PropTypes from 'prop-types';
import styles from "../../styles/AlertService.module.css";

// Основной компонент для показа алерта
const showAlert = (message) => {
  // Создаем контейнер для модального окна
  const alertContainer = document.createElement('div');
  document.body.appendChild(alertContainer);

  // Создаем корневой элемент для React с использованием createRoot
  const root = ReactDOM.createRoot(alertContainer);

  // Функция для закрытия модального окна и удаления контейнера из DOM
  const handleAlertClose = () => {
    // Корректное размонтирование компонента
    root.unmount();
    // Удаление контейнера из DOM
    if (alertContainer.parentNode) {
      alertContainer.parentNode.removeChild(alertContainer);
    }
  };

  // Компонент для отображения модального окна
  const CustomAlert = ({ message, onClose }) => {
    return (
      <div className={styles.overlay}>
        <div className={styles.worktBox}>
          <div className={styles.titleBar}>
            <button className={styles.closeBtn} onClick={onClose}>
              &times;
            </button>
          </div>
          <div className={styles.alertBox}>
            <p className={styles.alertText}>{message}</p>
            <br />
            <button className={styles.btn} onClick={onClose}>Ok</button>
          </div>
        </div>
      </div>
    );
  };

  CustomAlert.propTypes = {
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func.isRequired,
  };

  // Рендерим модальное окно в alertContainer
  root.render(
    <CustomAlert message={message} onClose={handleAlertClose} />
  );
};

export default showAlert;