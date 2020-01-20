import React from "react";
import { Table } from "../";
import { ErrorJson } from "./";

const errorSchema = {
  message: {
    title: "message",
    format: "string"
  },
  location: {
    title: "location",
    children: ({ location }) => (
      <a href={location}>{location}</a>
    ),
  },
  client: {
    title: "client",
    format: "string",
  },
  operation: {
    title: "operation",
    format: "string",
  },
  createdAt: {
    title: "date",
    format: "time",
  },
  __: {
    title: "JSON",
    children: ({ fullError }) => (
      <ErrorJson error={fullError} />
    )
  }
};

const ErrorTable = ({ errors }) => {
  return(
    <div id="admin-metrics">
      <h1>ERRORS</h1>
      <Table data={errors} schema={errorSchema} />
    </div>
  );
}

export default ErrorTable;
