import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import Customers from "./pages/Customers";
import Profile from "./pages/Profile";

function App() {
  return (
    <div className="App">
      <nav>Banking System</nav>
      <main>
        <BrowserRouter>
          <Routes>
            <Route path="profile" element={<Profile />} />
            <Route path="*" element={<Customers />} />
          </Routes>
        </BrowserRouter>
      </main>
    </div>
  );
}

export default App;
