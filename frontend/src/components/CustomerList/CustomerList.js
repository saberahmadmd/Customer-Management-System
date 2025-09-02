import { Link } from "react-router-dom";
import "./CustomerList.css";

const CustomerList = ({ customers, onDelete, loading }) => {
  if (loading) {
    return <div className="loading">Loading customers...</div>;
  }

  if (!customers || customers.length === 0) {
    return <div className="no-data">No customers found.</div>;
  }

  return (
    <div className="customer-list">
      <div className="customer-grid">
        {customers.map((customer) => (
          <div key={customer.id} className="customer-card">
            <div className="customer-info">
              <h3 className="customer-name">
                {customer.first_name} {customer.last_name}
              </h3>
              <p className="customer-phone">{customer.phone_number}</p>

              {customer.cities && (
                <div className="customer-locations">
                  <span className="location-tag">
                    {customer.cities.split(',')[0]}
                  </span>
                </div>
              )}
            </div>

            <div className="customer-actions">
              <Link
                to={`/customers/${customer.id}`}
                className="btn btn-secondary btn-sm"
              >
                View
              </Link>

              <Link
                to={`/edit-customer/${customer.id}`}
                className="btn btn-primary btn-sm"
              >
                Edit
              </Link>

              <button
                onClick={() => onDelete(customer.id)}
                className="btn btn-danger btn-sm"
                aria-label={`Delete ${customer.first_name}`}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerList;