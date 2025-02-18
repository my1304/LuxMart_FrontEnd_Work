import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import categoriesReducer from "./features/products/categoriesSlice";
import productsReducer from "./features/products/productsSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    categories: categoriesReducer, // Для списка категорий
    category: categoriesReducer,  // Для одной категории
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: process.env.NODE_ENV !== "production",
});

export default store;