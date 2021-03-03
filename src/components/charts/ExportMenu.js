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
import PropTypes from "prop-types";
import { observer } from "mobx-react-lite";

import {
  downloadChartAsImage,
  downloadChartAsData,
  downloadHtmlElementAsImage,
} from "../../utils/downloads/downloads";
import { useRootStore } from "../../StoreProvider";

// ExportMenu used by Lantern charts only
const ExportMenu = ({
  chartId,
  timeWindowDescription,
  metricTitle,
  shouldExport = true,
  regularElement = false,
  fixLabelsInColumns = false,
  datasets,
  labels,
  dataExportLabel,
}) => {
  const { methodology, filtersStore } = useRootStore();
  const [isModalOpened, setIsModalOpened] = useState(false);
  const additionalInfo = methodology[chartId] || [];

  const toggleModal = useCallback(() => {
    setIsModalOpened(!isModalOpened);
  }, [isModalOpened]);

  const hideModal = useCallback(() => {
    setIsModalOpened(false);
  }, []);

  return (
    <span className="ExportMenu fa-pull-right">
      <Dropdown drop="down" alignRight>
        <Dropdown.Toggle
          variant="link"
          role="button"
          id={`exportDropdownMenuButton-${chartId}`}
          className="no-after text-decoration-none"
        >
          <span className="h4">...</span>
        </Dropdown.Toggle>
        <Dropdown.Menu
          className="dropdown-menu"
          aria-labelledby={`exportDropdownMenuButton-${chartId}`}
        >
          <Dropdown.Item as="button" onClick={toggleModal}>
            Additional info
          </Dropdown.Item>
          {shouldExport && !regularElement && (
            <Dropdown.Item
              as="button"
              onClick={() =>
                downloadChartAsImage({
                  chartId,
                  chartTitle: metricTitle,
                  filters: filtersStore.stringsForDownload,
                  timeWindowDescription,
                  shouldZipDownload: true,
                  methodology,
                })
              }
            >
              Export image
            </Dropdown.Item>
          )}
          {shouldExport && regularElement && (
            <Dropdown.Item
              as="button"
              onClick={() =>
                downloadHtmlElementAsImage({
                  chartId,
                  chartTitle: metricTitle,
                  filters: filtersStore.stringsForDownload,
                  timeWindowDescription,
                  shouldZipDownload: true,
                  methodology,
                })
              }
            >
              Export image
            </Dropdown.Item>
          )}
          <Dropdown.Item
            as="button"
            onClick={() =>
              downloadChartAsData({
                chartId,
                chartTitle: metricTitle,
                chartDatasets: datasets,
                chartLabels: labels,
                dataExportLabel,
                filters: filtersStore.stringsForDownload,
                timeWindowDescription,
                shouldZipDownload: true,
                fixLabelsInColumns,
                methodology,
              })
            }
          >
            Export data
          </Dropdown.Item>
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
                {additionalInfo.map((info) => (
                  <div key={info.id}>
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

ExportMenu.defaultProps = {
  regularElement: false,
  shouldExport: true,
  datasets: null,
  labels: null,
  fixLabelsInColumns: false,
  dataExportLabel: null,
};

ExportMenu.propTypes = {
  chartId: PropTypes.string.isRequired,
  timeWindowDescription: PropTypes.string.isRequired,
  metricTitle: PropTypes.string.isRequired,
  regularElement: PropTypes.bool,
  shouldExport: PropTypes.bool,
  datasets: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      data: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.string),
        PropTypes.arrayOf(PropTypes.number),
      ]).isRequired,
    })
  ),
  labels: PropTypes.arrayOf(PropTypes.string),
  fixLabelsInColumns: PropTypes.bool,
  dataExportLabel: PropTypes.string,
};

export default observer(ExportMenu);
