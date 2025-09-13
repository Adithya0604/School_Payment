import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown, Filter, Search } from "lucide-react";

const AUTH_TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0cnVzdGVlSWQiOiI2NWIwZTU1MmRkMzE5NTBhOWI0MWM1YmEiLCJJbmRleE9mQXBpS2V5Ijo2fQ.IJWTYCOurGCFdRM2xyKtw6TEcuwXxGnmINrXFfsAdt0";

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const itemsPerPage = 8;

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:9003/api/user/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: AUTH_TOKEN,
        },
      });
      const data = await res.json();

      const mappedData = data.map((item) => ({
        collect_id: item._id,
        school_id: item.school_id,
        gateway_name: item.gateway_name,
        status: "Pending",
        custom_order_id: item.order_id,
        createdAt: item.createdAt,
      }));

      setTransactions(mappedData);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
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
      tx.collect_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.school_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.custom_order_id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];

    if (sortField === "createdAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    return sortOrder === "asc"
      ? aValue > bValue
        ? 1
        : -1
      : aValue < bValue
      ? 1
      : -1;
  });

  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTransactions = sortedTransactions.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const columns = [
    { key: "collect_id", label: "Collect ID" },
    { key: "school_id", label: "School ID" },
    { key: "gateway_name", label: "Gateway" },
    { key: "status", label: "Status" },
    { key: "custom_order_id", label: "Order ID" },
    { key: "createdAt", label: "Date" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] bg-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-300 mx-auto mb-3"></div>
          <div className="text-slate-300 text-sm">Loading transactions...</div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>
        {`
          body, html, #root {
            background-color: #1F2A33; /* Dark slate background matching login/register */
            margin: 10;
            padding: 10;
            font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
            color: #e1ede6;
            font-size: 10px;
            min-height: 100vh;
          }
          .container {
            padding: 24px;
            max-width: 960px;
            margin: 0 auto;
            background-color: #2f3d4a;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(0,0,0,0.7);
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          h1 {
            font-size: 1.5rem;
            font-weight: 700;
            color: #d8e3e7;
            margin: 0;
            text-align: center;
          }
          p.subtitle {
            font-size: 1rem;
            color: #a2b0bb;
            margin: 0;
            text-align: center;
          }
          .controls {
            display: flex;
            flex-wrap: wrap;
            gap: 40px;
            align-items: center;
            justify-content: center;
          }
          .search-input,
          .filter-select {
            flex: 1 1 200px;
            max-width: 200px;
          }
          .search-input input,
          .filter-select select {
            width: 100%;
            padding: 8px 12px;
            font-size: 14px;
            border-radius: 8px;
            border: none;
            outline: none;
            background-color: #ffffff;
            color: #1F2A33;
            box-shadow: 0 0 6px rgba(0,0,0,0.2);
            transition: box-shadow 0.3s ease;
          }
          .search-input input:focus,
          .filter-select select:focus {
            box-shadow: 0 0 10px #5a8fd4;
          }
          .record-count {
            color: #a2b0bb;
            font-size: 14px;
            min-width: 120px;
            text-align: center;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            color: #e1ede6;
          }
          thead {
            background-color: #3b4a59;
          }
          th, td {
            padding: 10px 14px;
            font-size: 13px;
            border-bottom: 1px solid #2b3a48;
          }
          th {
            cursor: pointer;
            font-weight: 600;
            text-transform: uppercase;
            user-select: none;
          }
          th:hover {
            background-color: #4b5c6e;
          }
          tbody tr:nth-child(even) {
            background-color: #263340;
          }
          tbody tr:hover {
            background-color: #345274;
          }
          .label-badge {
            display: inline-block;
            padding: 0.2em 0.6em;
            font-size: 11px;
            font-weight: 600;
            border-radius: 12px;
            background-color: #4b5c6e;
            color: #cbd5e1;
          }
          /* Pagination */
          .pagination {
            display: flex;
            justify-content: center;
            gap: 16px;
            padding-top: 16px;
          }
          .pagination button {
            background-color: #4b5c6e;
            border: none;
            border-radius: 8px;
            padding: 8px 14px;
            font-size: 14px;
            font-weight: 600;
            color: #cbd5e1;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }
          .pagination button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
          .pagination button:hover:not(:disabled) {
            background-color: #5a7dc1;
            color: white;
          }
          .pagination .current-page {
            font-weight: 700;
            font-size: 15px;
            line-height: 32px;
            color: #cbd5e1;
          }
          @media (max-width: 600px) {
            .controls {
              flex-direction: column;
            }
            .search-input,
            .filter-select,
            .record-count {
              max-width: 100%;
              flex: unset;
            }
          }
        `}
      </style>
      <div className="container">
        {/* Header */}
        <h1>Transaction List</h1>
        <p className="subtitle">Manage your transactions</p>

        {/* Controls */}
        <div className="controls">
          <div className="search-input">
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-select">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
            </select>
          </div>

          <div className="record-count">
            {currentTransactions.length} of {filteredTransactions.length}{" "}
            records
          </div>
        </div>

        {/* Table */}
        <table>
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  title={`Sort by ${col.label}`}
                >
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 4 }}
                  >
                    {col.label}
                    {sortField === col.key &&
                      (sortOrder === "asc" ? (
                        <ChevronUp size={12} />
                      ) : (
                        <ChevronDown size={12} />
                      ))}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {currentTransactions.map((transaction) => (
              <tr key={transaction.collect_id}>
                <td>{transaction.collect_id}</td>
                <td>{transaction.school_id}</td>
                <td>
                  <span className="label-badge">
                    {transaction.gateway_name}
                  </span>
                </td>
                <td>
                  <span className="label-badge">{transaction.status}</span>
                </td>
                <td>{transaction.custom_order_id}</td>
                <td>{formatDate(transaction.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            type="button"
          >
            Previous
          </button>
          <span className="current-page">{currentPage}</span>
          <button
            onClick={() =>
              setCurrentPage(Math.min(totalPages, currentPage + 1))
            }
            disabled={currentPage === totalPages}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default TransactionList;
