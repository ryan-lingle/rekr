import React from "react";
import { toSats } from "../../utils";
import { Tabs } from "../";

const MetricCards = ({ metrics, setTimePeriod }) => {
  return(
    <div id="admin-metrics">
      <h1>METRICS</h1>
      <div className="time-tabs">
        <Tabs
          tabs={["alltime", "month", "day"]}
          onChange={tab => setTimePeriod(tab)}
        />
      </div>
      <div id="metrics-metrics" className="row">
        <div className="col-sm-4">
          <div className="metric-box">
            <div className="metric-header">USERS</div>
            <div className="metric-metric">{toSats(metrics.users, false)}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="metric-box">
            <div className="metric-header">REK SUM</div>
            <div className="metric-metric">{toSats(metrics.reks.sum)}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="metric-box">
            <div className="metric-header">REK FEES</div>
            <div className="metric-metric">{toSats(metrics.fees)}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="metric-box">
            <div className="metric-header">REK COUNT</div>
            <div className="metric-metric">{toSats(metrics.reks.count, false)}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="metric-box">
            <div className="metric-header">TOTAL DEPOSITS</div>
            <div className="metric-metric">{toSats(metrics.fees)}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="metric-box">
            <div className="metric-header">PODCASTS</div>
            <div className="metric-metric">{toSats(metrics.podcasts.count, false)}</div>
          </div>
        </div>
        <div className="col-sm-4">
          <div className="metric-box">
            <div className="metric-header">CLAIMED PODCASTS</div>
            <div className="metric-metric">{toSats(metrics.podcasts.claimed, false)}</div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default MetricCards;
