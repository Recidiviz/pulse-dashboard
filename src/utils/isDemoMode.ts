export function isDemoMode(): boolean {
  return process.env.REACT_APP_IS_DEMO === "true";
}
