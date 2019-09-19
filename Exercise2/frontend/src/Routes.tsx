import React, { lazy, Suspense } from "react";
import { Router } from "@reach/router";
import { PageContainer } from "./components";

const ListNotes = lazy(() => import("./content/ListNotes"));
const CreateNote = lazy(() => import("./content/CreateNote"));
const ShowNote = lazy(() => import("./content/ShowNote"));
const NotFound = lazy(() => import("./content/NotFound"));

const Routes = () => (
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

export { Routes };
