// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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
import cx from "classnames";
import { TableCell } from "./TableCell";
import "./StatewideViewTable.scss";

export const StatewideViewTable = () => {
  const data = useMemo(
    () => [
      {
        office: "Oakes",
        overall: 65,
        change_7: 20,
        change_28: 32,
        discharge: 12,
        participation: 88,
        contacts: 100,
        assessments: 100,
      },
      {
        office: "Dickinson",
        overall: 65,
        change_7: 19,
        change_28: 51,
        discharge: 54,
        participation: 98,
        contacts: 92,
        assessments: 100,
      },
      {
        office: "Bismark",
        overall: 68,
        change_7: 22,
        change_28: 38,
        discharge: 35,
        participation: 97,
        contacts: 93,
        assessments: 100,
      },
      {
        office: "Mandan",
        overall: 69,
        change_7: -73,
        change_28: 18,
        discharge: 20,
        participation: 83,
        contacts: 98,
        assessments: 100,
      },
    ],

    []
  );

  const columns = useMemo(
    () => [
      {
        Header: " ",
        columns: [
          {
            Header: "Office",
            accessor: "office",
          },
        ],
      },
      {
        Header: "Overall performance",
        columns: [
          {
            Header: "Overall score",
            accessor: "overall",
            Cell: ({ value }) => `${value}%`,
          },
          {
            Header: "7D change",
            accessor: "change_7",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => (
              <div className="StatewideViewTable__change">
                <div className="StatewideViewTable__arrow--decreasing" />
                {value}%
              </div>
            ),
          },
          {
            Header: "28D change",
            accessor: "change_28",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => (
              <div className="StatewideViewTable__change">
                <div className="StatewideViewTable__arrow--increasing" />
                {value}%
              </div>
            ),
          },
        ],
      },
      {
        Header: "Performance by metric",
        columns: [
          {
            Header: "Timely discharge",
            accessor: "discharge",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => <TableCell value={value} />,
          },
          {
            Header: "Program availability",
            accessor: "participation",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => <TableCell value={value} />,
          },
          {
            Header: "Timely contacts",
            accessor: "contacts",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => <TableCell value={value} />,
          },
          {
            Header: "Timely risk assessments",
            accessor: "assessments",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => <TableCell value={value} />,
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
  } = useTable({ columns, data }, useSortBy);

  return (
    <div style={{ maxWidth: "100%", overflowX: "auto", overflowY: "hidden" }}>
      <table {...getTableProps()} className="StatewideViewTable__table">
        <thead className="StatewideViewTable__table-head">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="StatewideViewTable__row"
            >
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.canSort ? (
                    <div className="StatewideViewTable__sortable">
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
                className="StatewideViewTable__row StatewideViewTable__row--value"
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
