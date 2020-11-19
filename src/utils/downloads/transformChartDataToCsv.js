import csvExport from "jsonexport";

async function transformChartDataToCsv(
  datasets,
  labels,
  convertValuesToNumbers,
  isTable
) {
  const datasetsWithoutTrendLine = datasets.filter(
    (dataset) => dataset.label !== "trendline"
  );

  let formattedData;

  if (!isTable && labels.length > datasetsWithoutTrendLine.length) {
    formattedData = labels.map((label, index) => {
      const dataPoints = datasetsWithoutTrendLine.reduce((acc, dataset) => {
        let dataPoint = dataset.data[index];

        if (convertValuesToNumbers && !Number.isNaN(Number(dataPoint))) {
          dataPoint = Number(dataPoint);
        }

        return { ...acc, [dataset.label]: dataPoint };
      }, {});

      return {
        dimension: label,
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
        dataset.label ? { dimension: dataset.label } : {}
      );
    });
  }

  try {
    return await csvExport(formattedData, {
      mapHeaders: (header) => header.replace("dimension", ""),
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
    throw e;
  }
}

export default transformChartDataToCsv;
