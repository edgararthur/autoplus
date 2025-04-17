import React, { useState } from 'react';
import { 
  FiTrendingUp, 
  FiTrendingDown, 
  FiDollarSign, 
  FiShoppingCart, 
  FiUsers, 
  FiPackage,
  FiCalendar
} from 'react-icons/fi';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Mock data for analytics
const salesData = [
  { name: 'Jan', sales: 4000, orders: 24, profit: 2400 },
  { name: 'Feb', sales: 3000, orders: 18, profit: 1800 },
  { name: 'Mar', sales: 5000, orders: 30, profit: 3000 },
  { name: 'Apr', sales: 2780, orders: 16, profit: 1500 },
  { name: 'May', sales: 1890, orders: 11, profit: 1000 },
  { name: 'Jun', sales: 2390, orders: 14, profit: 1300 },
  { name: 'Jul', sales: 3490, orders: 21, profit: 2100 },
  { name: 'Aug', sales: 4000, orders: 24, profit: 2400 },
  { name: 'Sep', sales: 3000, orders: 18, profit: 1800 },
  { name: 'Oct', sales: 2000, orders: 12, profit: 1200 },
  { name: 'Nov', sales: 2780, orders: 16, profit: 1500 },
  { name: 'Dec', sales: 3890, orders: 23, profit: 2300 }
];

const categoryData = [
  { name: 'Brakes', value: 35 },
  { name: 'Engine', value: 25 },
  { name: 'Suspension', value: 15 },
  { name: 'Electrical', value: 10 },
  { name: 'Exterior', value: 8 },
  { name: 'Interior', value: 7 }
];

const topProducts = [
  { name: 'Premium Brake Pads - Toyota Camry', sales: 124, revenue: 11159.76 },
  { name: 'Engine Oil Filter - Honda Accord', sales: 98, revenue: 1269.10 },
  { name: 'Spark Plugs Set (4) - Ford F-150', sales: 87, revenue: 2827.50 },
  { name: 'Air Filter - Chevrolet Silverado', sales: 76, revenue: 1899.24 },
  { name: 'Transmission Fluid - Synthetic', sales: 65, revenue: 1218.75 }
];

const customerData = [
  { name: 'New', value: 65 },
  { name: 'Returning', value: 35 }
];

const COLORS = ['#0c8be0', '#9635f6', '#ff9500', '#22c55e', '#ef4444', '#6b7280'];

