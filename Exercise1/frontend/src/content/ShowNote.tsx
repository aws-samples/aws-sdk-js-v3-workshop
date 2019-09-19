import React, { useState, useEffect } from "react";
import { RouteComponentProps, navigate } from "@reach/router";
import { Form, Card } from "react-bootstrap";
import Loading from "../components/Loading";
import config from "../config";
import DeleteNoteButton from "./DeleteNoteButton";
import SaveNoteButton from "./SaveNoteButton";
import getObjectUrl from "../libs/getObjectUrl";

const ShowNote = (props: RouteComponentProps<{ noteId: string }>) => {
  const { noteId } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [noteContent, setNoteContent] = useState();
  const [attachment, setAttachment] = useState();
  const [attachmentURL, setAttachmentURL] = useState();

  useEffect(() => {
    const fetchNote = async (noteId: string) => {
      setIsLoading(true);
      const fetchURL = `${config.GatewayURL}/notes/${noteId}`;

      try {
        const response = await fetch(fetchURL);
        const data = await response.json();
        setNoteContent(data.content.S as string);
        if (data.attachment) {
          setAttachment(data.attachment.S);
          setAttachmentURL(await getObjectUrl(data.attachment.S));
        }
      } catch (error) {
        // Navigate to 404 page, as noteId probably not present
        navigate("/404");
      } finally {
        setIsLoading(false);
      }
    };
    fetchNote(noteId || "");
  }, [noteId]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <form>
          <Form.Group controlId="content">
            <Form.Label>Note Content</Form.Label>
            <Form.Control
              as="textarea"
              defaultValue={noteContent}
              onChange={e => {
                const content = e.currentTarget.value;
                if (content) {
                  setNoteContent(content);
                }
              }}
            />
          </Form.Group>
          {attachmentURL && (
            <Form.Group>
              <Form.Label>Attachment</Form.Label>
              <Form.Text>
                <Card.Link href={attachmentURL}>
                  <span role="img" aria-label="attachment" className="mr-1">
                    📎
                  </span>
                  {attachment.replace(/^\w+-/, "")}
                </Card.Link>
              </Form.Text>
            </Form.Group>
          )}
          <SaveNoteButton noteId={noteId || ""} noteContent={noteContent} />
          <DeleteNoteButton noteId={noteId || ""} attachment={attachment} />
        </form>
      )}
    </>
  );
};

export default ShowNote;
