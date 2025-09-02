import React, { useState } from "react";
import "./SearchFilter.css";

const SearchFilter = ({
  onSearch,
  onFilter,
  onClear,
  loading = false
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    state: "",
    pin_code: "",
  });

  const [sortBy, setSortBy] = useState("first_name");
  const [sortOrder, setSortOrder] = useState("ASC");

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  const handleOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const searchParams = {
      search: searchTerm,
      ...filters,
      sortBy,
      order: sortOrder,
    };

    if (onSearch) {
      onSearch(searchParams);
    }
  };

  const handleClear = () => {
    setSearchTerm("");
    setFilters({
      city: "",
      state: "",
      pin_code: "",
    });
    setSortBy("first_name");
    setSortOrder("ASC");

    if (onClear) {
      onClear();
    }
  };

  return (
    <div className="search-filter">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-group">
          <input
            type="text"
            placeholder="Search customers by name or phone..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
            disabled={loading}
          />
          <button
            type="submit"
            className="btn btn-primary search-btn"
            disabled={loading}
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>
      </form>

      <div className="filter-section">
        <h4>Filter Options</h4>

        <div className="filter-grid">
          <div className="filter-group">
            <label className="filter-label">City</label>
            <input
              type="text"
              name="city"
              value={filters.city}
              onChange={handleFilterChange}
              placeholder="Filter by city"
              className="filter-input"
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">State</label>
            <input
              type="text"
              name="state"
              value={filters.state}
              onChange={handleFilterChange}
              placeholder="Filter by state"
              className="filter-input"
              disabled={loading}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">PIN Code</label>
            <input
              type="text"
              name="pin_code"
              value={filters.pin_code}
              onChange={handleFilterChange}
              placeholder="Filter by PIN code"
              className="filter-input"
              disabled={loading}
            />
          </div>
        </div>

        <div className="sort-section">
          <div className="sort-group">
            <label className="sort-label">Sort By</label>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="sort-select"
              disabled={loading}
            >
              <option value="first_name">First Name</option>
              <option value="last_name">Last Name</option>
              <option value="phone_number">Phone Number</option>
              <option value="city">City</option>
              <option value="state">State</option>
            </select>
          </div>

          <div className="sort-group">
            <label className="sort-label">Order</label>
            <select
              value={sortOrder}
              onChange={handleOrderChange}
              className="sort-select"
              disabled={loading}
            >
              <option value="ASC">Ascending</option>
              <option value="DESC">Descending</option>
            </select>
          </div>
        </div>

        <div className="action-buttons">
          <button
            type="button"
            onClick={handleSubmit}
            className="btn btn-primary"
            disabled={loading}
          >
            Apply Filters
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="btn btn-secondary"
            disabled={loading}
          >
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;