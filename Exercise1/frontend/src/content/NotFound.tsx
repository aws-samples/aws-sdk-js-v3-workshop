import React from "react";
import { RouteComponentProps } from "@reach/router";
import { Card } from "react-bootstrap";
import HomeButton from "../components/HomeButton";

const NotFound = (props: RouteComponentProps) => (
  <Card>
    <Card.Header>
      <HomeButton />
    </Card.Header>
    <Card.Body className="d-flex justify-content-center">
      404 Page Not Found
    </Card.Body>
  </Card>
);

export default NotFound;
