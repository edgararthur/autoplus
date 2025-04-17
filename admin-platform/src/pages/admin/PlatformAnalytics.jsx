import React, { useState, useEffect } from 'react';
import { FiDownload, FiFilter, FiCalendar, FiPieChart, FiBarChart2, FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

// Mock data for platform analytics
const MOCK_DATA = {
  totalRevenue: {
    value: 1248650,
    change: 18.2,
    isPositive: true
  },
  salesCount: {
    value: 4287,
    change: 12.5,
    isPositive: true
  },
  activeUsers: {
    value: 8942,
    change: 9.8,
    isPositive: true
  },
  averageOrderValue: {
    value: 291,
    change: 5.3,
    isPositive: true
  },
  conversionRate: {
    value: 3.42,
    change: -0.8,
    isPositive: false
  },
  categories: [
    { name: 'Engine Parts', value: 28.4 },
    { name: 'Exterior', value: 15.2 },
    { name: 'Lighting', value: 14.8 },
    { name: 'Brakes', value: 12.5 },
    { name: 'Suspension', value: 9.7 },
    { name: 'Interior', value: 8.9 },
    { name: 'Other', value: 10.5 }
  ],
  monthlyRevenue: [
    { month: 'Jan', value: 82500 },
    { month: 'Feb', value: 89700 },
    { month: 'Mar', value: 95400 },
    { month: 'Apr', value: 102800 },
    { month: 'May', value: 108500 },
    { month: 'Jun', value: 115200 },
    { month: 'Jul', value: 121900 },
    { month: 'Aug', value: 118400 },
    { month: 'Sep', value: 124600 },
    { month: 'Oct', value: 132800 },
    { month: 'Nov', value: 138650 },
    { month: 'Dec', value: 0 } // Current month (incomplete)
  ],
  topProducts: [
    { name: 'Premium LED Headlight Kit', sales: 258, revenue: 49020 },
    { name: 'Performance Brake Pad Set', sales: 204, revenue: 32640 },
    { name: 'High-Flow Air Filter', sales: 186, revenue: 13950 },
    { name: 'Synthetic Oil - 5W-30 5L', sales: 175, revenue: 10500 },
    { name: 'Suspension Lowering Kit', sales: 142, revenue: 32660 }
  ],
  trafficSources: [
    { source: 'Organic Search', users: 3856, percentage: 42.8 },
    { source: 'Direct', users: 1825, percentage: 20.3 },
    { source: 'Social Media', users: 1268, percentage: 14.1 },
    { source: 'Referral', users: 989, percentage: 11.0 },
    { source: 'Email', users: 652, percentage: 7.3 },
    { source: 'Other', users: 410, percentage: 4.5 }
  ],
  userDevices: [
    { device: 'Desktop', percentage: 48.6 },
    { device: 'Mobile', percentage: 42.3 },
    { device: 'Tablet', percentage: 9.1 }
  ],
  geographicData: [
    { region: 'North America', sales: 2486, percentage: 58.0 },
    { region: 'Europe', sales: 986, percentage: 23.0 },
    { region: 'Asia', sales: 472, percentage: 11.0 },
    { region: 'Australia', sales: 214, percentage: 5.0 },
    { region: 'South America', sales: 86, percentage: 2.0 },
    { region: 'Africa', sales: 43, percentage: 1.0 }
  ]
};

// Format currency function
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Generate simple chart function (this is a placeholder for actual chart rendering)
const generateBarChart = (data, valueKey = 'value') => {
  const maxValue = Math.max(...data.map(item => item[valueKey]));

  return (
    <div className="flex items-end h-40 space-x-2">
      {data.map((item, index) => {
        const height = item[valueKey] > 0 ? (item[valueKey] / maxValue) * 100 : 0;
        return (
          <div key={index} className="flex flex-col items-center flex-1">
            <div 
              className="w-full bg-blue-500 rounded-t-sm transition-all duration-500"
              style={{ height: `${height}%` }}
            ></div>
            <div className="text-xs mt-1 text-gray-500 w-full text-center truncate">
              {item.month || item.name}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Generate pie chart function (placeholder)
const generatePieChart = (data) => {
  // In a real app, this would use a proper chart library
  return (
    <div className="space-y-2 mt-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full"
              style={{ width: `${item.value || item.percentage}%` }}
            ></div>
          </div>
          <div className="ml-3 flex justify-between items-center w-40">
            <span className="text-sm text-gray-700">{item.name || item.source || item.device || item.region}</span>
            <span className="text-sm font-medium text-gray-900">{item.value || item.percentage}%</span>
          </div>
        </div>
      ))}
    </div>
  );
};

const PlatformAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [timeRange, setTimeRange] = useState('year');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString().slice(0, 10),
    end: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    // Simulate API call to fetch analytics data
    const fetchData = () => {
      setTimeout(() => {
        setData(MOCK_DATA);
        setLoading(false);
      }, 800);
    };
    
    fetchData();
  }, [timeRange]);

  // Handle time range change
  const handleTimeRangeChange = (range) => {
    setTimeRange(range);
    
    // Update date range based on selected time range
    const now = new Date();
    let start;
    
    switch(range) {
      case 'month':
        start = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case 'quarter':
        start = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
        break;
      case 'year':
        start = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
        break;
      default:
        start = new Date(now.getFullYear(), now.getMonth() - 12, now.getDate());
    }
    
    setDateRange({
      start: start.toISOString().slice(0, 10),
      end: now.toISOString().slice(0, 10)
    });
  };

  return (
    <div className="px-6 py-6 w-full">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Platform Analytics</h1>
          <p className="text-gray-600">
            Performance metrics and insights for the entire platform
          </p>
        </div>
        <div className="flex space-x-4">
          <div className="relative">
            <div className="flex items-center bg-white rounded-lg border border-gray-300 px-3 py-2">
              <FiCalendar className="text-gray-400 mr-2" />
              <span className="text-sm">
                {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
              </span>
            </div>
          </div>
          <div>
            <div className="flex rounded-md shadow-sm">
              <button
                className={`px-4 py-2 text-sm border border-gray-300 rounded-l-md ${
                  timeRange === 'month' ? 'bg-blue-50 text-blue-600 border-blue-500' : 'bg-white text-gray-700'
                }`}
                onClick={() => handleTimeRangeChange('month')}
              >
                Month
              </button>
              <button
                className={`px-4 py-2 text-sm border-t border-b border-gray-300 ${
                  timeRange === 'quarter' ? 'bg-blue-50 text-blue-600 border-blue-500' : 'bg-white text-gray-700'
                }`}
                onClick={() => handleTimeRangeChange('quarter')}
              >
                Quarter
              </button>
              <button
                className={`px-4 py-2 text-sm border border-gray-300 rounded-r-md ${
                  timeRange === 'year' ? 'bg-blue-50 text-blue-600 border-blue-500' : 'bg-white text-gray-700'
                }`}
                onClick={() => handleTimeRangeChange('year')}
              >
                Year
              </button>
            </div>
          </div>
          <button
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
          >
            <FiDownload className="mr-2" />
            Export
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Key metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Revenue</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(data.totalRevenue.value)}</h3>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.totalRevenue.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {data.totalRevenue.isPositive ? (
                    <FiTrendingUp className="mr-1" />
                  ) : (
                    <FiTrendingDown className="mr-1" />
                  )}
                  {data.totalRevenue.change}%
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Total Orders</p>
                  <h3 className="text-2xl font-bold mt-1">{data.salesCount.value.toLocaleString()}</h3>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.salesCount.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {data.salesCount.isPositive ? (
                    <FiTrendingUp className="mr-1" />
                  ) : (
                    <FiTrendingDown className="mr-1" />
                  )}
                  {data.salesCount.change}%
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Active Users</p>
                  <h3 className="text-2xl font-bold mt-1">{data.activeUsers.value.toLocaleString()}</h3>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.activeUsers.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {data.activeUsers.isPositive ? (
                    <FiTrendingUp className="mr-1" />
                  ) : (
                    <FiTrendingDown className="mr-1" />
                  )}
                  {data.activeUsers.change}%
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Avg. Order Value</p>
                  <h3 className="text-2xl font-bold mt-1">{formatCurrency(data.averageOrderValue.value)}</h3>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.averageOrderValue.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {data.averageOrderValue.isPositive ? (
                    <FiTrendingUp className="mr-1" />
                  ) : (
                    <FiTrendingDown className="mr-1" />
                  )}
                  {data.averageOrderValue.change}%
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between">
                <div>
                  <p className="text-sm text-gray-500 font-medium">Conversion Rate</p>
                  <h3 className="text-2xl font-bold mt-1">{data.conversionRate.value}%</h3>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  data.conversionRate.isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {data.conversionRate.isPositive ? (
                    <FiTrendingUp className="mr-1" />
                  ) : (
                    <FiTrendingDown className="mr-1" />
                  )}
                  {data.conversionRate.change}%
                </div>
              </div>
            </div>
          </div>
          
          {/* Revenue chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <FiBarChart2 className="mr-2" />
                  Monthly Revenue
                </div>
              </div>
              {generateBarChart(data.monthlyRevenue)}
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Category Distribution</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <FiPieChart className="mr-2" />
                  Sales by Category
                </div>
              </div>
              {generatePieChart(data.categories)}
            </div>
          </div>
          
          {/* Top products and traffic sources */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
                <button className="text-sm text-blue-600 hover:text-blue-800">View All</button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <th className="pb-3">Product</th>
                      <th className="pb-3">Units Sold</th>
                      <th className="pb-3">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {data.topProducts.map((product, index) => (
                      <tr key={index}>
                        <td className="py-3 text-sm font-medium text-gray-900">{product.name}</td>
                        <td className="py-3 text-sm text-gray-500">{product.sales}</td>
                        <td className="py-3 text-sm text-gray-500">{formatCurrency(product.revenue)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Traffic Sources</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <span className="mr-2">Total: {data.activeUsers.value.toLocaleString()} users</span>
                </div>
              </div>
              {generatePieChart(data.trafficSources)}
            </div>
          </div>
          
          {/* Device and geographic distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Device Distribution</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <FiFilter className="mr-2" />
                  By Device Type
                </div>
              </div>
              <div className="flex justify-around p-4">
                {data.userDevices.map((device, index) => (
                  <div key={index} className="text-center">
                    <div className="relative inline-block mx-auto">
                      <svg className="w-20 h-20">
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="36" 
                          fill="none" 
                          stroke="#E5E7EB" 
                          strokeWidth="8"
                        />
                        <circle 
                          cx="40" 
                          cy="40" 
                          r="36" 
                          fill="none" 
                          stroke="#3B82F6" 
                          strokeWidth="8"
                          strokeDasharray={`${device.percentage * 2.26} 226`}
                          strokeDashoffset="0" 
                          transform="rotate(-90 40 40)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-lg font-bold">{device.percentage}%</span>
                      </div>
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-800">{device.device}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Geographic Distribution</h3>
                <div className="flex items-center text-sm text-gray-500">
                  <FiFilter className="mr-2" />
                  By Region
                </div>
              </div>
              {generatePieChart(data.geographicData)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformAnalytics; 