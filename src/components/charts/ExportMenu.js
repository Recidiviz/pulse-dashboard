// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2019 Recidiviz, Inc.
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

import React, { useCallback, useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";

import {
  downloadChartAsImage,
  downloadChartAsData,
  downloadHtmlElementAsImage,
  downloadHtmlElementAsData,
} from "../../assets/scripts/utils/downloads";
import chartIdToInfo from "../../utils/charts/info";

const ExportMenu = (props) => {
  const [isModalOpened, setIsModalOpened] = useState(false);
  const additionalInfo = chartIdToInfo[props.chartId] || [];

  const exportedStructureCallback = () => ({
    metric: props.metricTitle,
    series: [],
  });

  const toggleModal = useCallback(() => {
    setIsModalOpened(!isModalOpened);
  }, [isModalOpened]);

  const hideModal = useCallback(() => {
    setIsModalOpened(false);
  }, []);

  return (
    <span className="fa-pull-right">
      <Dropdown>
        <Dropdown.Toggle
          role="button"
          id={`exportDropdownMenuButton-${props.chartId}`}
        >
          ...
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="dropdown-menu dropdown-menu-right"
          aria-labelledby={`exportDropdownMenuButton-${props.chartId}`}
        >
          <Dropdown.Item as="button" onClick={toggleModal}>
            Additional info
          </Dropdown.Item>
          {(props.shouldExport === undefined || props.shouldExport === true) &&
            props.regularElement === undefined && (
              <Dropdown.Item
                as="button"
                onClick={() =>
                  downloadChartAsImage(
                    props.chartId,
                    props.metricTitle,
                    props.chart.props.data.datasets,
                    props.chart.props.data.labels,
                    exportedStructureCallback,
                    props.filters,
                    undefined,
                    undefined,
                    props.timeWindowDescription,
                    true
                  )
                }
              >
                Export image
              </Dropdown.Item>
            )}
          {(props.shouldExport === undefined || props.shouldExport === true) &&
            props.regularElement === undefined && (
              <Dropdown.Item
                as="button"
                onClick={() =>
                  downloadChartAsData(
                    props.chartId,
                    props.metricTitle,
                    props.chart.props.data.datasets,
                    props.chart.props.data.labels,
                    exportedStructureCallback,
                    props.filters,
                    undefined,
                    undefined,
                    props.timeWindowDescription,
                    true
                  )
                }
              >
                Export data
              </Dropdown.Item>
            )}
          {(props.shouldExport === undefined || props.shouldExport === true) &&
            props.regularElement && (
              <Dropdown.Item
                as="button"
                onClick={() =>
                  downloadHtmlElementAsImage(
                    props.chartId,
                    props.metricTitle,
                    props.elementDatasets,
                    props.elementLabels,
                    exportedStructureCallback,
                    props.filters,
                    undefined,
                    undefined,
                    props.timeWindowDescription,
                    true
                  )
                }
              >
                Export image
              </Dropdown.Item>
            )}
          {(props.shouldExport === undefined || props.shouldExport === true) &&
            props.regularElement && (
              <Dropdown.Item
                as="button"
                onClick={() =>
                  downloadHtmlElementAsData(
                    props.chartId,
                    props.metricTitle,
                    props.elementDatasets,
                    props.elementLabels,
                    exportedStructureCallback,
                    props.filters,
                    undefined,
                    undefined,
                    props.timeWindowDescription,
                    true
                  )
                }
              >
                Export data
              </Dropdown.Item>
            )}
          {props.isTable && props.regularElement === undefined && (
            <Dropdown.Item
              as="button"
              onClick={() =>
                downloadHtmlElementAsData(
                  props.chartId,
                  props.metricTitle,
                  props.tableData,
                  props.tableLabels,
                  exportedStructureCallback,
                  props.filters,
                  undefined,
                  undefined,
                  props.timeWindowDescription,
                  true,
                  props.isTable
                )
              }
            >
              Export data
            </Dropdown.Item>
          )}
        </Dropdown.Menu>
      </Dropdown>

      <Modal
        centered
        show={isModalOpened}
        tabIndex="-1"
        role="dialog"
        onHide={hideModal}
        scrollable
      >
        <Modal.Header>
          <h5 className="modal-title">About this chart</h5>
          <button
            type="button"
            className="close"
            onClick={hideModal}
            aria-label="Close"
          >
            <span aria-hidden="true">&times;</span>
          </button>
        </Modal.Header>
        <div className="modal-overflow">
          <Modal.Body>
            {additionalInfo.length > 0 ? (
              <ul>
                {additionalInfo.map((info, i) => (
                  <div key={i}>
                    <h6>{info.header}</h6>
                    <p>{info.body}</p>
                  </div>
                ))}
              </ul>
            ) : (
              <p>There is no additional information for this chart.</p>
            )}
          </Modal.Body>
        </div>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={hideModal}
          >
            Close
          </button>
        </Modal.Footer>
      </Modal>
    </span>
  );
};

export default ExportMenu;
