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
import cx from "classnames";
import BubbleTableCell from "./BubbleTableCell";
import DeltaTableCell from "./DeltaTableCell";
import { formatPercent } from "../utils";

import "./VitalsSummaryTable.scss";

const VitalsSummaryTable: React.FC = () => {
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
            Cell: ({ value }: { value: number }) => formatPercent(value),
          },
          {
            Header: "7D change",
            accessor: "change_7",
            Cell: createDeltaTableCell,
          },
          {
            Header: "28D change",
            accessor: "change_28",
            Cell: createDeltaTableCell,
          },
        ],
      },
      {
        Header: "Performance by metric",
        columns: [
          {
            Header: "Timely discharge",
            accessor: "discharge",
            Cell: createBubbleTableCell,
          },
          {
            Header: "Program availability",
            accessor: "participation",
            Cell: createBubbleTableCell,
          },
          {
            Header: "Timely contacts",
            accessor: "contacts",
            Cell: createBubbleTableCell,
          },
          {
            Header: "Timely risk assessments",
            accessor: "assessments",
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
  } = useTable({ columns, data }, useSortBy);

  // TODO: Either convert back to JS or extend the react-table types that are out of date
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
                // @ts-ignore
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {
                    // @ts-ignore
                    column.canSort ? (
                      <div className="VitalsSummaryTable__sortable">
                        {column.render("Header")}
                        <div className="triangle-switcher">
                          <div
                            className={cx(
                              "triangle-switcher__button triangle-switcher__button--up",
                              {
                                "triangle-switcher__button--active":
                                  // @ts-ignore
                                  column.isSorted && column.isSortedDesc,
                              }
                            )}
                          />
                          <div
                            className={cx(
                              "triangle-switcher__button triangle-switcher__button--down",
                              {
                                "triangle-switcher__button--active":
                                  // @ts-ignore
                                  column.isSorted && !column.isSortedDesc,
                              }
                            )}
                          />
                        </div>
                      </div>
                    ) : (
                      column.render("Header")
                    )
                  }
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
