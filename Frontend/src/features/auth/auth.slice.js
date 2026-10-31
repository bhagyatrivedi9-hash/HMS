import { createSlice } from '@reduxjs/toolkit';

const getStoredUser = () => {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: getStoredUser(),
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
});

export const { setUser, setLoading, setError, setSuccessMessage, clearMessages } = authSlice.actions;
export default authSlice.reducer;
