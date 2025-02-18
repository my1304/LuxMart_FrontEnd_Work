import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import styles from "../../styles/Product.module.css";
import showAlert from "../MessageForms/AlertService";
import { actionProduct } from "../../features/products/productsSlice";
import ProductImageGallery from "./ProductImageGallery";


const Product = ({ product, onClose, onSave, action }) => {
  const [localTitle, setLocalTitle] = useState(product.title); // Локальное имя
  const [localImages, setLocalImages] = useState(product.image_urls); // Локальное изображение
  const [localPrice, setLocalPrice] = useState(product.price); // Локальная цена
  const [localDescription, setLocalDescription] = useState(product.description); // Локальное дополнение
  const [isEditTitle, setIsEditTitle] = useState(false); // Режим редактирования Title
  const [isEditPrice, setIsEditPrice] = useState(false); // Режим редактирования Title
  const [isEditDescription, setIsEditDescription] = useState(false); // Режим редактирования Title
  const dispatch = useDispatch(); // Для отправки действий Redux

  useEffect(() => {
    // Сброс значений при изменении категории
    setLocalTitle(product.title);
    setLocalImages(product.image_urls);
  }, [product]);

  const handleAction = async () => {
    if (await showAlert("Do you want to save changes?", "Yes", "No")) {
      try {
        const result = await dispatch(
          actionProduct({
            id: action === "add" ? "add" : product.id,
            category_id: product.category_id,
            title: localTitle,
            image: localImages,
            price: localPrice,
            description: localDescription,
          })
        );
        if (actionProduct.fulfilled.match(result)) {
          onSave({
            id: result.payload?.id || product.id,
            category_id: product.category_id,
            title: localTitle,
            image_urls: localImages,
            price: localPrice,
            description: localDescription,
          });
          console.log("Changes saved successfully!");
        } else {
          alert(
            "Error saving changes: " +
              (result.payload?.message || "Unknown error")
          );
        }
      } catch (err) {
        alert("Network error occurred: " + err.message);
      }
    }
  };
  const handleOk = () => {
    if (
      localTitle !== product.title ||
      localImages !== product.image_urls ||
      localPrice !== product.price ||
      localDescription !== product.description
    ) {
      handleAction(); // Если есть изменения, вызываем handleAction
    }
    onClose(); // Закрываем окно
  };
  const handleKeyDownTitle = (e) => {
    if (e.key === "Escape") {
      setLocalTitle(product.title);
      setIsEditTitle(false);
    } else if (e.key === "Enter") {
      setIsEditTitle(false);
    }
  };
  const handleKeyDownPrice = (e) => {
    if (e.key === "Escape") {
      setLocalPrice(product.price);
      setIsEditPrice(false);
    } else if (e.key === "Enter") {
      setIsEditPrice(false);
      setLocalPrice(parseFloat(localPrice).toFixed(2));
    }
  };
  const handleKeyDownDescription = (e) => {
    if (e.key === "Escape") {
      setLocalDescription(product.description);
      setIsEditDescription(false);
    } else if (e.key === "Enter") {
      setIsEditDescription(false);
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
          <div className={styles.productImageGallery}>
            <div className={styles.productImages}>
              <ProductImageGallery
                images={localImages} // Передаем строки или массив
                productTitle={product.title}
                onImagesChange={(updatedImages) =>
                  setLocalImages(updatedImages)
                } // Обновляем локальное состояние
              />
            </div>
          </div>
          <br></br>
          {isEditTitle ? ( //Change Title
            <input
              type="text"
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={() => setIsEditTitle(false)}
              onKeyDown={handleKeyDownTitle} // Обработать клавиши ESC и ENTER
              autoFocus
              className={styles.editInputTitle}
            />
          ) : (
            <h2
              className={styles.productTitle}
              onDoubleClick={() => setIsEditTitle(true)}
              title="Double-click to edit title"
            >
              {localTitle}
            </h2>
          )}

          {isEditPrice ? ( //Change Price
            <input
              type="text"
              value={localPrice}
              onChange={(e) => setLocalPrice(e.target.value)}
              onBlur={() => setIsEditPrice(false)}
              onKeyDown={handleKeyDownPrice} // Обработать клавиши ESC и ENTER
              autoFocus
              className={styles.editInputPrice}
            />
          ) : (
            <h2
              className={styles.productPrice}
              onDoubleClick={() => setIsEditPrice(true)}
              title="Double-click to edit Price"
            >
              {localPrice}
            </h2>
          )}
          {isEditDescription ? (
            <input
              type="text"
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
              onBlur={() => setIsEditDescription(false)}
              onKeyDown={handleKeyDownDescription} // Обработать клавиши ESC и ENTER
              autoFocus
              className={styles.editInputDescription}
            />
          ) : (
            <h2
              className={styles.productDescription}
              onDoubleClick={() => setIsEditDescription(true)}
              title="Double-click to edit Description"
            >
              {localDescription}
            </h2>
          )}
        </div>
        <div className={styles.separator}></div>
        <div className={styles.buttonArea}>
          <button className={styles.okBtn} onClick={handleOk}>
            Ok
          </button>
          <button className={styles.cancelBtn} onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

Product.propTypes = {
  product: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};

export default Product;
