import React from "react";
import { Router } from "@reach/router";
import ListNotes from "./content/ListNotes";
import NotFound from "./content/NotFound";
import CreateNote from "./content/CreateNote";
import ShowNote from "./content/ShowNote";
import PageContainer from "./components/PageContainer";
import HomeButton from "./components/HomeButton";

export default () => (
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
);
