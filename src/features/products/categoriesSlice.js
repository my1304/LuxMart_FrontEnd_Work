import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/constants";

// Асинхронный thunk для получения категорий
export const getCategories = createAsyncThunk(
  "/categories",
  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(`${BASE_URL}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Добавляем токен в заголовки
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue({
          message: errorData.message || "Failed to fetch categories",
          status: response.status,
        });
      }

      // Извлекаем JSON данные категорий
      const data = await response.json();
      return data.data; // Возвращаем массив категорий из "data"
    } catch (err) {
      console.error("Ошибка запроса:", err.message);
      return thunkAPI.rejectWithValue({
        message: "Network error",
        error: err.message,
      });
    }
  }
);

// Асинхронный thunk для сохранения изменений категории
export const actionCategory = createAsyncThunk(
  "category/action",
  async ({ id, name, image }, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");
      const response = await fetch(`${BASE_URL}/category/${id}`, {   
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Добавляем токен в заголовки
        },
        body: JSON.stringify({ id, name, image }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue({
          message: errorData.message || "Failed to update category",
          status: response.status,
        });
      }      
      return await response.json();
    } catch (err) {     
      console.error("Ошибка обновления:", err.message);
      return thunkAPI.rejectWithValue({
        message: "Network error",
        error: err.message,
      });
    }
  }
);
// Асинхронный thunk для удаления категории
export const deleteCategory = createAsyncThunk(
  "category/delete",
  async ({ id }, thunkAPI) => {
    try {
      // Получаем токен доступа
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      // Делаем DELETE-запрос
      const response = await fetch(`${BASE_URL}/category/${id}`, {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Добавляем токен в заголовки
        },
        body: JSON.stringify({ id }),
      });
      // Проверяем ответ
      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue({
          message: errorData.message || "Failed to delete category",
          status: response.status,
        });
      }

      // Возвращаем успешный результат
      return { id }; // Можно вернуть ID удалённой категории
    } catch (err) {
      // Логируем ошибку и возвращаем rejectWithValue
      console.error("Ошибка удаления категории:", err.message);
      return thunkAPI.rejectWithValue({
        message: "Network error",
        error: err.message,
      });
    }
  }
);

// Создание среза для категорий
const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    items: [], // Хранение списка категорий
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload; // Сохраняем категории в состояние
      })
      .addCase(getCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      })
      .addCase(actionCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        // Обновляем категорию в состоянии
        const index = state.items.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload; // Обновляем категорию в массиве
        }
      })
      .addCase(actionCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to update category";
      });
  },
});

export default categoriesSlice.reducer;

// Селекторы для получения данных из состояния
export const selectCategories = (state) => state.categories.items;
export const selectCategoriesLoading = (state) => state.categories.isLoading;
export const selectCategoriesError = (state) => state.categories.error;