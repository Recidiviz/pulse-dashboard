// Recidiviz - a data platform for criminal justice reform
// Copyright (C) 2020 Recidiviz, Inc.
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

import { useEffect } from "react";

const HELP_SCOUT_ID = "help_scout";

const useHelpScout = () => {
  useEffect(() => {
    if (!document.getElementById(HELP_SCOUT_ID)) {
      const helpScoutScript = document.createElement("script");
      helpScoutScript.id = HELP_SCOUT_ID;
      // prettier-ignore
      // eslint-disable-next-line max-len
      helpScoutScript.innerHTML = '!function(e,t,n){function a(){var e=t.getElementsByTagName("script")[0],n=t.createElement("script");n.type="text/javascript",n.async=!0,n.src="https://beacon-v2.helpscout.net",e.parentNode.insertBefore(n,e)}if(e.Beacon=n=function(t,n,a){e.Beacon.readyQueue.push({method:t,options:n,data:a})},n.readyQueue=[],"complete"===t.readyState)return a();e.attachEvent?e.attachEvent("onload",a):e.addEventListener("load",a,!1)}(window,document,window.Beacon||function(){});';
      document.head.append(helpScoutScript);
    }

    window.Beacon("init", "97c454d9-8aef-447d-b617-bc765ab43f8c");

    return () => window.Beacon("destroy");
  }, []);
};

export default useHelpScout;
