import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "@/pages/SignupPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="*" element={<Navigate to="/signup" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
