import React, { useState } from "react";

const Tabs = ({ tabs, onChange, _default, pluralize, customClass, selectedClass }) => {
  const [current, setCurrent] = useState(_default || tabs[0]);

  return(
    <div className="tabs">
      {tabs.map((tab, i) => {
        const isCurrent = current === tab;
        return(
          <span
            key={i}
            onClick={() => {
              setCurrent(tab);
              onChange(tab);
            }}
            className={`tab ${customClass} ${isCurrent ? ("current-tab " + selectedClass) : null}`}
          >
            {tab}{pluralize ? "s" : ""}
          </span>
        );
      })}
    </div>
  );
};

export default Tabs;
