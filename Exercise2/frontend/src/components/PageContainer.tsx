import React from "react";
import { Card } from "react-bootstrap";
import { RouteComponentProps } from "@reach/router";
import BlurredText from "./BlurredText";

const PageContainer = (
  props: {
    header?: React.ReactNode;
    children?: React.ReactNode;
  } & RouteComponentProps
) => (
  <Card className="h-100">
    <Card.Header>{props.header || <BlurredText text="Title" />}</Card.Header>
    <Card.Body>
      {props.children || <BlurredText text="Content will come here" />}
    </Card.Body>
  </Card>
);

export default PageContainer;
