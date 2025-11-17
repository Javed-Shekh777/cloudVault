// redux/apiSlice.js (Assuming this path)

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the custom baseQuery function
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080/api/v1',
  prepareHeaders: (headers, { getState }) => {
    // Access the token from your auth slice in the Redux store
    // Ensure you have an 'auth' slice with a 'token' field
    const token = getState().auth?.token;

    if (token) {
      // Set the authorization header for every request
      headers.set('authorization', `Bearer ${token}`);
    }
    // RTK Query handles the Content-Type for FormData automatically
    return headers;
  },
});


export const driveApi = createApi({
  reducerPath: "driveApi",
  baseQuery,
  tagTypes: ["Files", "Auth","User"],
  endpoints: (builder) => ({
    // --- Auth ---
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/localLogin",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/localRegister",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth"],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: "/user/update-profile",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Auth","User"],
    }),

    // --- Files ---
    getFiles: builder.query({
      query: () => "/files",
      providesTags: ["Files"],
    }),
    getStaredFiles: builder.query({
      query: () => "/files/stared-files",
      providesTags: ["Files"],
    }),
    uploadFile: builder.mutation({
      query: (filesArray) => {
        const formData = new FormData();
        filesArray.forEach((file) => formData.append("files", file));
        return { url: "/files/upload", method: "POST", body: formData };
      },
      invalidatesTags: ["Files"],
    }),

    addRemoveStar: builder.mutation({
      query: (id) => ({
        url: `/files/add-remove-star/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Files"],
    }),
    toggleTrashStatus: builder.mutation({
      query: (id) => ({
        url: `/files/add-remove-trash/${id}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Files"],
    }),
    downloadFile: builder.query({
      query: (id) => `/files/download/${id}`,
    }),
    deleteFile: builder.mutation({
      query: (id) => ({
        url: `/files/delete/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Files"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetFilesQuery,
  useGetStaredFilesQuery,
  useUploadFileMutation,
  useDownloadFileQuery,
  useAddRemoveStarMutation,
  useToggleTrashStatusMutation,
  useDeleteFileMutation,
  useUpdateProfileMutation
} = driveApi;

