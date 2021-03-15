import React, { useMemo } from "react";
import { useTable, useSortBy } from "react-table";
import "./statewideViewTable.scss";
import cx from "classnames";

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
              <div className="statewideViewTable__change">
                <div className="statewideViewTable__not-stonks-arrow" />
                {value}%
              </div>
            ),
          },
          {
            Header: "28D change",
            accessor: "change_28",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => (
              <div className="statewideViewTable__change">
                <div className="statewideViewTable__stonks-arrow" />
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
            Cell: ({ value }) => (
              <span
                className={cx("statewideViewTable__bubble", {
                  "statewideViewTable__bubble--70": value < 70,
                  "statewideViewTable__bubble--80": value > 70 && value < 80,
                  "statewideViewTable__bubble--90": value > 80 && value < 90,
                  "statewideViewTable__bubble--100": value > 90,
                })}
              >
                {value}%
              </span>
            ),
          },
          {
            Header: "Program availability",
            accessor: "participation",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => (
              <span
                className={cx("statewideViewTable__bubble", {
                  "statewideViewTable__bubble--70": value < 70,
                  "statewideViewTable__bubble--80": value > 70 && value < 80,
                  "statewideViewTable__bubble--90": value > 80 && value < 90,
                  "statewideViewTable__bubble--100": value > 90,
                })}
              >
                {value}%
              </span>
            ),
          },
          {
            Header: "Timely contacts",
            accessor: "contacts",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => (
              <span
                className={cx("statewideViewTable__bubble", {
                  "statewideViewTable__bubble--70": value < 70,
                  "statewideViewTable__bubble--80": value > 70 && value < 80,
                  "statewideViewTable__bubble--90": value > 80 && value < 90,
                  "statewideViewTable__bubble--100": value > 90,
                })}
              >
                {value}%
              </span>
            ),
          },
          {
            Header: "Timely risk assessments",
            accessor: "assessments",
            // eslint-disable-next-line react/prop-types
            Cell: ({ value }) => (
              <span
                className={cx("statewideViewTable__bubble", {
                  "statewideViewTable__bubble--70": value < 70,
                  "statewideViewTable__bubble--80": value > 70 && value < 80,
                  "statewideViewTable__bubble--90": value > 80 && value < 90,
                  "statewideViewTable__bubble--100": value > 90,
                })}
              >
                {value}%
              </span>
            ),
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
      <table {...getTableProps()} className="statewideViewTable__table">
        <thead className="statewideViewTable__table-head">
          {headerGroups.map((headerGroup) => (
            <tr
              {...headerGroup.getHeaderGroupProps()}
              className="statewideViewTable__row"
            >
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.canSort ? (
                    <div className="statewideViewTable__sortable">
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
                className="statewideViewTable__row statewideViewTable__row--value"
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
