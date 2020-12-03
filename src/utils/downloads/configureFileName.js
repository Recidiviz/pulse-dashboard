import getTimeStamp from "./getTimeStamp";

function configureFilename(chartId, filters, withoutFilters) {
  let filename = `${chartId}-${getTimeStamp()}`;
  if (withoutFilters) {
    return filename;
  }

  if (filters.metricType) {
    filename += `-${filters.metricType}`;
  }
  if (filters.metricPeriodMonths) {
    filename += `-${filters.metricPeriodMonths}`;
  }
  if (filters.supervisionType) {
    filename += `-${filters.supervisionType}`;
  }
  if (filters.district) {
    filename += `-${filters.district}`;
  }
  return filename;
}

export default configureFilename;
