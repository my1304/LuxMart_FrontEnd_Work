import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import styles from "../../styles/CustomBank.module.css";

// Основной компонент, который рендерит модальное окно и управляет его состоянием
const bankPay = (Parameter, onSubmit) => {
  const banktContainer = document.createElement('div');
  document.body.appendChild(banktContainer);

  // Функция для закрытия модального окна и удаления контейнера из DOM
  const handleAlertClose = () => {
    ReactDOM.unmountComponentAtNode(banktContainer); // Удаление компонента из DOM
    document.body.removeChild(banktContainer); // Удаление контейнера из DOM
  };

  // Компонент для отображения модального окна с полями ввода и кнопками
  const ModalCustom = ({ Parameter, onClose, onSubmit }) => {
    const [formData, setFormData] = useState({
      absender: '',
      post: '',
      bankName: '',
      cart: '',
    });

    // Обработка изменения значений полей ввода
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    };

    // Обработка нажатия кнопки OK
    const handleOk = () => {
      // Передаем данные массивом через onSubmit и закрываем окно
      onSubmit([formData.absender,formData.post, formData.bankName, formData.cart]);
      onClose();
    };

    // Обработка нажатия кнопки Cancel
    const handleCancel = () => {
      onClose(); // Закрыть окно без передачи данных
    };

    return (
      <div className={styles.overlay}>
        <div className={styles.worktBox}>
          <div className={styles.titleBar}>
            <button className={styles.closeBtn} onClick={onClose}>
              &times;
            </button>
          </div>
          <div className={styles.contentArea}>
            <h2 className={styles.alertText}>List for Bank Information: {Parameter}</h2>
            
            {/* Поля ввода */}
            <form>
              <div className={styles.inputGroup}>
                <label htmlFor="absender">Absender:</label>
                <input
                  type="text"
                  name="absender"
                  id="absender"
                  value={formData.absender}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="post">Post:</label>
                <input
                  type="text"
                  name="post"
                  id="post"
                  value={formData.post}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="bankName">Bank Name:</label>
                <input
                  type="text"
                  name="bankName"
                  id="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.inputGroup}>
                <label htmlFor="cart">Cart:</label>
                <input
                  type="text"
                  name="cart"
                  id="cart"
                  value={formData.cart}
                  onChange={handleChange}
                />
              </div>
            </form>
            
            {/* Кнопки OK и Cancel */}
            <div className={styles.buttonGroup}>
              <button className={styles.okBtn} onClick={handleOk}>OK</button>
              <button className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  ModalCustom.propTypes = {
    Parameter: PropTypes.string.isRequired, // Параметр, передаваемый в модальное окно
    onClose: PropTypes.func.isRequired, // Функция для закрытия окна
    onSubmit: PropTypes.func.isRequired, // Функция для передачи данных
  };

  // Рендерим модальное окно в alertContainer
  ReactDOM.render(
    <ModalCustom Parameter={Parameter} onClose={handleAlertClose} onSubmit={onSubmit} />,
    banktContainer
  );

  return null;
};

// Типы пропсов для основного компонента
bankPay.propTypes = {
  Parameter: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired, // Функция для передачи данных в родительский компонент
};

export default bankPay;