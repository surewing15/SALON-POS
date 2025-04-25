import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import "./App.css";
import Login from "./pages/Login";
import Dashboard from "./pages/dashboard";
import logo from "../../assets/zar.png";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Router>
      <div className="logo-container">
   
        <a href="/">
          <img src={logo} className="app-logo" alt="App Logo" />
        </a>
      </div>

      <Routes>
    
        <Route path="/" element={<Login />} />

        <Route path="/dashboard" element={<Dashboard />} />
        

      </Routes>

 
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
      Click on the logo to go back to the login page.
      </p>
    </Router>
  );
}

export default App;