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
  isLoggingOut :false, // ✅ add this flag
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
      console.log("Login Error:", err);
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// verify current accessToken by calling backend
export const verifyMe = createAsyncThunk("auth/verifyMe", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data; // expecting { status, message, data: { user } }
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

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


export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch("/user/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data;
    }
    catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


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
      state.isLoggingOut=true;
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
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        // payload shape assumed: { user, tokens: { accessToken } }
        const payload = action.payload?.data || {}; // FIXED

        if (payload.user) {
          state.user = payload.user;
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
        localStorage.removeItem("pendingUser");
        state.loading = false;


        if (payload.accessToken) {
          state.accessToken = payload.accessToken;
          localStorage.setItem("accessToken", payload.accessToken);
        }

      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Login failed";
      })

      // register
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.data || {};
        console.log("Paylaod", action.payload);
        localStorage.setItem("pendingUser", JSON.stringify({
          email: payload?.user?.email,
          sessionId: payload.sessionId,
          token: payload.verificationToken,
          user: payload.user,

        }));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Register failed";
      })

      // logout
      .addCase(logoutAsync.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.loading = false;
        state.error = null;
        localStorage.removeItem("user");

        localStorage.removeItem("accessToken");
      })
      .addCase(logoutAsync.rejected, (state) => {
        // clear client state even if server-side logout failed
        state.user = null;
        state.accessToken = null;
        state.loading = false;
        state.error = null;
        state.isLoggingOut=true;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
      })

      // verifyMe
      .addCase(verifyMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyMe.fulfilled, (state, action) => {
        state.loading = false;
        const payload = action.payload?.data || {};
        console.log(action.payload);
        if (payload.user) {
          state.user = payload.user;
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
      })
      .addCase(verifyMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");
        state.error = action.payload || action.error?.message || "Verification failed";
      })

      // refresh
      .addCase(refreshAuth.pending, (state) => {
        state.loading = true;
        console.log('RejeStartedcted');

        state.error = null;
      })
      .addCase(refreshAuth.fulfilled, (state, action) => {
        state.loading = false;
        console.log('Refresk State',action.payload);
        const payload = action.payload || {};
        if (payload.accessToken) {
          state.accessToken = payload.accessToken;
          localStorage.setItem("accessToken", payload.accessToken);
        }
        if (payload.user) {
          state.user = payload.user;
          localStorage.setItem("user", JSON.stringify(payload.user));
        }
      })
      .addCase(refreshAuth.rejected, (state, action) => {
        // if refresh fails, clear auth
        console.log('Rejected');

        state.user = null;
        state.accessToken = null;
        state.loading = false;
        localStorage.removeItem("user");
        localStorage.removeItem("accessToken");

        state.error = action.error?.message || "Session expired";

      })

      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("Profile Update Payload", action.payload);
        state.user = action.payload.data.user;
        localStorage.setItem("user", JSON.stringify(action.payload.data.user));
      }
      )
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error?.message || "Profile update failed";
      });
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
