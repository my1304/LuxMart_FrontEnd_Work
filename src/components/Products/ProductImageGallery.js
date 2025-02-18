import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/ProductImageGallery.module.css";
import { Product_URL } from "../../utils/constants";

const ProductImageGallery = ({ images, productTitle, onImagesChange }) => {
  
  const [localImages, setLocalImages] = useState([]);
  
  useEffect(() => {
    if (images === "") return;
  
    const parsedImages =
      typeof images === "string"
        ? images
            .replace(/^\{|\}$/g, "") // Удаляем фигурные скобки    
            .replace(/\\"/g, "") // Удаляем экранированные кавычки        
              .split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/) // Разделяем строку в массив
//            .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/) // Разделяем строку в массив
            .map((img) => img.trim().replace(/^"|"$/g, "")) // Убираем лишние кавычки вокруг каждого элемента    
        : images;
  
    setLocalImages(parsedImages);
  
    if (parsedImages && parsedImages.length > 0) {
      onImagesChange(parsedImages); // Уведомляем родителя об изменении при загрузке
    }
  }, [images, onImagesChange]);

  // Обработка добавления нового изображения
  const handleAddImage = (e) => {
    const file = e.target.files[0];
    if (file) {      
      const newImagePath = `${Product_URL}${file.name}`;  
      const updatedImages = 
      localImages.length === 0 && localImages[0] === "[]"
        ? [newImagePath] // Инициализируем массив с новым путём
        : [...localImages, newImagePath]; // Иначе добавляем новый путь в конец
    
      // const updatedImages = [...localImages, newImagePath];
      setLocalImages(updatedImages);
      onImagesChange(updatedImages); // Уведомляем родителя об изменении
    }
  };

  // Обработка изменения существующего изображения
  const handleFileChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...localImages];
      updatedImages[index] = `${Product_URL}${file.name}`;
      setLocalImages(updatedImages);
      onImagesChange(updatedImages); // Уведомляем родителя об изменении
    }
  };

  // Удаление конкретного изображения
  const handleRemoveImage = (index) => {
    const updatedImages = localImages.filter((_, i) => i !== index); // Удаляем изображение по индексу
    setLocalImages(updatedImages);
    onImagesChange(updatedImages); // Уведомляем родителя об изменении
  };
  return (
    <div className={styles.productImageGallery}>
      {/* Кнопка добавления изображения */}
      <div
        className={styles.addImageProductButton}
        onClick={() => document.getElementById("addImageInput").click()}
        title="Click to add a new image"
      >
        +
      </div>
      <input
        type="file"
        id="addImageInput"
        style={{ display: "none" }}
        onChange={handleAddImage} // Обработка выбора нового файла
      />

      {/* Если изображения есть, отображаем их */}
      <div className={styles.productImages}>
        {localImages && localImages.length > 0 ? (
          localImages.map((url, index) => {
            const trimmedUrl = url.trim().replace(/^"|"$/g, ""); // Убираем кавычки
            return (
              <div key={index} className={styles.productImageContainer}>
                {/* Кнопка удаления изображения */}
                <button
                  className={styles.deleteButton}
                  onClick={() => handleRemoveImage(index)} // Удаление по индексу
                  title="Remove this image"
                >
                  &times;
                </button>

                <img
                  src={trimmedUrl}
                  alt={`${productTitle} - ${index + 1}`}
                  className={styles.productImage}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = "none";
                  }}
                  onDoubleClick={() =>
                    document.getElementById(`fileInput-${index}`).click()
                  } // Открываем выбор файла
                />
                <input
                  type="file"
                  id={`fileInput-${index}`}
                  style={{ display: "none" }}
                  onChange={(e) => handleFileChange(index, e)} // Обновление пути изображения
                />
              </div>
            );
          })
        ) : (
          <p className={styles.noImagesMessage}>No images available</p>
        )}
      </div>
    </div>
  );
};

ProductImageGallery.propTypes = {
  images: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string), // Если массив строк
    PropTypes.string, // Если строка (например, с разделителями)
  ]).isRequired,
  productTitle: PropTypes.string.isRequired,
};

export default ProductImageGallery;