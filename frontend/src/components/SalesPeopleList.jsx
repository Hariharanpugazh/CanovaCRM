import React from 'react';
import './SalesPeopleList.css';

const SalesPeopleList = ({ salesPeople }) => {
  return (
    <div className="sales-people-container">
      {salesPeople && salesPeople.length > 0 ? (
        <table className="sales-people-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Employee ID</th>
              <th>Assigned Leads</th>
              <th>Closed Leads</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {salesPeople.map((person) => (
              <tr key={person._id}>
                <td className="name-cell">{person.name}</td>
                <td>{person.employeeId}</td>
                <td>{person.assignedLeads}</td>
                <td>{person.closedLeads}</td>
                <td>
                  <span className={`status-badge status-${person.status.toLowerCase()}`}>
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
