import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useState } from "react";
import { Toaster } from 'react-hot-toast';

export default function RootLayout() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header open={open} setOpen={setOpen} />
        <div className="flex flex-1">
          <Sidebar open={open} setOpen={setOpen} />
          <main className="flex-1 sm:p-4 p-2">
            <Outlet />
          </main>
        </div>
      </div>
     

    </>

  );
}
