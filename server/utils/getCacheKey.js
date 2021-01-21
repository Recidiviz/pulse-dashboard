const {
  SUBSET_MANIFEST,
  FILES_WITH_SUBSETS,
} = require("../core/subsetManifest");

/**
 * Utility for creating cache keys for a stateCode, metric, file and subset
 */
function getCacheKey({ stateCode, metricType, file, cacheKeySubset }) {
  let cacheKey = `${stateCode.toUpperCase()}-${metricType}`;

  if (file) {
    cacheKey = `${cacheKey}-${file}`;
  }

  if (!cacheKeySubset || !FILES_WITH_SUBSETS.includes(file)) {
    return cacheKey;
  }

  const subsetManifest = Object.entries(SUBSET_MANIFEST);

  subsetManifest.forEach(([dimensionKey, dimensionSubsets]) => {
    const subsetValue = cacheKeySubset[dimensionKey];
    const subsetIndex = dimensionSubsets.findIndex(
      (subset) => subsetValue && subset.includes(subsetValue)
    );
    if (subsetValue && subsetIndex !== null) {
      cacheKey = `${cacheKey}-${dimensionKey}=${subsetIndex}`;
    }
  });

  return cacheKey;
}

module.exports = { getCacheKey };
