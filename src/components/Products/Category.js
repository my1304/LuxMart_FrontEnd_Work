import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import styles from "../../styles/Category.module.css";
import showAlert from "../MessageForms/AlertService";
import { actionCategory } from "../../features/products/categoriesSlice";
import { Category_URL } from "../../utils/constants";

const Category = ({ userData, category, onClose, onSave, action }) => {
  const [localName, setLocalName] = useState(category.name); // Локальное имя
  const [localImage, setLocalImage] = useState(category.image); // Локальное изображение
  const [isEditing, setIsEditing] = useState(false); // Режим редактирования
  const dispatch = useDispatch(); // Для отправки действий Redux

  useEffect(() => {
    // Сброс значений при изменении категории
    setLocalName(category.name);
    setLocalImage(category.image);
  }, [category]);

  const handleAction = async () => {
    if (await showAlert("Do you want to save changes?", "Yes", "No")) {
      try {
        const result = await dispatch(
          actionCategory({
            id: action === "add" ? "add" : category.id,
            name: localName,
            image: localImage,
          })
        );
        if (actionCategory.fulfilled.match(result)) {
          //const savedId = result.payload?.id || category.id; // Убедитесь, что `payload` содержит `id`
          onSave({ id: result.payload?.id || category.id, name: localName, image: localImage });
          console.log("Changes saved successfully!");
        } else {
          alert("Error saving changes: " +(result.payload?.message || "Unknown error"));
        }
      } catch (err) {
        alert("Network error occurred: " + err.message);
      }
    }
  };
  const handleOk = () => {
    if (localName !== category.name || localImage !== category.image) {
      handleAction(); // Если есть изменения, вызываем handleAction
    }
    onClose(); // Закрываем окно
  };
  /*const handleDoubleClickName = () => {
    setIsEditing(true); // Включить режим редактирования имени
  };*/

  const handleNameChange = (e) => {
    setLocalName(e.target.value); // Обновить локальное имя
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      // Вернуть первоначальное значение имени
      setLocalName(category.name);
      setIsEditing(false);
    } else if (e.key === "Enter") {
      // Сохранить изменения имени
      setIsEditing(false);
    }
  };
  const handleDoubleClickImage = () => {
    // Триггер открытия диалога выбора файла
    document.getElementById("fileInput").click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setLocalImage(`${Category_URL}${file.name}`);
  };
  return (
    <div className={styles.overlayCategory}>
      <div className={styles.dialogBoxCategory}>
        <div className={styles.titleBarCategory}>
          <button className={styles.closeBtn} onClick={onClose}>
            &times;
          </button>
        </div>
        <div className={styles.contentArea}>
          {isEditing ? (
            <input
              type="text"
              value={localName}
              onChange={handleNameChange}
              onBlur={() => setIsEditing(false)} // Выйти из режима редактирования при потере фокуса
              onKeyDown={handleKeyDown} // Обработать клавиши ESC и ENTER
              autoFocus
              className={styles.editInput}
            />
          ) : (
            <h2
              className={styles.alertText}
              onDoubleClick={() => setIsEditing(true)}
              title="Double-click to edit"
            >
              {localName}
            </h2>
          )}

          {/* Контейнер изображения */}
          <div className={styles.categoryImageContainer}>
            <img
              src={localImage}
              alt={"Double-click to add"}
              className={styles.categoryImage}
              onDoubleClick={handleDoubleClickImage}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "+";
              }}
              title="Double-click to change image"
            />
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }} // Скрытый input для выбора файла
              onChange={handleFileChange}
            />
          </div>

          {/* Группа кнопок */}
          <div className={styles.buttonGroup}>
            <button className={styles.okBtn} onClick={handleOk}>
              OK
            </button>
            <button className={styles.cancelBtn} onClick={ () => onClose()}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

Category.propTypes = {
  userData: PropTypes.object.isRequired,
  category: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Category;
