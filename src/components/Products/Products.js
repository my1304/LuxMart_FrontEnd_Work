import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getProducts,
  deleteProduct,
  updateLocalProduct,
  selectProducts,
  selectProductsLoading,
  selectProductsError,
} from "../../features/products/productsSlice";
import "../../styles/Products.css";
import Product from "./Product";
import showAlert from "../MessageForms/AlertService";

const Products = ({ selectedCategory, userData }) => {
  const dispatch = useDispatch();

  const products = useSelector(selectProducts);
  const productsLoading = useSelector(selectProductsLoading);
  const productsError = useSelector(selectProductsError);

  const [localProducts, setLocalProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);
  /*
  useEffect(() => {
    alert(products.length);
    if (products.length > 0) {
      setLocalProducts(products);
      setSelectedProduct((prev) => prev || products[0].id);
    }
  }, [products, localProducts]);*/

  useEffect(() => {
    if (products.length > 0) {
      setLocalProducts(products);
      setSelectedProduct(products[0].id); // Устанавливаем первую категорию как активную
    }
    console.log("Updated products:", products);
  }, [products]);

  useEffect(() => {
    console.log("Updated =1=1=1=1=1==1 localProducts:", localProducts);
  }, [localProducts]);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
  };

  const handleProductDoubleClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };
  const handleAddProduct = () => {
    const newProduct = {
      title: "New product",
      price: 0,
      description: "New description",
      category_id: selectedCategory,
      image_urls: "",
    };
    setSelectedProduct(newProduct);
    setIsProductModalOpen(true);
  };

  const requeryProductInList = (RequeryProduct) => {
    // dispatch(getProducts());
    const formatImages = (image_urls) => {
      return "{" + image_urls.map((url) => `"${url}"`).join(",") + "}";
    };
    const updatedProduct = {
      ...RequeryProduct,
      image_urls: Array.isArray(RequeryProduct.image_urls)
        ? formatImages(RequeryProduct.image_urls)
        : RequeryProduct.image_urls,
    };

    dispatch(updateLocalProduct(updatedProduct)); // Обновляем Redux (глобальное состояние)

    // Обновляем локальное состояние
    setLocalProducts((prevProducts) => {
      const existingProductIndex = prevProducts.findIndex(
        (product) => product.id === RequeryProduct.id
      );

      if (existingProductIndex !== -1) {
        // Обновляем существующий продукт
        return prevProducts.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product
        );
      } else {
        // Добавляем новый продукт
        return [...prevProducts, updatedProduct];
      }
    });
  };

  const handleDeleteProduct = async (productId, productTitle) => {
    const confirmed = await showAlert(
      `Do you want to delete product "${productTitle}"?`,
      "Yes",
      "No"
    );
    if (confirmed) {
      const resultAction = await dispatch(deleteProduct({ id: productId }));
      if (deleteProduct.fulfilled.match(resultAction)) {
        dispatch(updateLocalProduct({ id: productId, action: "delete" }));
        setLocalProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== productId)
        );
        console.log(`Product with ID ${productId} deleted locally.`);
      } else {
        const errorMessage =
          resultAction.payload?.message || "Failed to delete product.";
        alert(`Error: ${errorMessage}`);
      }
    }
  };
  return (
    <div className="CommonContainer">
      <div className="productsSection">
        <h3>Products</h3>

        <div className="add-product-container">
          {selectedCategory && (
            <button className="add-product-btn" onClick={handleAddProduct}>
              +
            </button>
          )}
        </div>

        {productsLoading ? (
          <p>Loading products...</p>
        ) : productsError ? (
          <p>Error loading products: {productsError}</p>
        ) : selectedCategory ? (
          <table>
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {products
                .filter((product) => product.category_id === selectedCategory)
                .map((product) => (
                  <tr
                    key={product.id}
                    onClick={() => handleProductSelect(product)}
                    onDoubleClick={() => handleProductDoubleClick(product)} // Обработка двойного клика на продукт
                    className={selectedProduct === product ? "active" : ""}
                  >
                    <td>
                      <div className="product-images">
                        {product.image_urls ? (
                          (() => {
                            // Удаляем фигурные скобки, но оставляем кавычки
                            const cleanedUrls = product.image_urls.replace(
                              /^\{|\}$/g,
                              ""
                            );
                            // Разбиваем строку только там, где есть запятая внутри кавычек
                            const urlsArray = cleanedUrls.split(
                                /,(?=(?:[^"]*"[^"]*")*[^"]*$)/
//                            /,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/
                            );
                            return urlsArray.map((url, index) => {
                              // Удаляем кавычки вокруг строки
                              const trimmedUrl = url
                                .trim()
                                .replace(/^"|"$/g, "");
                              return (
                                <div
                                  key={index}
                                  className="product-image-container"
                                >
                                  <img
                                    src={trimmedUrl} // Используем строку без кавычек
                                    alt={`${product.title} - ${index + 1}`}
                                    className="product-image"
                                    onError={(e) => {
                                      e.target.onerror = null; // Убираем бесконечный цикл
                                      e.target.style.display = "none"; // Прячем изображение
                                      const errorText =
                                        document.createElement("p");
                                      errorText.textContent = `Image not found: ${trimmedUrl}`;
                                      errorText.className = "image-error-text";
                                      e.target.parentNode.appendChild(
                                        errorText
                                      ); // Добавляем текст ошибки
                                    }}
                                  />
                                </div>
                              );
                            });
                          })()
                        ) : (
                          <p>No images available</p>
                        )}
                      </div>
                    </td>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>{product.description}</td>

                    <td style={{ textAlign: "right" }}>
                      <button
                        className="delete-product-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(product.id, product.title);
                        }}
                      >
                        &times;
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p>Please select a category to view products.</p>
        )}
      </div>

      {isProductModalOpen && selectedProduct && (
        <Product
          product={selectedProduct}
          onClose={closeProductModal}
          onSave={requeryProductInList}
          action={selectedProduct.id ? "update" : "add"}
        />
      )}
    </div>
  );
};

export default Products;
