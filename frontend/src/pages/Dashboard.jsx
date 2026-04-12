import React, { useState, useEffect } from 'react'
import { dashboardAPI } from '../utils/apiClient'
import './Dashboard.css'
import KPICard from '../components/KPICard'
import SalesGraph from '../components/SalesGraph'
import ActivityFeed from '../components/ActivityFeed'
import SalesPeopleList from '../components/SalesPeopleList'

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [activities, setActivities] = useState(null);
  const [salesPeople, setSalesPeople] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, graphRes, activitiesRes, salesPeopleRes] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getSalesGraph(),
        dashboardAPI.getActivities(),
        dashboardAPI.getActiveSalesPeople()
      ]);

      setStats(statsRes.data.cards);
      setGraphData(graphRes.data.data);
      setActivities(activitiesRes.data.activities);
      setSalesPeople(salesPeopleRes.data.salesPeople);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load dashboard');
      console.error('Dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Top Bar with Search */}
      <div className="dashboard-top-bar">
        <div className="search-box">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search here..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="breadcrumb">
        <span className="breadcrumb-item">Home</span>
        <span className="breadcrumb-separator">›</span>
        <span className="breadcrumb-item active">Dashboard</span>
      </div>

      {/* KPI Cards */}
      <div className="kpi-section">
        {stats && (
          <>
            <KPICard
              title="Unassigned Leads"
              value={stats.unassignedLeads}
              icon="unassigned"
            />
            <KPICard
              title="Assigned This Week"
              value={stats.assignedThisWeek}
              icon="assigned"
            />
            <KPICard
              title="Active Salespeople"
              value={stats.activeSalesPeople}
              icon="people"
            />
            <KPICard
              title="Conversion Rate"
              value={`${stats.conversionRate}%`}
              icon="target"
            />
          </>
        )}
      </div>

      {/* Content Grid: Chart + Activity */}
      <div className="content-grid">
        {/* Sales Analytics */}
        <div className="chart-container">
          <h2 className="section-title">Sale Analytics</h2>
          {graphData && <SalesGraph data={graphData} />}
        </div>

        {/* Recent Activity */}
        <div className="activity-container">
          <h2 className="section-title">Recent Activity Feed</h2>
          {activities && <ActivityFeed activities={activities} />}
        </div>
      </div>

      {/* Sales People Table */}
      <div className="sales-people-container">
        <h2 className="section-title">Active Sales People</h2>
        {salesPeople && <SalesPeopleList salesPeople={salesPeople} />}
      </div>
    </div>
  );
};

export default Dashboard;
