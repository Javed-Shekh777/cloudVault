// src/redux/authSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../services/axiosInstance";

/**
 * Assumptions:
 * - axiosInstance is pre-configured with baseURL and withCredentials: true
 * - Backend login route returns { user, tokens: { accessToken } } and sets httpOnly refresh cookie
 * - /auth/refresh returns { user, accessToken }
 */

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  accessToken: localStorage.getItem("accessToken") || null,
  loading: false,
  error: null,
};


export const verifyMail = createAsyncThunk("auth/verifyMail", async (formData, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/auth/verifyMail", formData);
    console.log("VerificationMail Response:", res);
    return res.data;
  } catch (error) {
    console.log("Response Error:", error);
    return rejectWithValue(error.response.data);
  }
});

// LOGIN
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/localLogin", credentials); // should set refresh cookie
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// REGISTER
export const register = createAsyncThunk(
  "auth/register",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/auth/localRegister", payload);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// LOGOUT (server clears refresh cookie)
export const logoutAsync = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.post("/auth/logout");
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(res);

    return rejectWithValue(err.response?.data || err.message);
  }
});

// REFRESH using httpOnly cookie
export const refreshAuth = createAsyncThunk("auth/refresh", async (_, { rejectWithValue }) => {
  try {
    console.log('fdjfdfdfjbdfdfdsfdsfdsdgd');
    const res = await axiosInstance.post("/auth/refresh"); // server should read cookie and return new access token & user
    console.log(res);
    console.log('fdjfdfdfjbdfdfdsfdsfdsdgd');
    return res.data;
  } catch (err) {
    console.log(err);
    return rejectWithValue(err.response?.data || err.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // Manually set credentials (useful if you get token from somewhere)
    setCredentials(state, action) {
      const { accessToken, user } = action.payload;
      state.accessToken = accessToken ?? null;
      state.user = user ?? null;
      if (accessToken) localStorage.setItem("accessToken", accessToken);
      else localStorage.removeItem("accessToken");
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    },
    // Clear client state (useful for forced logout)
    logout(state) {
      state.user = null;
      state.accessToken = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyMail.pending, (state) => { state.loading = true; })
      .addCase(verifyMail.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(verifyMail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Mail Verification failed";
      })
      // login
      .addCase(login.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        // payload shape assumed: { user, tokens: { accessToken } }
        const payload = a.payload || {};
        if (payload.tokens?.accessToken) {
          s.accessToken = payload.tokens.accessToken;
          localStorage.setItem("accessToken", payload.tokens.accessToken);
        }
        if (payload.user) {
          s.user = payload.user;
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
        localStorage.removeItem("pendingUser");

      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message || "Login failed";
      })

      // register
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        const payload = a.payload?.data || {};
        console.log("Paylaod", a.payload);
        localStorage.setItem("pendingUser", JSON.stringify({
          email: payload?.user?.email,
          sessionId: payload.sessionId,
          token: payload.verificationToken,
          user: payload.user,

        }));
      })
      .addCase(register.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || a.error?.message || "Register failed";
      })

      // logout
      .addCase(logoutAsync.fulfilled, (s) => {
        s.user = null;
        s.accessToken = null;
        s.loading = false;
        s.error = null;
        localStorage.removeItem("user");

        localStorage.removeItem("accessToken");
      })
      .addCase(logoutAsync.rejected, (s) => {
        // clear client state even if server-side logout failed
        s.user = null;
        s.accessToken = null;
        s.loading = false;
        s.error = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })

      // refresh
      .addCase(refreshAuth.pending, (s) => {
        s.loading = true;
        console.log('RejeStartedcted');

        s.error = null;
      })
      .addCase(refreshAuth.fulfilled, (s, a) => {
        s.loading = false;
        console.log('fdfddsfdsddddddd');
        const payload = a.payload || {};
        if (payload.accessToken) {
          s.accessToken = payload.accessToken;
          localStorage.setItem("accessToken", payload.accessToken);
        }
        if (payload.user) {
          s.user = payload.user;
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
      })
      .addCase(refreshAuth.rejected, (s) => {
        // if refresh fails, clear auth
        console.log('Rejected');

        s.user = null;
        s.accessToken = null;
        s.loading = false;
        s.error = "Session expired";
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
