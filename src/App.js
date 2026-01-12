import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateUserForm from "./CreateUserForm";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import ResourceUpload from "./ResourceUpload";
import "./App.css";

function App() {
  const [session, setSession] = useState(null);

  return (
    <BrowserRouter>
      {session ? (
        <div className="layout">
          <Sidebar />
          <main className="content">
            <Routes>
              <Route
                path="/login"
                element={
                  <Dashboard user={session.user} onLogout={() => setSession(null)} />
                }
              />
              <Route
                path="/submit"
                element={<ResourceUpload token={session.token} />}
              />
              <Route
                path="/search"
                element={<div>Search Resources (coming soon)</div>}
              />
              <Route
                path="/recommended"
                element={<div>Recommended Resources (coming soon)</div>}
              />
            </Routes>
          </main>
        </div>
      ) : (
        <div className="App">
          <Routes>
            <Route path="/" element={<CreateUserForm />} />
            <Route path="/login" element={<LoginForm onLogin={setSession} />} />
          </Routes>
        </div>
      )}
    </BrowserRouter>
  );
}

export default App;
