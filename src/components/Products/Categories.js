import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getCategories,
  deleteCategory,
  selectCategories,
  selectCategoriesLoading,
  selectCategoriesError,
} from "../../features/products/categoriesSlice";
import { selectProducts, getProducts } from "../../features/products/productsSlice";
import "../../styles/Categories.css";
import Category from "./Category";
import Products from "./Products";
import showAlert from "../MessageForms/AlertService";

const Categories = ({ userData }) => {
  const dispatch = useDispatch();

  // Получаем данные категорий из Redux
  const categories = useSelector(selectCategories);
  const categoriesLoading = useSelector(selectCategoriesLoading);
  const categoriesError = useSelector(selectCategoriesError);

  // Получаем данные продуктов из Redux
  const products = useSelector(selectProducts);

  const [localCategories, setLocalCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  useEffect(() => {
    dispatch(getCategories());
  }, [dispatch]);

  useEffect(() => {
    if (localCategories.length === 0 && categories.length > 0) {
      setLocalCategories(categories);
      setSelectedCategory(categories[0].id); // Устанавливаем первую категорию как активную
    }
  }, [categories, localCategories]);

  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
  };

  const handleCategoryDoubleClick = (category) => {
    setSelectedCategory(category); // Передаём объект категории
    setIsCategoryModalOpen(true);
  };

  const closeCategoryModal = () => {
    setIsCategoryModalOpen(false);
  };

  const handleAddCategory = () => {
    const newCategory = {
      name: "newCategory",
      image: "",
    };
    setSelectedCategory(newCategory);
    setIsCategoryModalOpen(true);
  };

  const requeryCategoryInList = (requeryCategory) => {
    setLocalCategories((prevCategories) => {
      const existingCategoryIndex = prevCategories.findIndex(
        (cat) => cat.id === requeryCategory.id
      );
      if (existingCategoryIndex !== -1) {
        return prevCategories.map((cat) =>
          cat.id === requeryCategory.id ? requeryCategory : cat
        );
      } else {
        return [...prevCategories, requeryCategory];
      }
    });
  };

  const handleDeleteCategory = async (categoryId, categoryName) => {
    const confirmed = await showAlert(
      `Do you want to delete record "${categoryName}"?`,
      "Yes",
      "No"
    );
    if (confirmed) {
      const resultAction = await dispatch(deleteCategory({ id: categoryId }));
      if (deleteCategory.fulfilled.match(resultAction)) {
        setLocalCategories((prevCategories) =>
          prevCategories.filter((cat) => cat.id !== categoryId)
        );
      } else {
        const errorMessage =
          resultAction.payload?.message || "Failed to delete category.";
        alert(`Error: ${errorMessage}`);
        console.error("Delete error details:", resultAction.payload);
      }
    }
  };

  return (
    <div className="CommonContainer">
      <div className="categoriesSection">
      <button
          className="refresh-btn"
          onClick={() => {
            dispatch(getCategories());
            dispatch(getProducts());
          }}
          title="Refresh categories and products"
        >
          🔄
        </button>
        <h3>Categories</h3>
        {categoriesLoading ? (
          <p>Loading categories...</p>
        ) : categoriesError ? (
          <p>Error loading categories: {categoriesError}</p>
        ) : (
          <>
            <div className="add-category-container">
              <button className="add-category-btn" onClick={handleAddCategory}>
                +
              </button>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {localCategories.map((category) => {
                  // Проверяем, есть ли продукты у категории
                  const hasProducts =
                    selectedCategory === category.id &&
                    products.some(
                      (product) => product.category_id === category.id
                    );

                  return (
                    <tr
                      key={category.id}
                      onClick={() => handleCategorySelect(category.id)} // Выбор категории
                      onDoubleClick={() => handleCategoryDoubleClick(category)} // Двойной клик
                      className={
                        selectedCategory === category.id ? "active" : ""
                      }
                    >
                      <td>
                        <img
                          src={category.image || "/default-category.png"}
                          alt={category.name}
                          className="category-image"
                        />
                      </td>
                      <td>{category.name}</td>
                      <td style={{ textAlign: "right" }}>
                        {/* Кнопка удаления только для активной строки и если нет продуктов */}
                        {selectedCategory === category.id && !hasProducts && (
                          <button
                            className="delete-category-btn"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCategory(category.id, category.name);
                            }}
                          >
                            &times;
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </div>

      <Products selectedCategory={selectedCategory} userData={userData} />

      {isCategoryModalOpen && selectedCategory && (
        <Category
          userData={userData}
          category={selectedCategory}
          onClose={closeCategoryModal}                  
          onSave={requeryCategoryInList}
          action={selectedCategory.id ? "update" : "add"}
        />
      )}
    </div>
  );
};

export default Categories;