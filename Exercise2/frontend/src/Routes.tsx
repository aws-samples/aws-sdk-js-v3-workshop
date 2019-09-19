import React, { Suspense } from "react";
import { Router } from "@reach/router";
import PageContainer from "./components/PageContainer";
import HomeButton from "./components/HomeButton";
import Loading from "./components/Loading";

const ListNotes = React.lazy(() => import("./content/ListNotes"));
const CreateNote = React.lazy(() => import("./content/CreateNote"));
const ShowNote = React.lazy(() => import("./content/ShowNote"));
const NotFound = React.lazy(() => import("./content/NotFound"));

export default () => (
  <Suspense fallback={<Loading />}>
    <Router className="mt-md-4 d-flex flex-column justify-content-center">
      <PageContainer path="/" header={<div>Your Notes</div>}>
        <ListNotes path="/" />
      </PageContainer>
      <PageContainer path="/note" header={<HomeButton />}>
        <CreateNote path="/new" />
      </PageContainer>
      <PageContainer path="/notes" header={<HomeButton />}>
        <ShowNote path="/:noteId" />
      </PageContainer>
      <NotFound default />
    </Router>
  </Suspense>
);
