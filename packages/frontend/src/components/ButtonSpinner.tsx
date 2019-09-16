import React from "react";
import { Spinner } from "react-bootstrap";

export default () => (
  <Spinner
    as="span"
    animation="border"
    size="sm"
    role="status"
    aria-hidden="true"
    className="mr-1"
  />
);
