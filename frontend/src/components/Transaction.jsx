import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Filter, Search } from "lucide-react";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("payment_time");
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 8;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const response = await fetch("${import.meta.env.VITE_BACKEND_URL}/api/user/", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      const mappedData = data.map((item, index) => ({
        collect_id: item.collect_request_id || `temp-${index}`,
        order_id: item.order_id || `temp-${index}`,
        school_id: item.school_id || "N/A",
        gateway_name: item.gateway || "N/A",
        status: item.status?.toUpperCase() || "PENDING",
        order_amount: item.order_amount || 0,
        transaction_amount: item.transaction_amount || 0,
        payment_mode: item.payment_mode || "N/A",
        payment_message: item.payment_message || "",
        bank_reference: item.bank_reference || "",
        payment_time: item.payment_time || new Date().toISOString(),
        createdAt: item.payment_time || new Date().toISOString(),
      }));
      setTransactions(mappedData);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
      alert(`Failed to fetch transactions: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const filteredTransactions = transactions.filter((tx) => {
    const matchesStatus = !statusFilter || tx.status === statusFilter;
    const matchesSearch =
      !searchTerm ||
      (tx.collect_id && tx.collect_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.order_id && tx.order_id.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (tx.gateway_name && tx.gateway_name.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesStatus && matchesSearch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "createdAt" || sortField === "payment_time") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortField === "order_amount" || sortField === "transaction_amount") {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    return sortOrder === "asc" ? (aValue > bValue ? 1 : -1) : aValue < bValue ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = sortedTransactions.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const formatAmount = (amount) => (amount ? `₹${amount.toLocaleString("en-IN")}` : "₹0");

  const getStatusBadge = (status) => {
    const statusColors = {
      SUCCESS: "badge-success",
      PENDING: "badge-pending",
      FAILED: "badge-failed",
    };
    const colorClass = statusColors[status] || "badge-default";
    return (
      <span className={`badge ${colorClass}`}>
        {status}
      </span>
    );
  };

  const columns = [
    { key: "order_id", label: "Order ID" },
    { key: "gateway_name", label: "Gateway" },
    { key: "order_amount", label: "Order Amount" },
    { key: "transaction_amount", label: "Transaction Amount" },
    { key: "payment_mode", label: "Payment Mode" },
    { key: "status", label: "Status" },
    { key: "collect_id", label: "Collect Request ID" },
  ];

  if (loading) {
    return (
      <>
        <style>{styles}</style>
        <div className="transaction-page flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white mx-auto mb-4"></div>
            <div className="text-lg font-medium">Loading transactions...</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="transaction-page">
        <header className="header">
          <h1>Transaction Dashboard</h1>
          <p>View and manage all payment transactions</p>
        </header>

        <section className="summary-cards">
          <div className="summary-card">
            <h3>Total Transactions</h3>
            <p>{transactions.length}</p>
          </div>
          <div className="summary-card success">
            <h3>Successful</h3>
            <p>{transactions.filter((t) => t.status === "SUCCESS").length}</p>
          </div>
          <div className="summary-card pending">
            <h3>Pending</h3>
            <p>{transactions.filter((t) => t.status === "PENDING").length}</p>
          </div>
          <div className="summary-card amount">
            <h3>Total Amount</h3>
            <p>{formatAmount(transactions.reduce((sum, t) => sum + (t.order_amount || 0), 0))}</p>
          </div>
        </section>

        <section className="filter-search">
          <div className="filter-group" style={{ position: "relative" }}>
            <Search className="icon-search" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-group" style={{ position: "relative" }}>
            <Filter className="icon-filter" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="SUCCESS">Success</option>
              <option value="PENDING">Pending</option>
              <option value="FAILED">Failed</option>
            </select>
          </div>
          <div className="page-info">
            Showing {currentTransactions.length} of {filteredTransactions.length} transactions
          </div>
        </section>

        <section className="transaction-table-wrapper">
          <table className="transaction-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <span>{col.label}</span>
                      {sortField === col.key ? (
                        sortOrder === "asc" ? <ChevronUp className="icon-sort" /> : <ChevronDown className="icon-sort" />
                      ) : null}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {currentTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="no-transactions">
                    No transactions found
                  </td>
                </tr>
              ) : (
                currentTransactions.map((transaction, index) => (
                  <tr key={transaction.collect_id || index} className="hover-row">
                    <td className="font-mono">{transaction.order_id || "N/A"}</td>
                    <td>
                      <span className="gateway-badge">
                        {transaction.gateway_name}
                      </span>
                    </td>
                    <td className="amount-green">
                      {formatAmount(transaction.order_amount)}
                    </td>
                    <td className="amount-blue">
                      {formatAmount(transaction.transaction_amount)}
                    </td>
                    <td className="uppercase">{transaction.payment_mode || "N/A"}</td>
                    <td>{getStatusBadge(transaction.status)}</td>
                    <td>{transaction.collect_id}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>

        <section className="pagination">
          <div className="page-info">
            Page {currentPage} of {totalPages || 1}
          </div>
          <div>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages || 1, currentPage + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </>
  );
};

const styles = `
  * {
    margin: 0; padding: 0; box-sizing: border-box;
  }
  html, body, #root {
    height: 100%;
    font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #405D60 0%, #2F4858 100%);
    color: #E1EDE6;
    font-size: 14px;
  }
  .transaction-page {
    min-height: 100vh;
    padding: 32px 24px;
    max-width: 1600px;
    margin: 0 auto;
  }
  .header {
    text-align: center;
    margin-bottom: 1.5rem;
  }
  .header h1 {
    font-size: 2.25rem;
    font-weight: 700;
    color: #A7C7E7;
    margin-bottom: 0.25rem;
    letter-spacing: -0.5px;
  }
  .header p {
    font-size: 1rem;
    color: #B0C9D6;
    font-weight: 400;
  }
  .summary-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1.5rem;
    margin-bottom: 1.5rem;
  }
  .summary-card {
    background-color: #1F2A33;
    border-radius: 12px;
    padding: 1.5rem;
    text-align: center;
    border: 1px solid rgba(255 255 255 / 0.06);
    box-shadow: 0 12px 18px rgba(0,0,0,0.5);
  }
  .summary-card h3 {
    font-size: 0.875rem;
    font-weight: 600;
    color: #9FB8C7;
    margin-bottom: 0.5rem;
  }
  .summary-card p {
    font-size: 2rem;
    font-weight: 700;
  }
  .summary-card.success {
    color: #34D399;
  }
  .summary-card.pending {
    color: #FBBF24;
  }
  .summary-card.amount {
    color: #3B82F6;
  }
  .filter-search {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 1.5rem;
    font-size: 0.875rem;
    color: #B0C9D6;
  }
  .filter-group {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    position: relative;
  }
  .filter-group input[type="text"],
  .filter-group select {
    background-color: #355468;
    border: 2px solid #4F6D7A;
    border-radius: 12px;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    color: #D5E1E8;
    font-size: 0.875rem;
    min-width: 200px;
    transition: all 0.3s ease;
  }
  .filter-group input[type="text"]:focus,
  .filter-group select:focus {
    border-color: #79A19B;
    outline: none;
    background-color: #4C6B72;
    box-shadow: 0 0 6px #79A19B;
    color: #E1EDE6;
  }
  .filter-group input::placeholder {
    color: #ACC6C9;
  }
  .icon-search, .icon-filter {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    stroke: #ACC6C9;
    pointer-events: none;
    width: 1.25rem;
    height: 1.25rem;
  }
  .transaction-table-wrapper {
    background-color: #1F2A33;
    border-radius: 12px;
    overflow-x: auto;
    box-shadow: 0 15px 24px rgba(0,0,0,0.55);
    border: 1px solid rgba(255 255 255 / 0.06);
  }
  .transaction-table {
    width: 100%;
    border-collapse: collapse;
    color: #D5E1E8;
  }
  .transaction-table thead {
    background-color: #355468;
  }
  .transaction-table th,
  .transaction-table td {
    padding: 1rem 1.5rem;
    text-align: left;
    font-size: 0.875rem;
    letter-spacing: 0.03em;
    vertical-align: middle;
    user-select: none;
  }
  .transaction-table th {
    font-weight: 600;
    color: #ACC6C9;
    cursor: pointer;
  }
  .transaction-table th:hover {
    background-color: #4C6B72;
    transition: background-color 0.3s ease;
  }
  .transaction-table tbody tr:hover {
    background-color: #2F4858;
    transition: background-color 0.3s ease;
  }
  .amount-green {
    color: #34D399;
    font-weight: 600;
  }
  .amount-blue {
    color: #3B82F6;
    font-weight: 600;
  }
  .badge {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
    font-weight: 600;
    border-radius: 9999px;
    display: inline-block;
    user-select: none;
    white-space: nowrap;
  }
  .badge-success {
    background-color: #16A34A;
    color: #D1FAE5;
  }
  .badge-pending {
    background-color: #CA8A04;
    color: #FEF3C7;
  }
  .badge-failed {
    background-color: #B91C1C;
    color: #FEE2E2;
  }
  .badge-default {
    background-color: #6B7280;
    color: #E5E7EB;
  }
  .pagination {
    margin-top: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.875rem;
    color: #ACC6C9;
  }
  .page-info {
    font-weight: 500;
  }
  .pagination button {
    background-color: #355468;
    border-radius: 12px;
    border: none;
    color: #E1EDE6;
    padding: 0.5rem 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-left: 4px;
  }
  .pagination button:first-child {
    margin-left: 0;
  }
  .pagination button:hover:not(:disabled) {
    background-color: #4C6B72;
    box-shadow: 0 4px 15px rgba(76,107,114,0.6);
    transform: translateY(-2px);
  }
  .pagination button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    box-shadow: none;
    transform: none;
  }
  .no-transactions {
    padding: 2rem;
    text-align: center;
    color: #ACC6C9;
    font-size: 1rem;
  }
  .font-mono {
    font-family: monospace;
  }
  .uppercase {
    text-transform: uppercase;
  }
  .gateway-badge {
    background-color: #355468;
    color: #D5E1E8;
    font-size: 0.75rem;
    font-weight: 600;
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    display: inline-block;
  }
`;

export default TransactionList;
