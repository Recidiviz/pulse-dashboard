import { Chart } from "react-chartjs-2";

/**
 * A hacky function to regenerate legend labels with custom colors.
 * If a chart bar is not statistically significant we should change its color/pattern (i.e. add line shading).
 * But labels/legends were generated ahead of time so the chart needs to be told to re-render them.
 */
export function generateLabelsWithCustomColors(chart, colors) {
  return Chart.defaults.global.legend.labels
    .generateLabels(chart)
    .map((label, i) => ({ ...label, fillStyle: colors[i] }));
}
