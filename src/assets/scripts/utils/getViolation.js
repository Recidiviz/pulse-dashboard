import { humanReadableTitleCase } from "../../../utils/transforms/labels";

function getViolation({ reportedViolations, violationType }) {
  let str = "";

  if (reportedViolations) {
    str += `${reportedViolations} violations or notices of citation, `;
  }

  if (violationType) {
    str += `Most severe violation: ${humanReadableTitleCase(
      violationType.toLowerCase()
    )}`;
  }

  return str;
}
export default getViolation;
