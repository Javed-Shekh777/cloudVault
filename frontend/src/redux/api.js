import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const driveApi = createApi({
  reducerPath: 'driveApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080',
  }),
  tagTypes: ['File'],
  endpoints: (builder) => ({
    // GET /files
    getFiles: builder.query({
      query: () => '/files',
      providesTags: ['File'],
    }),

    // POST /upload
    uploadFile: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/upload',
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: ['File'],
    }),

    // GET /download/:id
    downloadFile: builder.query({
      query: (id) => `/download/${id}`,
    }),

    // DELETE /delete/:id
    deleteFile: builder.mutation({
      query: (id) => {
        console.log("Deleting file with id:", id); // ✅ safe to log here
        return {
          url: `/delete/${id}`,
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
