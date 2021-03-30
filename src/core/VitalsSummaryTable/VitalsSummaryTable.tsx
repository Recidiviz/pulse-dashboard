// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================
import React, { useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import { Link } from "react-router-dom";
import cx from "classnames";
import BubbleTableCell from "./BubbleTableCell";
import DeltaTableCell from "./DeltaTableCell";
import { formatPercent } from "../../utils";

import "./VitalsSummaryTable.scss";
import { VitalsSummaryTableRow } from "../PageVitals/types";

type PropTypes = {
  summaries: VitalsSummaryTableRow[];
};

const VitalsSummaryTable: React.FC<PropTypes> = ({ summaries }) => {
  const createBubbleTableCell = ({ value }: { value: number }) => (
    <BubbleTableCell value={value} />
  );

  const createDeltaTableCell = ({ value }: { value: number }) => (
    <DeltaTableCell value={value} />
  );

  const columns = useMemo(
    () => [
      {
        Header: " ",
        columns: [
          {
            Header: "Office",
            accessor: "entity",
            Cell: ({
              value,
            }: {
              value: { entityId: string; entityName: string };
            }) => (
              // TODO slugify entityId
              // TODO do not link on officer name
              <Link to={`/community/vitals/${value.entityId}`}>
                {value.entityName}
              </Link>
            ),
          },
        ],
      },
      {
        Header: "Overall performance",
        columns: [
          {
            Header: "Overall score",
            accessor: "overall",
            Cell: ({ value }: { value: number }) => formatPercent(value),
          },
          {
            Header: "7D change",
            accessor: "overall7Day",
            Cell: createDeltaTableCell,
          },
          {
            Header: "28D change",
            accessor: "overall28Day",
            Cell: createDeltaTableCell,
          },
        ],
      },
      {
        Header: "Performance by metric",
        columns: [
          {
            Header: "Timely discharge",
            accessor: "timelyDischarge",
            Cell: createBubbleTableCell,
          },
          {
            Header: "Program availability",
            accessor: "timelyFtrEnrollment",
            Cell: createBubbleTableCell,
          },
          {
            Header: "Timely contacts",
            accessor: "timelyContacts",
            Cell: createBubbleTableCell,
          },
          {
            Header: "Timely risk assessments",
            accessor: "timelyRiskAssessments",
            Cell: createBubbleTableCell,
          },
        ],
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({ columns, data: summaries }, useSortBy);

  return (
    <div className="VitalsSummaryTable">
      <table {...getTableProps()} className="VitalsSummaryTable__table">
        <thead className="VitalsSummaryTable__table-head">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="VitalsSummaryTable__row"
            >
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.canSort ? (
                    <div className="VitalsSummaryTable__sortable">
                      {column.render("Header")}
                      <div className="triangle-switcher">
                        <div
                          className={cx(
                            "triangle-switcher__button triangle-switcher__button--up",
                            {
                              "triangle-switcher__button--active":
                                column.isSorted && column.isSortedDesc,
                            }
                          )}
                        />
                        <div
                          className={cx(
                            "triangle-switcher__button triangle-switcher__button--down",
                            {
                              "triangle-switcher__button--active":
                                column.isSorted && !column.isSortedDesc,
                            }
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    column.render("Header")
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);

            return (
              <tr
                {...row.getRowProps()}
                className="VitalsSummaryTable__row VitalsSummaryTable__row--value"
              >
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default VitalsSummaryTable;
