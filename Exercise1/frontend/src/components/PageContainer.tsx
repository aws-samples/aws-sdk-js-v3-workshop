import React from "react";
import { Card } from "react-bootstrap";
import { RouteComponentProps } from "@reach/router";

const PageContainer = (
  props: {
    header: React.ReactNode;
    children: React.ReactNode;
  } & RouteComponentProps
) => (
  <Card>
    <Card.Header>{props.header}</Card.Header>
    <Card.Body>{props.children}</Card.Body>
  </Card>
);

export default PageContainer;
