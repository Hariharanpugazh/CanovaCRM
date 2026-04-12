import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import './SalesGraph.css';

const SalesGraph = ({ data }) => {
  return (
    <div className="sales-graph">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#666' }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 12, fill: '#666' }}
            domain={[0, 60]}
            ticks={[0, 10, 20, 30, 40, 50, 60]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            cursor={{ fill: 'transparent' }}
            contentStyle={{ borderRadius: '8px', border: '1px solid #eee' }}
            formatter={(value) => [`${value}%`, 'Conversion Rate']}
          />
          <Bar dataKey="conversionRate" barSize={20}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.day === 'Sat' ? '#333' : '#e0e0e0'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesGraph;
