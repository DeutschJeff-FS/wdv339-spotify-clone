import { useEffect, useState } from "react";
import "./App.css";
import { accessToken } from "./accessToken";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const [token, setToken] = useState(null);
  useEffect(() => {
    setToken(accessToken);
  }, []);
  return (
    <div className="App">
      <header className="App-header">
        {!token ? <Login /> : <Dashboard />}
      </header>
    </div>
  );
}

export default App;
