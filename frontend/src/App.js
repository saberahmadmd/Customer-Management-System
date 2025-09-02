import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CustomerListPage from "./pages/CustomerListPage/CustomerListPage";
import CustomerDetailPage from "./pages/CustomerDetailPage/CustomerDetailPage";
import CustomerFormPage from "./pages/CustomerFormPage/CustomerFormPage";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <h1>Customer Management System</h1>
        </header>

        <main className="app-main">
          <Routes>
            <Route path="/" element={<CustomerListPage />} />
            <Route path="/customers/:id" element={<CustomerDetailPage />} />
            <Route path="/add-customer" element={<CustomerFormPage />} />
            <Route path="/edit-customer/:id" element={<CustomerFormPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; 2023 Customer Management System</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;