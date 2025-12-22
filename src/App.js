import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import Editor from "./page/Editor";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#1e293b",
            color: "#f1f5f9",
            border: "1px solid #334155",
            borderRadius: "0.75rem",
            fontSize: "0.875rem",
            fontWeight: "500",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
          },
          success: {
            iconTheme: {
              primary: "#34d399",
              secondary: "#1e293b",
            },
            style: {
              border: "1px solid #34d399",
            },
          },
          error: {
            iconTheme: {
              primary: "#f87171",
              secondary: "#1e293b",
            },
            style: {
              border: "1px solid #f87171",
            },
          },
        }}
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route path="/editor/:roomId" element={<Editor></Editor>} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
