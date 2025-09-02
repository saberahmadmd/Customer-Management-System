import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../../api/api";
import AddressList from "../../components/AddressList/AddressList";
import "./CustomerDetailPage.css";

const CustomerDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/customers/${id}`);
        setCustomer(response.data);
      } catch (err) {
        console.error("Error fetching customer:", err);
        setError("Customer not found or failed to load details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCustomer();
    }
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this customer? This action cannot be undone.")) {
      return;
    }

    try {
      await api.delete(`/customers/${id}`);
      navigate("/", {
        state: { message: "Customer deleted successfully" }
      });
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert(err.response?.data?.error || "Failed to delete customer");
    }
  };

  if (loading) {
    return (
      <div className="customer-detail-page">
        <div className="loading">Loading customer details...</div>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="customer-detail-page">
        <div className="error-state">
          <h3>{error || "Customer not found"}</h3>
          <p>The customer you're looking for doesn't exist or may have been deleted.</p>
          <Link to="/" className="btn btn-primary">
            Back to Customers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-detail-page">
      <div className="breadcrumb">
        <Link to="/" className="breadcrumb-link">
          ← Back to Customers
        </Link>
      </div>

      <div className="customer-header">
        <div className="customer-info">
          <h1>{customer.first_name} {customer.last_name}</h1>
          <p className="customer-phone">{customer.phone_number}</p>
          <p className="customer-id">ID: {customer.id}</p>
        </div>

        <div className="customer-actions">
          <Link
            to={`/edit-customer/${customer.id}`}
            className="btn btn-primary"
          >
            Edit Customer
          </Link>
          <button
            onClick={handleDelete}
            className="btn btn-danger"
          >
            Delete Customer
          </button>
        </div>
      </div>

      <div className="customer-content">
        <div className="addresses-section">
          <h2>Addresses</h2>
          <AddressList
            customerId={customer.id}
            initialAddresses={customer.addresses}
            canEdit={true}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomerDetailPage;
