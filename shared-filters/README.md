# Shared Filters Package

Shared filtering functionality for filtering the optimized data formats on the [frontend](https://github.com/Recidiviz/pulse-dashboard/tree/main/src) and the [backend-server](https://github.com/Recidiviz/pulse-dashboard/tree/main/server).

Here's a short description for the some of the main exports:

| Function name                        | Description                                                                                                               |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------- |
| convertFromStringToUnflattenedMatrix | Converts the given optimized array as a singular string into an unflattened 2D matrix.                                    |
| filterOptimizedDataFormat            | Takes an unflattened 2D matrix, file metadata and a filter function and returns an array of filtered data point objects.  |
| validateMetadata                     | Validates that the metadata is in the correct format and is not missing any expected values.                              |
| unflattenValues                      | Unflattens an array or string by partitioning it into several sub-arrays of length equal to the provided totalDataPoints. |

## Environment

There is a dependency between the `getFilterKeys` function and the environment of the package that is using the shared-filters. `getFilterKeys` selects the format of the filter keys (camelcase vs snake-case) by checking the environment variable `REACT_APP_API_URL` to see if we are in a React environment.

## Development

If you need your dev server to watch source changes in this package, you can use [`yarn link`](https://classic.yarnpkg.com/en/docs/cli/link/) to symlink the package during development.

You must first run `yarn link` within the `shared-filters` directory, and then run `yarn link shared-filters` in each of the dependent directories to use the linked package.

```bash
# From the `shared-filters/` directory
[shared-filters]:> yarn link

# From the dependent frontend directory
[pulse-dashboard/src]:> yarn link shared-filters

# From the dependent backend directory
[pulse-dashboard/server]:> yarn link shared-filters
```
