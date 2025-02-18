import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BASE_URL } from "../../utils/constants";

// Асинхронный thunk для получения продуктов
export const getProducts = createAsyncThunk(
  "/products",
  async (_, thunkAPI) => { 
    try { 
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      const response = await fetch(`${BASE_URL}/products`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Добавляем токен в заголовки
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Ошибка при получении продуктов:", errorData);
        return thunkAPI.rejectWithValue({ 
          message: errorData.message || "Failed to fetch products", 
          status: response.status 
        });
      }
      // Извлекаем JSON данные продуктов
      const data = await response.json();
      return data.data; // Возвращаем массив продуктов из "data"
    } catch (err) {
      console.error("Ошибка запроса:", err.message);
      return thunkAPI.rejectWithValue({ 
        message: "Network error", 
        error: err.message 
      });
    }
  }
);

// Асинхронный thunk для сохранения изменений продукта
export const actionProduct = createAsyncThunk(
  "product/action",
  async ({ id, category_id, title, image ,price, description }, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");
      const response = await fetch(`${BASE_URL}/product/${id}`, {   
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`, // Добавляем токен в заголовки
        },
        body: JSON.stringify({ id, category_id, title, image ,price, description}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue({
          message: errorData.message || "Failed to update product",
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
// Асинхронный thunk для удаления продукта
export const deleteProduct = createAsyncThunk(
  "product/delete",
  async ({ id }, thunkAPI) => {
    try {
      // Получаем токен доступа
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      // Делаем DELETE-запрос
      const response = await fetch(`${BASE_URL}/product/${id}`, {
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
          message: errorData.message || "Failed to delete product",
          status: response.status,
        });
      }

      // Возвращаем успешный результат
      return { id }; // Можно вернуть ID удалённого продукта
    } catch (err) {
      // Логируем ошибку и возвращаем rejectWithValue
      console.error("Ошибка удаления product:", err.message);
      return thunkAPI.rejectWithValue({
        message: "Network error",
        error: err.message,
      });
    }
  }
);

// Создание среза для продуктов
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [], // Хранение списка продуктов
    isLoading: false,
    error: null,
  },
  reducers: {
    updateLocalProduct: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.items.findIndex(
        (product) => product.id === updatedProduct.id
      );
      if (index !== -1) {
        // Обновляем существующий продукт
        state.items[index] = updatedProduct;
      } else {
        // Добавляем новый продукт
        state.items.push(updatedProduct);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        const serverProducts = action.payload;

        // Обновляем или добавляем только серверные продукты
        serverProducts.forEach((serverProduct) => {
          const index = state.items.findIndex(
            (product) => product.id === serverProduct.id
          );
          if (index !== -1) {
            state.items[index] = serverProduct;
          } else {
            state.items.push(serverProduct);
          }
        });

        // Удаляем локальные продукты, которых нет на сервере
        state.items = state.items.filter((product) =>
          serverProducts.some((serverProduct) => serverProduct.id === product.id)
        );
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error?.message || "Failed to fetch products";
        console.error("Error fetching products:", action.error);
      });
  },
});

export const { updateLocalProduct } = productsSlice.actions;
export default productsSlice.reducer;

// Селекторы для получения данных из состояния
export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.isLoading;
export const selectProductsError = (state) => state.products.error;

/*
const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],      // Хранение списка продуктов
    isLoading: false,
    error: null,
  },
  reducers: {
    updateLocalProduct: (state, action) => {
      const updatedProduct = action.payload;
      const index = state.items.findIndex(
        (product) => product.id === updatedProduct.id
      );
      if (index !== -1) {
        state.items[index] = updatedProduct;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload; // Сохраняем продукты в состояние
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      });
  },
});
export const { updateLocalProduct } = productsSlice.actions;
export default productsSlice.reducer;

// Селекторы для получения данных из состояния
export const selectProducts = (state) => state.products.items;
export const selectProductsLoading = (state) => state.products.isLoading;
export const selectProductsError = (state) => state.products.error;*/