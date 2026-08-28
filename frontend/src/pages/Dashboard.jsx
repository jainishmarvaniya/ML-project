import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/GlassCard';
import { StatCard } from '../components/StatCard';
import { TableSkeleton } from '../components/LoadingSkeleton';
import { useApp } from '../context/AppContext';
import { getDatasetRecords } from '../services/api';
import { exportDatasetToCsv } from '../utils/exportCsv';
import { formatCurrency, formatNumber, formatDate } from '../utils/formatters';
import { 
  Database, 
  FileSpreadsheet, 
  Search, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2,
  Table as TableIcon,
  BarChart2
} from 'lucide-react';

export const Dashboard = () => {
  const { datasetInfo } = useApp();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        // Fetch historical data
        const data = await getDatasetRecords(2000, 0);
        if (data && data.records) {
          setRecords(data.records);
        }
      } catch (err) {
        console.error("Failed loading dataset records:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  // Filtered dataset logic
  const filteredRecords = records.filter(r => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return (
      r.Date.toLowerCase().includes(term) ||
      r.Open.toString().includes(term) ||
      r.Close.toString().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage) || 1;
  const currentRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-8 py-6 max-w-7xl mx-auto px-4">
      {/* Page Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white flex items-center space-x-3">
            <FileSpreadsheet className="w-8 h-8 text-cyan-400" />
            <span>Dataset Preview & Statistics</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Exploratory Data Analysis of Tata Consultancy Services (TCS.NS) Historical Market Data
          </p>
        </div>

        <button
          onClick={() => exportDatasetToCsv(records)}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs font-semibold hover:opacity-90 transition flex items-center space-x-2 self-start md:self-auto shadow-lg shadow-cyan-500/20"
        >
          <Download className="w-4 h-4" />
          <span>Export TCS CSV Dataset</span>
        </button>
      </div>

      {/* Dataset Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Rows"
          value={datasetInfo?.Total_Rows ? datasetInfo.Total_Rows.toLocaleString() : "5,926"}
          subtitle="Total Trading Days"
          icon={Database}
          color="blue"
        />
        <StatCard
          title="Total Columns"
          value={datasetInfo?.Total_Columns ? datasetInfo.Total_Columns : "6"}
          subtitle="Date, Open, High, Low, Close, Volume"
          icon={TableIcon}
          color="purple"
        />
        <StatCard
          title="Missing Values"
          value="0 Nulls"
          subtitle="Clean Preprocessed CSV Data"
          icon={CheckCircle2}
          color="emerald"
        />
        <StatCard
          title="Listing Date Range"
          value="2002 - Present"
          subtitle={`${datasetInfo?.Date_Range?.Min || '2002-08-12'} to ${datasetInfo?.Date_Range?.Max || '2026'}`}
          icon={BarChart2}
          color="cyan"
        />
      </div>

      {/* Numerical Feature Statistics Summary Table */}
      {datasetInfo?.Stats_Summary && (
        <GlassCard className="space-y-4 border border-slate-800">
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <BarChart2 className="w-5 h-5 text-cyan-400" />
            <span>Descriptive Statistics (Feature Overview)</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-mono">
                  <th className="py-2.5 px-3">Metric</th>
                  <th className="py-2.5 px-3">Open (₹)</th>
                  <th className="py-2.5 px-3">High (₹)</th>
                  <th className="py-2.5 px-3">Low (₹)</th>
                  <th className="py-2.5 px-3">Close (₹)</th>
                  <th className="py-2.5 px-3">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {['mean', 'std', 'min', 'median', 'max'].map((statKey) => (
                  <tr key={statKey} className="hover:bg-slate-800/30">
                    <td className="py-2.5 px-3 font-semibold uppercase text-cyan-300">{statKey}</td>
                    <td className="py-2.5 px-3">{formatNumber(datasetInfo.Stats_Summary.Open?.[statKey])}</td>
                    <td className="py-2.5 px-3">{formatNumber(datasetInfo.Stats_Summary.High?.[statKey])}</td>
                    <td className="py-2.5 px-3">{formatNumber(datasetInfo.Stats_Summary.Low?.[statKey])}</td>
                    <td className="py-2.5 px-3">{formatNumber(datasetInfo.Stats_Summary.Close?.[statKey])}</td>
                    <td className="py-2.5 px-3">{formatNumber(datasetInfo.Stats_Summary.Volume?.[statKey], 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      )}

      {/* Main Interactive Dataset Table with Search & Pagination */}
      <GlassCard className="space-y-6 border border-slate-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white">Historical Stock Data Records</h2>
            <p className="text-xs text-slate-400">Viewing parsed TCS dataset entries</p>
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search by date or price..."
              className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
        </div>

        {loading ? (
          <TableSkeleton />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Open (₹)</th>
                  <th className="py-3 px-4">High (₹)</th>
                  <th className="py-3 px-4">Low (₹)</th>
                  <th className="py-3 px-4">Close (Target ₹)</th>
                  <th className="py-3 px-4">Volume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {currentRecords.length > 0 ? (
                  currentRecords.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 text-cyan-300 font-medium">{formatDate(row.Date)}</td>
                      <td className="py-3 px-4 text-slate-200">{formatCurrency(row.Open)}</td>
                      <td className="py-3 px-4 text-emerald-400">{formatCurrency(row.High)}</td>
                      <td className="py-3 px-4 text-rose-400">{formatCurrency(row.Low)}</td>
                      <td className="py-3 px-4 text-white font-bold">{formatCurrency(row.Close)}</td>
                      <td className="py-3 px-4 text-slate-400">{row.Volume.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500">
                      No records found matching "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 gap-4">
          <span>
            Showing page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong> ({filteredRecords.length} total records)
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl glass-card border border-slate-700/60 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 py-1 font-mono text-cyan-400 bg-cyan-500/10 rounded-lg">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl glass-card border border-slate-700/60 text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
