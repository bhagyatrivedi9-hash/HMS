import { register, login, getMe, logout } from "../services/auth.api";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading, setError, setSuccessMessage, clearMessages } from "../auth.slice";

export function useAuth() {
  const dispatch = useDispatch();
  const { user, loading, error, successMessage } = useSelector((state) => state.auth);

  async function handleRegister({ name, email, password }) {
    try {
      dispatch(clearMessages());
      dispatch(setLoading(true));
      const data = await register({ name, email, password });
      dispatch(setSuccessMessage(data.message || "Registration successful! You can now log in."));
      return { success: true, data };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Registration failed";
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogin({ email, password }) {
    try {
      dispatch(clearMessages());
      dispatch(setLoading(true));
      const data = await login({ email, password });
      dispatch(setUser(data.user));
      dispatch(setSuccessMessage(data.message || "Login successful!"));
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Login failed. Check your credentials.";
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleLogout() {
    try {
      dispatch(setLoading(true));
      await logout();
      dispatch(setUser(null));
      dispatch(clearMessages());
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || "Logout failed";
      dispatch(setError(msg));
      return { success: false, error: msg };
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleGetMe() {
    try {
      dispatch(setLoading(true));
      const data = await getMe();
      dispatch(setUser(data.user));
      return { success: true, user: data.user };
    } catch {
      // Not logged in or expired session
      dispatch(setUser(null));
      return { success: false };
    } finally {
      dispatch(setLoading(false));
    }
  }

  function handleClearMessages() {
    dispatch(clearMessages());
  }

  return {
    user,
    loading,
    error,
    successMessage,
    handleRegister,
    handleLogin,
    handleLogout,
    handleGetMe,
    handleClearMessages,
  };
}
