// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2021 Recidiviz, Inc.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.
// =============================================================================

import "./VitalsMonthlyChange.scss";

import { observer } from "mobx-react-lite";
import React from "react";

import PercentDelta from "../controls/PercentDelta";
import { useCoreStore } from "../CoreStoreProvider";

type MonthlyChangeProps = {
  numDays: number;
  value?: number;
};

const MonthlyChange: React.FC<MonthlyChangeProps> = ({ numDays, value }) => {
  return (
    <div className="VitalsMonthlyChange__container">
      <div className="VitalsMonthlyChange__title">{`${numDays}-day change`}</div>
      <div className="VitalsMonthlyChange__value">
        <PercentDelta
          className="VitalsMonthlyChange__delta"
          value={value}
          width={22}
          height={18}
          improvesOnIncrease
        />
      </div>
    </div>
  );
};

const VitalsMonthlyChange: React.FC = () => {
  const { pageVitalsStore } = useCoreStore();
  const { monthlyChange } = pageVitalsStore;
  if (!monthlyChange) return <div className="VitalsMonthlyChange" />;

  const { thirtyDayChange, ninetyDayChange } = monthlyChange;
  return (
    <div className="VitalsMonthlyChange">
      <MonthlyChange numDays={30} value={thirtyDayChange} />
      <MonthlyChange numDays={90} value={ninetyDayChange} />
    </div>
  );
};
export default observer(VitalsMonthlyChange);
