import React from "react";
import { Router } from "@reach/router";
import ListNotes from "./content/ListNotes";
import NotFound from "./content/NotFound";
import CreateNote from "./content/CreateNote";
import ShowNote from "./content/ShowNote";

export default () => (
  <Router className="mt-md-4 d-flex flex-column justify-content-center">
    <ListNotes path="/" />
    <CreateNote path="/note/new" />
    <ShowNote path="/notes/:noteId" />
    <NotFound default />
  </Router>
);
