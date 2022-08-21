import "./App.css";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

function App() {
  const code = new URLSearchParams(window.location.search).get("code");
  return (
    <div className="App">
      <header className="App-header">
        {code ? <Dashboard code={code} /> : <Login />}
      </header>
    </div>
  );
}

export default App;
