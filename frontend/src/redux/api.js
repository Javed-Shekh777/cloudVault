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
  reducerPath: 'driveApi',
  baseQuery: baseQuery, // Use the customized baseQuery
  tagTypes: ['File'],
  endpoints: (builder) => ({
    // GET /files
    getFiles: builder.query({
      query: () => '/files',
      providesTags: ['File'],
    }),

    // POST /files/upload
    uploadFile: builder.mutation({
      // Receives an array of File objects
      query: (filesArray) => { 
        const formData = new FormData();
        
        // Append all files to the 'files' key (as required by the backend)
        filesArray.forEach(file => {
          formData.append('files', file);
        });

        return {
          url: '/files/upload',
          method: 'POST',
          body: formData, // FormData is handled correctly by fetchBaseQuery
        };
      },
      // Note: Invalidating tags AFTER the upload is complete is crucial
      invalidatesTags: ['File'], 
    }),

    // GET /files/download/:id
    downloadFile: builder.query({
      query: (id) => `/files/download/${id}`,
    }),

    // DELETE /files/delete/:id
    deleteFile: builder.mutation({
      query: (id) => {
        return {
          url: `/files/delete/${id}`,
          method: 'DELETE',
        };
      },
      invalidatesTags: ['File'],
    }),
  }),
});

export const {
  useGetFilesQuery,
  useUploadFileMutation,
  useDownloadFileQuery,
  useDeleteFileMutation,
} = driveApi;
