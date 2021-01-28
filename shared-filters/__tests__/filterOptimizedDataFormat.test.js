// describe("test for filterOptimizedDataFormat", () => {
//   const metadata = {
//     total_data_points: "11",
//     value_keys: ["total_revocations"],
//     dimension_manifest: [
//       ["district", ["4", "5", "6"]],
//       ["month", ["11", "12"]],
//       ["supervision_type", ["parole", "probation"]],
//       ["year", ["2020"]],
//     ],
//   };

//   describe("when apiData is the unflattenedValues", () => {
//     const apiData = [
//       ["0", "0", "1", "1", "2", "0", "0", "1", "1", "2", "2"],
//       ["0", "0", "0", "0", "0", "1", "1", "1", "1", "1", "1"],
//       ["0", "1", "0", "1", "0", "0", "1", "0", "1", "0", "1"],
//       ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
//       ["100", "68", "73", "41", "10", "30", "36", "51", "38", "15", "4"],
//     ];

//     const fullOutput = [
//       {
//         district: "4",
//         year: "2020",
//         month: "11",
//         supervision_type: "PAROLE",
//         total_revocations: "100",
//       },
//       {
//         district: "4",
//         year: "2020",
//         month: "11",
//         supervision_type: "PROBATION",
//         total_revocations: "68",
//       },
//       {
//         district: "5",
//         year: "2020",
//         month: "11",
//         supervision_type: "PAROLE",
//         total_revocations: "73",
//       },
//       {
//         district: "5",
//         year: "2020",
//         month: "11",
//         supervision_type: "PROBATION",
//         total_revocations: "41",
//       },
//       {
//         district: "6",
//         year: "2020",
//         month: "11",
//         supervision_type: "PAROLE",
//         total_revocations: "10",
//       },
//       {
//         district: "4",
//         year: "2020",
//         month: "12",
//         supervision_type: "PAROLE",
//         total_revocations: "30",
//       },
//       {
//         district: "4",
//         year: "2020",
//         month: "12",
//         supervision_type: "PROBATION",
//         total_revocations: "36",
//       },
//       {
//         district: "5",
//         year: "2020",
//         month: "12",
//         supervision_type: "PAROLE",
//         total_revocations: "51",
//       },
//       {
//         district: "5",
//         year: "2020",
//         month: "12",
//         supervision_type: "PROBATION",
//         total_revocations: "38",
//       },
//       {
//         district: "6",
//         year: "2020",
//         month: "12",
//         supervision_type: "PAROLE",
//         total_revocations: "15",
//       },
//       {
//         district: "6",
//         year: "2020",
//         month: "12",
//         supervision_type: "PROBATION",
//         total_revocations: "4",
//       },
//     ];

//     it("correctly parses data points, regardless of filtering", () => {
//       const filtered = filterMethods.filterOptimizedDataFormat({
//         apiData,
//         metadata,
//         filterFn: () => true,
//       });
//       expect(filtered).toEqual(fullOutput);
//     });

//     it("correctly parses and filter data points", () => {
//       const filtered = filterMethods.filterOptimizedDataFormat({
//         apiData,
//         metadata,
//         filterFn: (item, dimensionKey) =>
//           dimensionKey !== "supervision_type" ||
//           item.supervision_type.toUpperCase() === "PAROLE",
//       });

//       const expected = [
//         fullOutput[0],
//         fullOutput[2],
//         fullOutput[4],
//         fullOutput[5],
//         fullOutput[7],
//         fullOutput[9],
//       ];
//       expect(filtered).toEqual(expected);
//     });

//     it("correctly parses and filter data points with multiple filters", () => {
//       const filtered = filterMethods.filterOptimizedDataFormat({
//         apiData,
//         metadata,
//         filterFn: (item, dimensionKey) => {
//           if (dimensionKey === "supervision_type") {
//             return item.supervision_type.toUpperCase() === "PAROLE";
//           }
//           if (dimensionKey === "month") {
//             return item.month === "11";
//           }
//           return true;
//         },
//       });

//       const expected = [fullOutput[0], fullOutput[2], fullOutput[4]];
//       expect(filtered).toEqual(expected);
//     });

//     it("correctly returns an empty list with a falsey filter", () => {
//       const filtered = filterMethods.filterOptimizedDataFormat({
//         apiData,
//         metadata,
//         filterFn: () => false,
//       });

//       expect(filtered).toEqual([]);
//     });
//   });

//   describe("when apiData is the expanded objects", () => {
//     const apiData = [
//       {
//         district: "4",
//         year: "2020",
//         month: "11",
//         supervision_type: "PAROLE",
//         total_revocations: "100",
//       },
//       {
//         district: "4",
//         year: "2020",
//         month: "11",
//         supervision_type: "PROBATION",
//         total_revocations: "68",
//       },
//       {
//         district: "5",
//         year: "2020",
//         month: "11",
//         supervision_type: "PAROLE",
//         total_revocations: "73",
//       },
//       {
//         district: "5",
//         year: "2020",
//         month: "11",
//         supervision_type: "PROBATION",
//         total_revocations: "41",
//       },
//       {
//         district: "6",
//         year: "2020",
//         month: "11",
//         supervision_type: "PAROLE",
//         total_revocations: "10",
//       },
//       {
//         district: "4",
//         year: "2020",
//         month: "12",
//         supervision_type: "PAROLE",
//         total_revocations: "30",
//       },
//       {
//         district: "4",
//         year: "2020",
//         month: "12",
//         supervision_type: "PROBATION",
//         total_revocations: "36",
//       },
//       {
//         district: "5",
//         year: "2020",
//         month: "12",
//         supervision_type: "PAROLE",
//         total_revocations: "51",
//       },
//       {
//         district: "5",
//         year: "2020",
//         month: "12",
//         supervision_type: "PROBATION",
//         total_revocations: "38",
//       },
//       {
//         district: "6",
//         year: "2020",
//         month: "12",
//         supervision_type: "PAROLE",
//         total_revocations: "15",
//       },
//       {
//         district: "6",
//         year: "2020",
//         month: "12",
//         supervision_type: "PROBATION",
//         total_revocations: "4",
//       },
//     ];

//     it("correctly parses data points, regardless of filtering", () => {
//       const filtered = filterMethods.filterOptimizedDataFormat({
//         apiData,
//         metadata,
//         filterFn: () => true,
//       });
//       expect(filtered).toEqual(apiData);
//     });

//     it("correctly parses and filter data points", () => {
//       const filtered = filterMethods.filterOptimizedDataFormat({
//         apiData,
//         metadata,
//         filterFn: (item) => item.supervision_type.toUpperCase() === "PAROLE",
//       });

//       const expected = [
//         apiData[0],
//         apiData[2],
//         apiData[4],
//         apiData[5],
//         apiData[7],
//         apiData[9],
//       ];
//       expect(filtered).toEqual(expected);
//     });

//     it("correctly parses and filter data points with multiple filters", () => {
//       const filtered = filterMethods.filterOptimizedDataFormat({
//         apiData,
//         metadata,
//         filterFn: (item) => {
//           return (
//             item.supervision_type.toUpperCase() === "PAROLE" &&
//             item.month === "11"
//           );
//         },
//       });

//       const expected = [apiData[0], apiData[2], apiData[4]];
//       expect(filtered).toEqual(expected);
//     });

//     it("correctly returns an empty list with a falsey filter", () => {
//       const filtered = filterMethods.filterOptimizedDataFormat({
//         apiData,
//         metadata,
//         filterFn: () => false,
//       });

//       expect(filtered).toEqual([]);
//     });
//   });
// });
