import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { privateRequest } from "../utils/useFetch";

const MonthlyReport = () => {
  const [month, setMonth] = useState(new Date().toISOString().slice(0, 7)); // YYYY-MM format
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const user = useSelector((state) => state.user);
  const http = privateRequest(user.accessToken, user.refreshToken);

  useEffect(() => {
    fetchReport();
  }, [month]);

  useEffect(() => {
    console.log("Updated reportData:", reportData);
  }, [reportData]);

  const fetchReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await http.get(`/reservation/reports/monthly/${month}`);
      setReportData(response.data);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("Failed to fetch monthly report.");
    }
    setLoading(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Monthly Report</h2>

      <div className="mb-4">
        <label className="mr-2 font-semibold">Select Month:</label>
        <input
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="border p-2 rounded-md"
        />
      </div>

      {loading ? (
        <p>Loading report...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : reportData ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            {/* Overall Summary */}
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Month</th>
                <th className="border px-4 py-2">Total Bookings</th>
                <th className="border px-4 py-2">Total Revenue</th>
                <th className="border px-4 py-2">Checked Out</th>
                <th className="border px-4 py-2">Pending Payments</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100">
                <td className="border px-4 py-2">{reportData.month}</td>
                <td className="border px-4 py-2">{reportData.totalBookings}</td>
                <td className="border px-4 py-2">Rs {reportData.revenue}</td>
                <td className="border px-4 py-2">{reportData.checkedOut}</td>
                <td className="border px-4 py-2">Rs {reportData.pendingPayments}</td>
              </tr>
            </tbody>
          </table>

          {/* Category Breakdown */}
          <h3 className="text-xl font-bold mt-6 mb-2">Category Breakdown</h3>
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Total Bookings</th>
                <th className="border px-4 py-2">Revenue</th>
                <th className="border px-4 py-2">Checked Out</th>
                <th className="border px-4 py-2">Pending Payments</th>
              </tr>
            </thead>
            <tbody>
              {reportData.categories.map((category, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border px-4 py-2">{category.name}</td>
                  <td className="border px-4 py-2">{category.totalBookings}</td>
                  <td className="border px-4 py-2">Rs {category.revenue}</td>
                  <td className="border px-4 py-2">{category.checkedOut}</td>
                  <td className="border px-4 py-2">Rs {category.pendingPayments}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No data available for this month.</p>
      )}
    </div>
  );
};

export default MonthlyReport;
