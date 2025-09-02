import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../api/api";
import CustomerList from "../../components/CustomerList/CustomerList";
import SearchFilter from "../../components/SearchFilter/SearchFilter";
import Pagination from "../../components/Pagination/Pagination";
import "./CustomerListPage.css";

const CustomerListPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [searchParams, setSearchParams] = useState({});


  const fetchCustomers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams({
        page: params.page || pagination.page,
        limit: params.limit || pagination.limit,
        ...params,
      }).toString();

      const response = await api.get(`/customers?${queryParams}`);
      setCustomers(response.data.data);
      setPagination(response.data.pagination);
      setSearchParams(params);
    } catch (err) {
      console.error("Error fetching customers:", err);
      setError("Failed to load customers. Please try again.");
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearch = (params) => {
    fetchCustomers({ ...params, page: 1 });
  };

  const handleClear = () => {
    fetchCustomers({ page: 1 });
  };

  const handlePageChange = (newPage) => {
    fetchCustomers({ ...searchParams, page: newPage });
  };

  const handleDelete = async (customerId) => {
    if (!window.confirm("Are you sure you want to delete this customer? This will also delete all their addresses.")) {
      return;
    }

    try {
      await api.delete(`/customers/${customerId}`);
      fetchCustomers({ ...searchParams, page: pagination.page });
    } catch (err) {
      console.error("Error deleting customer:", err);
      alert(err.response?.data?.error || "Failed to delete customer");
    }
  };

  return (
    <div className="customer-list-page">
      <div className="page-header">
        <h2>Customer Directory</h2>
        <Link to="/add-customer" className="btn btn-primary">
          Add New Customer
        </Link>
      </div>

      <SearchFilter
        onSearch={handleSearch}
        onClear={handleClear}
        loading={loading}
      />

      {error && (
        <div className="alert alert-error">
          {error}
          <button
            onClick={() => fetchCustomers()}
            className="btn btn-secondary btn-sm"
            style={{ marginLeft: '1rem' }}
          >
            Try Again
          </button>
        </div>
      )}

      <div className="customers-container">
        <CustomerList
          customers={customers}
          onDelete={handleDelete}
          loading={loading}
        />
      </div>

      {pagination.totalPages > 1 && (
        <Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          loading={loading}
        />
      )}

      {!loading && customers.length === 0 && (
        <div className="empty-state">
          <h3>No customers found</h3>
          <p>Try adjusting your search criteria or add a new customer.</p>
          <Link to="/add-customer" className="btn btn-primary">
            Add Your First Customer
          </Link>
        </div>
      )}
    </div>
  );
};

export default CustomerListPage;
