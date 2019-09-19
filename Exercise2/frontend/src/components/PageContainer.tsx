import React from "react";
import { Card } from "react-bootstrap";
import BlurredText from "./BlurredText";

const PageContainer = (props: {
  header?: React.ReactNode;
  children?: React.ReactNode;
}) => (
  <Card>
    <Card.Header>{props.header || <BlurredText text="Title" />}</Card.Header>
    <Card.Body>
      {props.children || <BlurredText text="Content will come here" />}
    </Card.Body>
  </Card>
);

export default PageContainer;
