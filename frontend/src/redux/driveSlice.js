// src/redux/driveSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../services/axiosInstance";

/**
 * Thunks returned payload shapes expected:
 * - fetchFiles -> { files: [...] }
 * - uploadFile -> { data: [...] } or { data: fileObj } based on backend
 * - fetchFolders -> { folders: [...] } OR just array
 * - fetchFolderContents -> { folder, files }
 */

export const fetchFiles = createAsyncThunk(
  "drive/fetchFiles",
  async (folderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/files", { params: { folder: folderId || "" } });
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

export const uploadFile = createAsyncThunk(
  "drive/uploadFile",
  async ({ file, folderId, onProgress }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("files", file);  // ✅ check backend expects 'files'
      if (folderId) formData.append("folder", folderId);
      const res = await axiosInstance.post("/files/upload", formData, {
        onUploadProgress: (e) => {
          if (onProgress && e.total) onProgress(Math.round((e.loaded * 100) / e.total));
        },
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


// FOLDERS
export const fetchFolders = createAsyncThunk(
  "drive/fetchFolders",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/folders/get-folders");
      // backend might return { data: [...] } or [...]
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchFolderContents = createAsyncThunk(
  "drive/fetchFolderContents",
  async (folderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/folders/get-folder/${folderId}`);
      // expecting { data: { folder, files } }
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const createFolder = createAsyncThunk(
  "drive/createFolder",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/folders/create-folder", payload);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const moveFileToFolder = createAsyncThunk(
  "drive/moveFileToFolder",
  async ({ folderId, fileId }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/folders/${folderId}/add-file/${fileId}`);
      return res.data?.data ?? res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const toggleTrashStatus = createAsyncThunk(
  "drive/toggleTrashStatus",
  async ({ type, id }, { rejectWithValue }) => {
    try {
      let url = "";
      if (type === "file") url = `/files/add-remove-trash/${id}`;
      else if (type === "folder") url = `/folders/add-remove-trash/${id}`;
      const res = await axiosInstance.patch(url);
      return { type, id, data: res.data?.data ?? res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const toggleStar = createAsyncThunk(
  "drive/toggleStar",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/files/add-remove-star/${fileId}`);
      return { fileId, data: res.data?.data ?? res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const toggleTrashFile = createAsyncThunk(
  "drive/toggleTrashFile",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/files/add-remove-trash/${fileId}`);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);


export const deleteFile = createAsyncThunk(
  "drive/deleteFile",
  async (fileId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/files/delete/${fileId}`);
      console.log(res.data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const initialState = {
  folders: [],
  currentFolder: null,
  files: [],
  loading: false,
  error: null,
};

const driveSlice = createSlice({
  name: "drive",
  initialState,
  reducers: {
    clearFolderState: (state) => {
      state.folders = [];
      state.currentFolder = null;
      state.files = [];
      state.loading = false;
      state.error = null;
    },
    // helper to set current folder (useful when navigating breadcrumbs)
    setCurrentFolder: (state, action) => {
      state.currentFolder = action.payload;
    },
    // optimistic add file(s)
    addFilesOptimistic: (state, action) => {
      const payload = action.payload?.createdFiles || action.payload;
      console.log(payload);
      if (Array.isArray(payload)) state.files.push(...payload);
      else state.files.push(payload);
    },

  },
  extraReducers: (builder) => {
    builder
      // fetchFiles
      .addCase(fetchFiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFiles.fulfilled, (state, action) => {
        state.loading = false;
        console.log("Inside fetchFiles", action.payload);
        state.files = action.payload.files ?? [];
        state.folders = action.payload.folders ?? [];

      })
      .addCase(fetchFiles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      // uploadFile
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload might be array or single
        const payload = action.payload;
        if (!payload) return;
        if (Array.isArray(payload)) state.files.push(...payload);
        else if (payload.data && Array.isArray(payload.data)) state.files.push(...payload.data);
        else state.files.push(payload);
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      // fetchFolders
      .addCase(fetchFolders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.loading = false;
        state.folders = action.payload ?? action ?? [];
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      // fetchFolderContents
      .addCase(fetchFolderContents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFolderContents.fulfilled, (state, action) => {
        state.loading = false;
        // action.payload expected { folder, files }
        const payload = action.payload ?? {};
        state.currentFolder = payload.folder ?? null;
        state.files = payload.files ?? payload.filesList ?? [];
      })
      .addCase(fetchFolderContents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      // createFolder
      .addCase(createFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFolder.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) state.folders.push(action.payload);
      })
      .addCase(createFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      // moveFileToFolder
      .addCase(moveFileToFolder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(moveFileToFolder.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(moveFileToFolder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      // toggleTrashStatus
      .addCase(toggleTrashStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleTrashStatus.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleTrashStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      // toggleStar
      .addCase(toggleStar.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleStar.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(toggleStar.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      .addCase(toggleTrashFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(toggleTrashFile.fulfilled, (state, action) => {
        const { fileId, isDeleted } = action.payload?.data || {};
        console.log("Toggle Trash Fulfilled:", action.payload);

        const file = state.files.find(f => f._id === fileId);
        if (file) {
          file.isDeleted = isDeleted;
          file.trashedAt = isDeleted ? new Date().toISOString() : null;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(toggleTrashFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })

      .addCase(deleteFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFile.fulfilled, (state, action) => {
        state.files = state.files.filter(f => f._id !== action.payload?.data.fileId && f._id !== action.payload?.data);
        state.loading = false;
        state.error = null;
      }).addCase(deleteFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? action.error?.message;
      })
  },
});

export const { clearFolderState, setCurrentFolder, addFilesOptimistic } = driveSlice.actions;
export default driveSlice.reducer;
