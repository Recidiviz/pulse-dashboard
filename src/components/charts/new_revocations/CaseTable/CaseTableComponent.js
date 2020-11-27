import React from "react";
import PropTypes from "prop-types";
import { nullSafeCell } from "./utils/helpers";
import Sortable from "./Sortable";
import Pagination from "./Pagination";

const CaseTableComponent = ({
  options,
  timeWindowDescription,
  createSortableProps,
  createUpdatePage,
  pageData,
  startCase,
  endCase,
  casesPerPage,
  exportMenu,
  totalCases,
}) => (
  <div className="CaseTable">
    <h4 className="CaseTable__title">
      Admitted individuals
      {exportMenu}
    </h4>
    <h6 className="CaseTable__time">{timeWindowDescription}</h6>
    <table>
      <thead>
        <tr>
          {options.map((option) => (
            <th key={option.key}>
              <Sortable {...createSortableProps(option.key)}>
                {option.label}
              </Sortable>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="fs-block">
        {pageData.map((details) => (
          <tr key={`${details.state_id}-${details.admissionType}`}>
            <td>{details.state_id}</td>
            {nullSafeCell(details.district)}
            {nullSafeCell(details.officer)}
            {nullSafeCell(details.risk_level)}
            {nullSafeCell(details.officer_recommendation)}
            {nullSafeCell(details.violation_record)}
          </tr>
        ))}
      </tbody>
    </table>
    {totalCases > casesPerPage && (
      <Pagination
        beginning={startCase}
        end={endCase}
        total={totalCases}
        createUpdatePage={createUpdatePage}
      />
    )}
  </div>
);

CaseTableComponent.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({ key: PropTypes.string, label: PropTypes.string })
  ).isRequired,
  timeWindowDescription: PropTypes.string.isRequired,
  createSortableProps: PropTypes.func.isRequired,
  createUpdatePage: PropTypes.func.isRequired,
  pageData: PropTypes.arrayOf(
    PropTypes.shape({
      state_id: PropTypes.string.isRequired,
      district: PropTypes.string.isRequired,
      officer: PropTypes.string.isRequired,
      risk_level: PropTypes.string.isRequired,
      officer_recommendation: PropTypes.string.isRequired,
      violation_record: PropTypes.string.isRequired,
    })
  ).isRequired,
  startCase: PropTypes.number.isRequired,
  endCase: PropTypes.number.isRequired,
  totalCases: PropTypes.number.isRequired,
  casesPerPage: PropTypes.number.isRequired,
  exportMenu: PropTypes.node.isRequired,
};

export default CaseTableComponent;
