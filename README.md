# recidiviz
An in-progress effort to visualize recidivism metrics.

## Data
Standardized data sets for tracking recidivism are difficult to come by. Data that we are using for this project can be found in the `/data` directory, grouped by source. Inside each source directory will be scripts for extracting and transforming the data into a suitable format, as well as extracts we have created for the project.

### Bureau of Justice Statistics
The [United States Bureau of Justice Statistics](https://bjs.gov/) published [_Recidivism Of Prisoners Released In 30 States In 2005: Patterns From 2005 To 2010_](https://www.bjs.gov/index.cfm?ty=pbdetail&iid=4986), which gathered and analyzed data regarding inmates released from prisons in 30 states in 2005 to determine recidivism rates among inmates over the ensuing 5 years. The data is broken down by demographics, sentence history, and criminal offense. The BJS in turn built [a tool for sifting through that data](https://www.bjs.gov/recidivism_2005_arrest/#) to look up recidivism rates for inmates matching certain characteristics.

We wrote a script to repeatedly request the endpoint behind that tool to create bulk extracts of certain projections of the data set. Those extracts are included here and are totally free for any use you see fit, as long as you provide citation to the underlying study and obey any terms of use on the BJS website. Citation:

Snyder, Howard N., Durose, Matthew R., Cooper, Alexia, and Mulako-Wangota, Joseph. Bureau of Justice Statistics. Generated using the Prisoner Recidivism Analysis Tool - 2005 (PRAT-2005) at http://www.bjs.gov/recidivism_2005_arrest/. (02/04/2016).

## License
This project is licensed under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.
