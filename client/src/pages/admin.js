import React, { useEffect, useState } from "react";
import { Loader } from "../components";
import { ErrorTable, MetricCards } from "../components/admin";


const Admin = () => {
  const [metrics, setMetrics] = useState(null);
  const [timePeriod, setTimePeriod] = useState("alltime");

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_ADMIN_ENDPOINT}/api?t=${timePeriod}`, {
        headers: {
          admintoken: localStorage.getItem("__admin_token__"),
        },
        mode: 'cors',
      });
      if (response.status === 403) window.location = "/";
      const res = await response.json();
      setMetrics(res);
    }
    fetchData();
  }, [timePeriod]);

  return(
    <div>
      <div id="admin-content">
        {metrics ?
          <div>
            <MetricCards metrics={metrics} setTimePeriod={setTimePeriod} />
            <ErrorTable errors={metrics.errors} />
          </div>
        : <Loader />}
      </div>
    </div>
  );
};

export default Admin;
