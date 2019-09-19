import React, { useState, useEffect } from "react";
import { Link, RouteComponentProps } from "@reach/router";
import config from "../config";
import Loading from "../components/Loading";
import { Card, Alert, CardColumns, Button } from "react-bootstrap";

interface Note {
  noteId: string;
  createdAt: string;
  content: string;
  attachment: boolean;
}

const ListNotes = (props: RouteComponentProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    const fetchNotes = async () => {
      setIsLoading(true);
      const fetchURL = `${config.GatewayURL}/notes`;

      try {
        const response = await fetch(fetchURL);
        const data = await response.json();
        setNotes(
          data.reduce((notes: Note[], note: any) => {
            notes.push({
              noteId: note.noteId.S as string,
              createdAt: note.createdAt.N as string,
              content: note.content.S as string,
              attachment: note.attachment ? true : false
            });
            return notes;
          }, [])
        );
      } catch (error) {
        setErrorMsg(`${error.toString()} - ${fetchURL}`);
      } finally {
        setIsLoading(false);
      }
    };
    fetchNotes();
  }, []);

  const renderNotes = (notes: Note[]) =>
    notes.map(note => (
      <Link key={note.noteId} to={`/notes/${note.noteId}`}>
        <Card>
          <Card.Body>
            <Card.Title>
              {note.attachment && (
                <span role="img" aria-label="attachment" className="mr-1">
                  📎
                </span>
              )}
              {note.content}
            </Card.Title>
            <Card.Subtitle className="text-muted">
              Created: {new Date(parseInt(note.createdAt)).toLocaleString()}
            </Card.Subtitle>
          </Card.Body>
        </Card>
      </Link>
    ));

  const createNewNote = () => (
    <Link key="new" to="note/new">
      <Button variant="primary" block>
        Create a new note
      </Button>
    </Link>
  );

  return (
    <>
      {errorMsg && <Alert variant="danger">{errorMsg}</Alert>}
      {isLoading ? (
        <Loading />
      ) : (
        <div>
          <CardColumns>{renderNotes(notes)}</CardColumns>
          {createNewNote()}
        </div>
      )}
    </>
  );
};

export default ListNotes;
