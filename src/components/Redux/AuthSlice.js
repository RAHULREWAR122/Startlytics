
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const saveUserToLocalStorage = createAsyncThunk(
  'user/saveUserToLocalStorage',
  async (user, thunkAPI) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authData', JSON.stringify(user));
    }
    return user;
  }
);

export const saveTokenToLocalStorage = createAsyncThunk(
  'user/saveTokenToLocalStorage',
  async (token, thunkAPI) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
    }
    return token;
  }
);

export const loadUserFromLocalStorage = createAsyncThunk(
  'user/loadUserFromLocalStorage',
  async () => {
    if (typeof window !== 'undefined') {
      const userStr = localStorage.getItem('authData');
      return userStr ? JSON.parse(userStr) : null;
    }
    return null;
  }
);

export const loadTokenFromLocalStorage = createAsyncThunk(
  'user/loadTokenFromLocalStorage',
  async () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken') || null;
    }
    return null;
  }
);

const initialState = {
  user: null,
  token: null,
  status: 'idle',
};

const userLocalSlice = createSlice({
  name: 'localData',
  initialState,
  reducers: {
    removeUser(state) {
      state.user = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authData');
      }
    },
    removeToken(state) {
      state.token = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('authToken');
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(saveUserToLocalStorage.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(loadUserFromLocalStorage.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(saveTokenToLocalStorage.fulfilled, (state, action) => {
        state.token = action.payload;
      })
      .addCase(loadTokenFromLocalStorage.fulfilled, (state, action) => {
        state.token = action.payload;
      });
  },
});

export const { removeUser, removeToken } = userLocalSlice.actions;
export default userLocalSlice.reducer;
