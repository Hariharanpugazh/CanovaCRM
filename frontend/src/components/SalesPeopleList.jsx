import React from 'react';
import './SalesPeopleList.css';

const SalesPeopleList = ({ salesPeople }) => {
  return (
    <div className="sales-people-list-scroll">
      {salesPeople && salesPeople.length > 0 ? (
        <table className="sales-people-table">
          <thead>
            <tr>
              <th className="th-name">Name</th>
              <th className="th-id">Employee ID</th>
              <th className="th-assigned">Assigned Leads</th>
              <th className="th-closed">Closed Leads</th>
              <th className="th-status">Status</th>
            </tr>
          </thead>
          <tbody>
            {salesPeople.map((person) => (
              <tr key={person._id}>
                <td className="name-cell">
                  <div className="avatar">
                    {person.name ? person.name.split(' ').map(n => n[0]).join('') : 'U'}
                  </div>
                  <div className="person-info">
                    <span className="full-name">{person.name}</span>
                    <span className="email">{person.email}</span>
                  </div>
                </td>
                <td>
                  <span className="employee-id-badge">{person.employeeId}</span>
                </td>
                <td className="center-cell">{person.assignedLeads}</td>
                <td className="center-cell">{person.closedLeads}</td>
                <td className="status-cell">
                  <span className="status-pill status-active">
                    <span className="status-dot"></span>
                    {person.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="empty-state">No active sales people</div>
      )}
    </div>
  );
};

export default SalesPeopleList;
