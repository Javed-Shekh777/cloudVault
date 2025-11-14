import React, { Outlet } from 'react'
import FileUploader from './components/FileUploader'
import FileManager from './pages/FileManager'

const App = () => {
  return (
    <>
      <Outlet />
      {/* <div>
        <FileUploader />
        <FileManager />
      </div> */}
    </>


  )
}

export default App