const DealerAnalytics = () => {
  const [timeRange, setTimeRange] = useState('year');
  const [dataType, setDataType] = useState('sales');
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Calculate summary metrics
  const calculateSummary = () => {
    const totalSales = salesData.reduce((sum, item) => sum + item.sales, 0);
    const totalOrders = salesData.reduce((sum, item) => sum + item.orders, 0);
    const totalProfit = salesData.reduce((sum, item) => sum + item.profit, 0);
    
    // Calculate growth (comparing last month to previous month)
    const lastMonthIndex = salesData.length - 1;
    const prevMonthIndex = salesData.length - 2;
    
    const salesGrowth = ((salesData[lastMonthIndex].sales - salesData[prevMonthIndex].sales) / salesData[prevMonthIndex].sales) * 100;
    const ordersGrowth = ((salesData[lastMonthIndex].orders - salesData[prevMonthIndex].orders) / salesData[prevMonthIndex].orders) * 100;
    const profitGrowth = ((salesData[lastMonthIndex].profit - salesData[prevMonthIndex].profit) / salesData[prevMonthIndex].profit) * 100;
    
    return {
      totalSales,
      totalOrders,
      totalProfit,
      salesGrowth,
      ordersGrowth,
      profitGrowth
    };
  };
  
  const summary = calculateSummary();
  
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Analytics Dashboard</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Track your store's performance metrics and sales trends.
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiCalendar className="h-5 w-5 text-neutral-400" />
            </div>
            <select
              className="block w-full pl-10 pr-10 py-2 text-base border-neutral-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="quarter">Last 90 Days</option>
              <option value="year">Last 12 Months</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {/* Total Sales */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiDollarSign className="h-6 w-6 text-primary-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">
                    Total Sales
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-neutral-900">
                      {formatCurrency(summary.totalSales)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm flex items-center">
              {summary.salesGrowth >= 0 ? (
                <FiTrendingUp className="h-4 w-4 text-success-500 mr-1" />
              ) : (
                <FiTrendingDown className="h-4 w-4 text-error-500 mr-1" />
              )}
              <span className={`font-medium ${summary.salesGrowth >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                {summary.salesGrowth > 0 ? '+' : ''}{summary.salesGrowth.toFixed(1)}%
              </span>
              <span className="text-neutral-500 ml-2">from previous period</span>
            </div>
          </div>
        </div>
        
        {/* Total Orders */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiShoppingCart className="h-6 w-6 text-accent-500" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">
                    Total Orders
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-neutral-900">
                      {summary.totalOrders}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm flex items-center">
              {summary.ordersGrowth >= 0 ? (
                <FiTrendingUp className="h-4 w-4 text-success-500 mr-1" />
              ) : (
                <FiTrendingDown className="h-4 w-4 text-error-500 mr-1" />
              )}
              <span className={`font-medium ${summary.ordersGrowth >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                {summary.ordersGrowth > 0 ? '+' : ''}{summary.ordersGrowth.toFixed(1)}%
              </span>
              <span className="text-neutral-500 ml-2">from previous period</span>
            </div>
          </div>
        </div>
        
        {/* Total Profit */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FiTrendingUp className="h-6 w-6 text-success-600" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-neutral-500 truncate">
                    Total Profit
                  </dt>
                  <dd>
                    <div className="text-lg font-medium text-neutral-900">
                      {formatCurrency(summary.totalProfit)}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
          <div className="bg-neutral-50 px-5 py-3">
            <div className="text-sm flex items-center">
              {summary.profitGrowth >= 0 ? (
                <FiTrendingUp className="h-4 w-4 text-success-500 mr-1" />
              ) : (
                <FiTrendingDown className="h-4 w-4 text-error-500 mr-1" />
              )}
              <span className={`font-medium ${summary.profitGrowth >= 0 ? 'text-success-600' : 'text-error-600'}`}>
                {summary.profitGrowth > 0 ? '+' : ''}{summary.profitGrowth.toFixed(1)}%
              </span>
              <span className="text-neutral-500 ml-2">from previous period</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Sales trend chart */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <h2 className="text-lg font-medium text-neutral-900">Sales Trend</h2>
          <div className="mt-3 md:mt-0">
            <div className="flex rounded-md shadow-sm">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-md ${
                  dataType === 'sales'
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                }`}
                onClick={() => setDataType('sales')}
              >
                Sales
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium ${
                  dataType === 'orders'
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                }`}
                onClick={() => setDataType('orders')}
              >
                Orders
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-md ${
                  dataType === 'profit'
                    ? 'bg-primary-100 text-primary-700 border border-primary-300'
                    : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-50'
                }`}
                onClick={() => setDataType('profit')}
              >
                Profit
              </button>
            </div>
          </div>
        </div>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={salesData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value) => dataType === 'orders' ? value : formatCurrency(value)}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={dataType}
                stroke={dataType === 'sales' ? '#0c8be0' : dataType === 'orders' ? '#ff9500' : '#22c55e'}
                activeDot={{ r: 8 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Category distribution and customer type */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Category distribution */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Sales by Category</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Customer type */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-neutral-900 mb-4">Customer Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  <Cell fill="#0c8be0" />
                  <Cell fill="#22c55e" />
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Top selling products */}
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Top Selling Products</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={topProducts}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="name" type="category" width={150} />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'sales' ? value : formatCurrency(value),
                  name === 'sales' ? 'Units Sold' : 'Revenue'
                ]}
              />
              <Legend />
              <Bar dataKey="sales" fill="#0c8be0" name="Units Sold" />
              <Bar dataKey="revenue" fill="#ff9500" name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DealerAnalytics;
