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
import React, { useMemo, useEffect } from "react";
import { useTable, useSortBy } from "react-table";
import { Link } from "react-router-dom";
import cx from "classnames";
import BubbleTableCell from "./BubbleTableCell";
import DeltaTableCell from "./DeltaTableCell";
import { formatPercent } from "../../utils";
import {
  VitalsSummaryTableRow,
  METRIC_TYPES,
  ENTITY_TYPES,
} from "../PageVitals/types";
import { convertIdToSlug } from "../../utils/navigation";
import { toTitleCase } from "../../utils/formatStrings";

import "./VitalsSummaryTable.scss";

type PropTypes = {
  summaries: VitalsSummaryTableRow[];
  selectedSortBy: string;
};

const VitalsSummaryTable: React.FC<PropTypes> = ({
  summaries,
  selectedSortBy,
}) => {
  const createBubbleTableCell = ({ value }: { value: number }) => (
    <BubbleTableCell value={value} />
  );

  const createDeltaTableCell = ({ value }: { value: number }) => (
    <DeltaTableCell value={value} />
  );
  const { entityType } = summaries[0].entity;

  const data = useMemo(() => summaries, [summaries]);
  const columns = useMemo(
    () => [
      {
        Header: " ",
        columns: [
          {
            Header: toTitleCase(entityType),
            accessor: "entity",
            Cell: ({
              value,
            }: {
              value: {
                entityId: string;
                entityName: string;
                entityType: string;
              };
            }) =>
              value.entityType === ENTITY_TYPES.OFFICE ? (
                <Link
                  className="VitalsSummaryTable__link"
                  to={`/community/vitals/${convertIdToSlug(value.entityId)}`}
                >
                  {value.entityName}
                </Link>
              ) : (
                value.entityName
              ),
          },
        ],
      },
      {
        Header: "Overall performance",
        columns: [
          {
            Header: "Overall score",
            id: METRIC_TYPES.OVERALL,
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
            id: METRIC_TYPES.DISCHARGE,
            accessor: "timelyDischarge",
            Cell: createBubbleTableCell,
          },
          {
            Header: "Program availability",
            id: METRIC_TYPES.FTR_ENROLLMENT,
            accessor: "timelyFtrEnrollment",
            Cell: createBubbleTableCell,
          },
          {
            Header: "Timely contacts",
            id: METRIC_TYPES.CONTACT,
            accessor: "timelyContact",
            Cell: createBubbleTableCell,
          },
          {
            Header: "Timely risk assessments",
            id: METRIC_TYPES.RISK_ASSESSMENT,
            accessor: "timelyRiskAssessment",
            Cell: createBubbleTableCell,
          },
        ],
      },
    ],
    [entityType]
  );

  const sortBy = useMemo(() => ({ id: selectedSortBy, desc: false }), [
    selectedSortBy,
  ]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    setSortBy,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
      initialState: { sortBy: [sortBy] },
    },
    useSortBy
  );

  useEffect(() => {
    setSortBy([sortBy]);
  }, [setSortBy, sortBy]);

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
                    <div className="VitalsSummaryTable__sortable-header">
                      {column.render("Header")}
                      <div className="VitalsSummaryTable__sort">
                        <div
                          className={cx(
                            "VitalsSummaryTable__sort__button VitalsSummaryTable__sort__button--up",
                            {
                              "VitalsSummaryTable__sort__button--active":
                                column.isSorted && column.isSortedDesc,
                            }
                          )}
                        />
                        <div
                          className={cx(
                            "VitalsSummaryTable__sort__button VitalsSummaryTable__sort__button--down",
                            {
                              "VitalsSummaryTable__sort__button--active":
                                column.isSorted && !column.isSortedDesc,
                            }
                          )}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="VitalsSummaryTable__header">
                      {column.render("Header")}
                    </div>
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
