import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { axiosInstance } from '../services/axiosInstance';

const initialState = {
    lockedFolders: [],
    lockedFiles: [],
    loading: false,
    isSetup: false,
    unlockMethod: null,
    isUnLocked: false,
    unlockToken: localStorage.getItem("lockedToken") || null,
    localSessionId: localStorage.getItem("lockedSessionId") || null,
    error: null,
    currentFolder: null,
};

// router.route("/status").get(requireAuth, getLockedStatus);
// router.route("/setup").post(requireAuth, setLocked);
// router.route("/unlock").post(requireAuth, unlockLocked);
// router.route("/change-credential").post(requireAuth, changeLockedCredential);
// router.route("/").get(requireAuth, getLockedData)


export const getLockedData = createAsyncThunk("locked/getLockedData", async (folder, { rejectWithValue }) => {
    try {
        console.log("Fetching locked data for folder:", folder);
        const res = await axiosInstance.get(`/locked-folder`,{params: { folder: folder || null }});
        console.log("Thunk", res.data);
        return res.data;
    } catch (error) {
        console.log("Thunk error", error);
        return rejectWithValue(error.response.data);
    }
});


export const fetchLockedFiles = createAsyncThunk(
  "drive/fetchLockedFiles",
  async ({ folderId, isLocked = false }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/files", { params: { folder: folderId || "", isLocked: isLocked === true ? 'true' : 'false' } });
      // Expecting server to return { data: { files: [...] } } or { files: [...] }
      console.log("Fetch files response:", res.data);
      // if (res.data?.data?.files) return { files: res.data.data.files };
      // if (res.data?.files) return { files: res.data.files };
      // if (res.data?.data) return { files: res.data.data }; // fallback
      return res.data?.data || res.data; // fallback
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const getLockedStatus = createAsyncThunk("locked/getLockedStatus", async (_, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.get("/locked-folder/status");
        console.log("Thunk", res.data);

        return res.data;
    } catch (error) {
        console.log("Thunk error", error);


        return rejectWithValue(error.response.data);
    }
});

export const setLocked = createAsyncThunk("locked/setLockedFolder", async ({ unlockMethod, credential }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/locked-folder/setup", { unlockMethod, credential });
        console.log("Thunk", res.data);

        return res.data;
    } catch (error) {
        console.log("Thunk error", error);

        return rejectWithValue(error.response.data);
    }
});

export const setUnlocked = createAsyncThunk("locked/setUnlocked", async ({ unlockMethod, credential }, { rejectWithValue }) => {
    try {
        const res = await axiosInstance.post("/locked-folder/unlock", { unlockMethod, credential });
        console.log("Thunk", res.data);

        return res.data;

    } catch (error) {
        console.log("Thunk error", error);

        return rejectWithValue(error.response.data);
    }
});


export const exitLocked = createAsyncThunk("locked/exitLocked", async (_, { rejectWithValue }) => {
    try {

        const res = await axiosInstance.delete("/locked-folder/exit");
        console.log("Thunk", res.data);

        return res.data;

    } catch (error) {
        console.log("Thunk error", error);

        return rejectWithValue(error.response.data);
    }
});


const lockedSlice = createSlice({
    name: "locked",
    initialState,
    reducers: {
        clearLockedFolderState: (state) => {
            state.folders = [];
            state.currentFolder = null;
            state.files = [];
            state.loading = false;
            state.error = null;
        },
        // helper to set current folder (useful when navigating breadcrumbs)
        setLockedCurrentFolder: (state, action) => {
            state.currentFolder = action.payload;
        },
        // optimistic add file(s)
        addLockedFilesOptimistic: (state, action) => {
            const payload = action.payload?.createdFiles || action.payload;
            console.log(payload);
            if (Array.isArray(payload)) state.lockedFiles.push(...payload);
            else state.lockedFiles.push(payload);
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLockedData.pending, (state, action) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getLockedData.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Locked Data ", action.payload);
                state.lockedFolders = action.payload.data?.lockedFolders;
                state.lockedFiles = action.payload.data?.lockedFiles;
            })
            .addCase(getLockedData.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(getLockedStatus.fulfilled, (state, action) => {
                state.isSetup = action.payload.data?.isSetup;
                console.log(action.payload);
                state.unlockMethod = action.payload.data?.unlockMethod;
            })
            .addCase(setLocked.fulfilled, (state, action) => {
                state.isSetup = true;
                state.unlockMethod = action.meta.arg.type || "pin";
            })
            .addCase(setUnlocked.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(setUnlocked.fulfilled, (state, action) => {
                // console.log(action.meta);
                // state.unlockToken = action.meta.arg.token;
                state.isUnLocked = true;
                state.loading = false;
                state.error = null;
                state.unlockToken = action.payload.data?.lockedToken;
                console.log("Locked Token", action.payload.data);
                localStorage.setItem("lockedToken", action.payload.data?.lockedToken);
                localStorage.setItem("lockedSessionId", action.payload.data?.lockedSessionId);
            })
            .addCase(setUnlocked.rejected, (state, action) => {
                state.error = action.payload || action.error.message;
                state.loading = false;
            })
            .addCase(exitLocked.fulfilled, (state, action) => {
                // console.log(action.meta);
                // state.unlockToken = action.meta.arg.token;
                state.isUnLocked = false;
                state.loading = false;
                state.error = null;
                state.unlockToken = "";
                console.log("Locked Token", action.payload.data);
                localStorage.removeItem("lockedToken");
                localStorage.removeItem("lockedSessionId");
            })
    }
});

// export { getLockedData, getLockedStatus, setLockedFolder };
export const {addLockedFilesOptimistic,clearLockedFolderState,setLockedCurrentFolder } = lockedSlice.actions;

export default lockedSlice.reducer;