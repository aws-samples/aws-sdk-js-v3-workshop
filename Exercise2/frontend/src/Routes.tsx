import React, { Suspense } from "react";
import { Router } from "@reach/router";
import { PageContainer } from "./components";

const ListNotes = React.lazy(() => import("./content/ListNotes"));
const CreateNote = React.lazy(() => import("./content/CreateNote"));
const ShowNote = React.lazy(() => import("./content/ShowNote"));
const NotFound = React.lazy(() => import("./content/NotFound"));

export default () => (
  <div className="mt-md-4 d-flex flex-column justify-content-center">
    <Suspense fallback={<PageContainer />}>
      <Router>
        <ListNotes path="/" />
        <CreateNote path="/note/new" />
        <ShowNote path="/notes/:noteId" />
        <NotFound default />
      </Router>
    </Suspense>
  </div>
);
