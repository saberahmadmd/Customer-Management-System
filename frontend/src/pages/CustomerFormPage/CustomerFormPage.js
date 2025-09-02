import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/api";
import CustomerForm from "../../components/CustomerForm/CustomerForm";
import "./CustomerFormPage.css";

const CustomerFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchCustomer = async () => {
        setLoading(true);
        try {
          const response = await api.get(`/customers/${id}`);
          setCustomer(response.data);
        } catch (err) {
          console.error("Error fetching customer:", err);
          setError("Failed to load customer details");
        } finally {
          setLoading(false);
        }
      };

      fetchCustomer();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (formData) => {
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isEditMode) {
        await api.put(`/customers/${id}`, formData);
        setMessage("Customer updated successfully!");
      } else {
        await api.post("/customers", formData);
        setMessage("Customer created successfully!");
      }

      setTimeout(() => {
        navigate("/", {
          state: { message: isEditMode ? "Customer updated successfully!" : "Customer created successfully!" }
        });
      }, 1500);
    } catch (err) {
      console.error("Error saving customer:", err);
      setError(err.response?.data?.error || "Failed to save customer");
    } finally {
      setLoading(false);
    }
  };

  if (isEditMode && loading && !customer) {
    return (
      <div className="customer-form-page">
        <div className="loading">Loading customer details...</div>
      </div>
    );
  }

  if (isEditMode && error && !customer) {
    return (
      <div className="customer-form-page">
        <div className="error-state">
          <h3>{error}</h3>
          <Link to="/" className="btn btn-primary">
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-form-page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          ← Back to Customers
        </Link>
      </div>

      <div className="form-container">
        <h1>{isEditMode ? "Edit Customer" : "Add New Customer"}</h1>

        {message && (
          <div className="alert alert-success">
            {message}
          </div>
        )}

        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        <CustomerForm
          initialData={customer}
          onSubmit={handleSubmit}
          submitLabel={isEditMode ? "Update Customer" : "Create Customer"}
          loading={loading}
        />
      </div>
    </div>
  );
};

export default CustomerFormPage;

