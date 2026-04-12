import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './SalesGraph.css';

const SalesGraph = ({ data }) => {
  return (
    <div className="sales-graph">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis label={{ value: 'Conversion Rate (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip
            formatter={(value) => `${value}%`}
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
          <Bar dataKey="conversionRate" fill="#8b5cf6" name="Conversion Rate (%)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesGraph;
