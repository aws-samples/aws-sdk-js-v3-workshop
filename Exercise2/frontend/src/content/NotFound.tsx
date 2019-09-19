import React from "react";
import { RouteComponentProps } from "@reach/router";
import HomeButton from "../components/HomeButton";
import PageContainer from "../components/PageContainer";

const NotFound = (props: RouteComponentProps) => (
  <PageContainer header={<HomeButton />}>404 Page Not Found</PageContainer>
);

export default NotFound;
