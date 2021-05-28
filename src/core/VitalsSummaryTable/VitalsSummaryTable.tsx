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
import { ENTITY_TYPES, EntityType } from "../models/types";
import { VitalsSummaryTableRow, METRIC_TYPES } from "../PageVitals/types";
import { convertToSlug } from "../../utils/navigation";

import "./VitalsSummaryTable.scss";
import flags from "../../flags";

function getEntityTypeName(entityType: EntityType): string {
  switch (entityType) {
    case ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION:
      return "Office";
    case ENTITY_TYPES.PO:
      return "Officer";
    default:
      throw new Error(`Unknown entity type ${entityType}`);
  }
}

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
            Header: getEntityTypeName(entityType),
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
              value.entityType === ENTITY_TYPES.LEVEL_1_SUPERVISION_LOCATION ||
              flags.enableVitalsOfficerView ? (
                <Link
                  className="VitalsSummaryTable__link"
                  to={`/community/vitals/${convertToSlug(value.entityId)}`}
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
            Header: "30D change",
            accessor: "overall30Day",
            Cell: createDeltaTableCell,
          },
          {
            Header: "90D change",
            accessor: "overall90Day",
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
                <th
                  id={column.id}
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.canSort ? (
                    <div
                      className={`VitalsSummaryTable__sortable-header VitalsSummaryTable__sortable-header--${column.id}`}
                    >
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
                  const { column } = cell;
                  return (
                    <td
                      className={`VitalsSummaryTable__cell--${column.id}`}
                      {...cell.getCellProps()}
                    >
                      {cell.render("Cell")}
                    </td>
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
