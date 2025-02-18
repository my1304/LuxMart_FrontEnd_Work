import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL } from "../../utils/constants";

export const loginUser = createAsyncThunk(
  "/auth/login",
  async ({ email, password }, thunkAPI) => { 
    try {   
      const response = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),      
      });

      // Проверка на успешный ответ
      if (!response.ok) {
        const errorData = await response.json();
        return thunkAPI.rejectWithValue({ 
          message: errorData.message || 'Failed to login', 
          status: response.status 
        });
      }

      // Извлекаем JSON данные
      const data = await response.json();
      // Сохраняем токен доступа, если он присутствует в ответе
      const accessToken = data.access_token;

      if (accessToken) {
        localStorage.setItem("accessToken", accessToken);
      }

      return data; // Возвращаем данные пользователя
    } catch (err) {
      console.error('Ошибка запроса:', err.message);
      return thunkAPI.rejectWithValue({ message: 'Network error', error: err.message });
    }
  }
);
export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, thunkAPI) => {
    try {
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) throw new Error("No access token found");

      await axios.post(
        `${BASE_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }        
      );

      localStorage.removeItem("accessToken");

      return true;
    } catch (err) {
      console.error(err);
      return thunkAPI.rejectWithValue(err);
    }
  }
);

const addCurrentUser = (state, { payload }) => {
  state.currentUser = payload;
};

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loginUser.fulfilled, addCurrentUser);
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.currentUser = null;
    });
  },
});

export default userSlice.reducer;

export const selectCurrentUser = (state) => state.user.currentUser;
export const selectUserLoading = (state) => state.user.loading;
export const selectUserError = (state) => state.user.error;