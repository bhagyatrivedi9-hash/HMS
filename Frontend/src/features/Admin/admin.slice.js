import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: null,
  users: [],
  roleFilter: 'all', // 'all' | 'patient' | 'doctor' | 'staff'
  statusFilter: 'all', // 'all' | 'active' | 'inactive'
  searchQuery: '',
  loading: false,
  statsLoading: false,
  actionLoadingId: null,
  error: null,
  successMessage: null,
};

export const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setStats: (state, action) => {
      state.stats = action.payload;
      state.statsLoading = false;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    updateUserInList: (state, action) => {
      const updatedUser = action.payload;
      state.users = state.users.map((u) =>
        u.id === updatedUser.id ? { ...u, ...updatedUser } : u
      );
    },
    setRoleFilter: (state, action) => {
      state.roleFilter = action.payload;
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setStatsLoading: (state, action) => {
      state.statsLoading = action.payload;
    },
    setActionLoadingId: (state, action) => {
      state.actionLoadingId = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
      state.statsLoading = false;
      state.actionLoadingId = null;
    },
    setSuccessMessage: (state, action) => {
      state.successMessage = action.payload;
    },
    clearAdminMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    resetAdminState: () => initialState,
  },
});

export const {
  setStats,
  setUsers,
  updateUserInList,
  setRoleFilter,
  setStatusFilter,
  setSearchQuery,
  setLoading,
  setStatsLoading,
  setActionLoadingId,
  setError,
  setSuccessMessage,
  clearAdminMessages,
  resetAdminState,
} = adminSlice.actions;

export default adminSlice.reducer;
