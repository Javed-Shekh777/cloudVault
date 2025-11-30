import React, { Outlet } from 'react'
import FileUploader from './components/FileUploader'
import FileManager from './pages/FileManager'
import {Toaster} from 'react-hot-toast';


const App = () => {
  return (
    <>
      <Outlet />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          // Default options for all toasts
          duration: 3000,
          style: {
            padding: '12px 16px',
            fontWeight: 600,
            borderRadius: 12,
            boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
          },
          // Custom types
          success: {
            duration: 2500,
            icon: '✅',
          },
          error: {
            duration: 4000,
            icon: '❌',
          }
        }}
      />
      {/* <div>
        <FileUploader />
        <FileManager />
      </div> */}
    </>


  )
}

export default App
