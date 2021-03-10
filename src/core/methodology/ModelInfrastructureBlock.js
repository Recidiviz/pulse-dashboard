import React from "react";
import { Table } from "reactstrap";

const ModelInfrastructureBlock = () => {
  return (
    <div className=" methodology__sub-block--description">
      <h4 className="col-12 p-0">Compartments</h4>
      <div className="col-12 p-0">
        <span>
          The Compartments component represents an area of the criminal justice
          system, such as incarceration (termers, riders, parole violators, and
          supervision (parole, probation), and release/out of the system. The
          Compartment contains a list of all the Cohorts that have been in that
          area of the system at any point within the simulation.
        </span>
        <span>
          For instance, the Compartment that represents parole supervision would
          maintain the total number of people on parole for each time step of
          the simulation. If the time step is years, then it would count the
          year-end total parole population.
        </span>
      </div>
      <div className="col-12  p-0 row no-gutters">
        <h4 className="col-12 p-0">Cohorts</h4>
        <p className="col-12 p-0">
          The Cohort component is used to record the number of people entering
          part of the system at a certain time and track how many people within
          that group remain after each time step. For example, one Cohort could
          represent the population admitted to the new offense prison population
          compartment in 2016 for a termer incarceration sentence. This Cohort
          keeps a count for the number of people admitted in 2016 along with the
          total remaining population after 2017, 2018, and so on until the
          entire
        </p>
        <div className="col-xl-6 col-12 p-0">
          <p>
            group has left prison. As portions of this group are released over
            time, additional Cohorts are created for each release period.
            Cohorts are not only separated by the entry year, but also by the
            relevant disaggregated attributes like crime type and gender.
          </p>
          <p>
            As an example, if the yearly admissions to parole were 400 people
            then the Cohorts in the parole Compartment would be represented in
            the table (Fig. 1). In this example the simulation begins in 2017
            and is initialized with the population that started parole before
            2017 and then estimates the new admissions to parole and parole
            terminations each year using the historical data. The number of
            people leaving the Cohort each year is defined within the
            Compartment Transitions explained below.
          </p>
        </div>

        <div className="table col-xl-6  col-12 align-items-end justify-content-end">
          <Table bordered style={{ height: 352, maxWidth: 728 }}>
            <tbody>
              <tr>
                <th>
                  Parole Cohort <br />
                  Start Year
                </th>
                <td>EOY 2017</td>
                <td>EOY 2018</td>
                <td>EOY 2019</td>
                <td>EOY 2020</td>
              </tr>
              <tr>
                <td>Pre-2017</td>
                <td>1,000</td>
                <td>700</td>
                <td>500</td>
                <td>400</td>
              </tr>
              <tr>
                <td>2017</td>
                <td>400</td>
                <td>300</td>
                <td>200</td>
                <td>100</td>
              </tr>
              <tr>
                <td>2018</td>
                <td>-</td>
                <td>400</td>
                <td>300</td>
                <td>200</td>
              </tr>
              <tr>
                <td>2019</td>
                <td>-</td>
                <td>-</td>
                <td>400</td>
                <td>300</td>
              </tr>
              <tr>
                <td>2020</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
                <td>400</td>
              </tr>
              <tr>
                <th>Total Population</th>
                <td>1,400</td>
                <td>1,400</td>
                <td>1,400</td>
                <td>1,000</td>
              </tr>
            </tbody>
          </Table>
          <span className="table__description">
            Fig.1 – Example Parole Cohort
          </span>
        </div>
      </div>
      <h4 className="col-12 p-0">Compartment Transitions</h4>
      <p className="col-12 p-0">
        The simulation uses sentence length distributions to calculate the
        number of people transitioning to a new area of the system after each
        time step. For example, after each year there is a proportion of the
        remaining parole population that will complete their sentence and will
        transition to the released Compartment. Likewise, there is a subset of
        that group that will have their parole revoked and that portion of the
        Cohort will transition to the state prison “parole violator”
        Compartment.
      </p>
      <p>
        These transitions are defined in transition tables, which contain the
        probability of transitioning to a new compartment versus remaining in
        the existing compartment
      </p>
      <div className="col-12 row p-0">
        <div className="col-xl-6 col-12">
          <p>
            These probabilities are specific to the time spent in the
            Compartment and they are computed using the historical data. For
            example, historical parole length data is used to initialize the
            parole supervision Compartment Transitions such that the transition
            tables match the observed sentence length distribution.
          </p>
          <p>
            Continuing with the parole example above, if the max supervision
            sentence was 4 years, the parole supervision Compartment Transition
            table might look like Fig. 2.
          </p>
          <p>
            This table would indicate that 50% of the group that has been on
            supervision for 3 years will continue on supervision, while 44% of
            that group will be successfully discharged from parole, 5% will be
            discharged for revocation and will be re-incarcerated, and 1% will
            be discharged for other reasons such as death. This table is
            generated with the available data for each simulation.
          </p>
        </div>

        <div className="table col-xl-6  col-12 align-items-end justify-content-end">
          <Table bordered style={{ maxHeight: 352, maxWidth: 728 }}>
            <tbody>
              <tr>
                <th aria-label="empty" />
                <td>After 1 Year Supervision</td>
                <td>After 2 Years Supervision</td>
                <td>After 3 Years Supervision</td>
                <td>After 4 Years Supervision</td>
              </tr>
              <tr>
                <td>Remains on Supervision</td>
                <td>75%</td>
                <td>66%</td>
                <td>50%</td>
                <td>0%</td>
              </tr>
              <tr>
                <td>Transition to Release</td>
                <td>10%</td>
                <td>23%</td>
                <td>44%</td>
                <td>99%</td>
              </tr>
              <tr>
                <td>Transition to Incarceration</td>
                <td>14%</td>
                <td>10%</td>
                <td>5%</td>
                <td>0%</td>
              </tr>
              <tr>
                <td>Transition to Other</td>
                <td />
                <td>1%</td>
                <td>1%</td>
                <td />
              </tr>
            </tbody>
          </Table>
          <span className="table__description">
            Fig. 2 – Example Compartment Transition Table
          </span>
        </div>
      </div>
      <h4 className="col-12 p-0">Forecasting Admissions</h4>
      <p>
        The model uses historical admissions to initialize historical Cohorts.
        For instance, the 2017 parole Cohort is created with the historical
        admissions to parole for 2017. However, to initialize Cohorts that have
        not been observed, an ARIMA forecast is used and is fit using the
        historical admissions trend. The model uses this to forecast admissions
        into the future and to backcast historical admissions.
      </p>
      <h4 className="col-12 p-0">Confidence Intervals</h4>
      <p>
        The model predictions are accompanied by the 80% confidence intervals to
        indicate the uncertainty of the population estimate. Statistically, the
        true observed population should fall within the confidence interval
        boundary for 80% of the observations. The model uses the confidence
        interval output from the forecast admissions and runs the max, middle,
        and min intervals through the model in order to get the three projection
        values. There is more room for improvement with this method because it
        is overcounting the total uncertainty when adding multiple intervals
        together.
      </p>
      <h4 className="col-12 p-0">County Jails Calculation</h4>
      <p>
        For the historical total incarcerated population we use the movements
        file to exclude people who have entered County Jails in unpaid beds.
        Currently, any movement period listed with the fac_cd + lu_cd code in
        the list ‘RTSX’, ‘RTUT’, ‘CJVS’, ‘CJCT’ is not counted until a
        subsequent movement is recorded without any of those codes. The county
        jails population puts the ingested actuals within 1% of IDOC’s
        historical monthly average total population validated for 2019-2020.
        More work can be done to incorporate additional logic using the
        ofndr_loc_hst table in the future, but that table covers a much smaller
        subset of the unpaid County Jail population.
      </p>
    </div>
  );
};
export default ModelInfrastructureBlock;
