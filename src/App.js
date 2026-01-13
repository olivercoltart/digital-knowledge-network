import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import CreateUserForm from "./CreateUserForm";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";
import Sidebar from "./Sidebar";
import ResourceUpload from "./ResourceUpload";
import Drafts from "./Drafts";
import ReviewResources from "./ReviewResources";
import ResourceProgress from "./ResourceProgress";
import SearchResources from "./SearchResources";
import AuditResources from "./AuditResources";
import DataCompliance from "./DataCompliance";
import "./App.css";

function App() {
  const [session, setSession] = useState(null);

  return (
    <BrowserRouter>
      {session ? (
        session.user.role === "DATA_OFFICER" ? (
          <div className="App">
            <Routes>
              <Route
                path="/login"
                element={<DataCompliance token={session.token} />}
              />
              <Route
                path="/"
                element={<DataCompliance token={session.token} />}
              />
              <Route
                path="/compliance"
                element={<DataCompliance token={session.token} />}
              />
            </Routes>
          </div>
        ) : (
        <div className="layout">
          <Sidebar userRole={session.user.role} />
          <main className="content">
            <Routes>
              <Route
                path="/login"
                element={
                  <Dashboard
                    user={session.user}
                    onLogout={() => setSession(null)}
                  />
                }
              />
              <Route
                path="/submit"
                element={<ResourceUpload token={session.token} />}
              />
              <Route
                path="/search"
                element={<SearchResources token={session.token} />}
              />
              <Route
                path="/recommended"
                element={<div>Recommended Resources (coming soon)</div>}
              />
              <Route
                path="/drafts"
                element={<Drafts token={session.token} />}
              />
              <Route
                path="/progress"
                element={<ResourceProgress token={session.token} />}
              />
              <Route
                path="/review"
                element={<ReviewResources token={session.token} />}
              />
              <Route
                path="/audit"
                element={<AuditResources token={session.token} />}
              />
            </Routes>
          </main>
        </div>
        )
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
