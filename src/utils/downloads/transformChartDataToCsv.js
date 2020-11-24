import csvExport from "jsonexport";

async function transformChartDataToCsv(
  datasets,
  labels,
  dataExportLabel,
  convertValuesToNumbers,
  fixLabelsInColumns = null
) {
  const datasetsWithoutTrendLine = datasets.filter(
    (dataset) => dataset.label !== "trendline"
  );

  let formattedData;

  if (!fixLabelsInColumns && labels.length >= datasetsWithoutTrendLine.length) {
    formattedData = labels.map((label, index) => {
      const dataPoints = datasetsWithoutTrendLine.reduce((acc, dataset) => {
        let dataPoint = dataset.data[index];

        if (convertValuesToNumbers && !Number.isNaN(Number(dataPoint))) {
          dataPoint = Number(dataPoint);
        }

        return { ...acc, [dataset.label]: dataPoint };
      }, {});

      return {
        [dataExportLabel]: `'${label}`,
        ...dataPoints,
      };
    });
  } else {
    formattedData = datasetsWithoutTrendLine.map((dataset) => {
      return dataset.data.reduce(
        (acc, dataPoint, index) => ({
          ...acc,
          [labels[index]]: dataPoint,
        }),
        dataset.label ? { [dataExportLabel]: dataset.label } : {}
      );
    });
  }

  try {
    return await csvExport(formattedData, {
      headers: dataExportLabel ? [dataExportLabel] : [],
    });
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export default transformChartDataToCsv;
