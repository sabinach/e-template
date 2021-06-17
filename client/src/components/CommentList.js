/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Row, Col } from "react-bootstrap";
import CommentCard from "./CommentCard.js";
import OnMount from "../utils/OnMount.js";
import RequestTemplates from "../services/RequestTemplates.js";
import RequestModeration from "../services/RequestModeration.js";
import { TEMPLATE_REFRESH_INTERVAL } from "../constants/TemplateList";

export default function CommentList({
  sessionUsername,
  templateId,
  handleSessionTimeout,
  posted,
  setPosted,
}) {
  const isFirstMount = OnMount();

  // states
  const [comments, setComments] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(() => {
    console.log("loaded");
    const interval = setInterval(() => {
      console.log("update home");
      refreshComments(false);
    }, TEMPLATE_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // on first mount
  React.useEffect(() => {
    if (templateId && !isFirstMount) {
      refreshComments(true);
    }
  }, [templateId]);

  // new comment created
  React.useEffect(() => {
    if (posted && !isFirstMount) {
      refreshComments(true);
      setPosted(false);
    }
  }, [posted]);

  // user gets signed in/out
  React.useEffect(() => {
    refreshComments(true);
  }, [sessionUsername]);

  function handleError(error) {
    if (error.response && error.response.status !== 401) {
      setIsError(true);
    }
  }

  function refreshComments(showLoading = true) {
    console.log("refreshing comments for templateId: ", templateId);
    setIsLoading(true);
    // get all templates
    RequestTemplates.getCommentsForTemplate(templateId)
      .then((res) => {
        const commentsList = res.data.comments;
        console.log("retrieved comments: ", commentsList);
        if (commentsList.length > 0) {
          // comments exist
          if (sessionUsername !== "") {
            // signed in
            RequestModeration.getReportedCommentsForUser(sessionUsername)
              .then((res) => {
                const reportedCommentIds = res.data.reported;
                console.log(
                  "retrieved reported comments: ",
                  reportedCommentIds
                );
                if (reportedCommentIds.length > 0) {
                  // filter out reported comments from existing comments
                  const filteredComments = commentsList.filter(
                    (comment) => !reportedCommentIds.includes(comment.id)
                  );
                  setIsLoading(false);
                  setComments(filteredComments);
                } else {
                  // no reported comments
                  setIsLoading(false);
                  setComments(commentsList);
                }
              })
              .catch((error) => {
                // catch getReportedCommentsForUser error
                handleError(error);
              });
          } else {
            // not signed in
            setIsLoading(false);
            setComments(commentsList);
          }
        } else {
          // no comments
          setIsLoading(false);
          setComments([]);
        }
      })
      .catch((error) => {
        // catch getCommentsForTemplate error
        handleError(error);
      });
  }

  return (
    <Row className="justify-content-md-center mb-3">
      <Col lg="7">
        {isLoading ? (
          <span>Loading comments...</span>
        ) : comments.length === 0 ? (
          <span>No comments found.</span>
        ) : isError ? (
          <Col>
            <p className="mb-0 pb-0">Something went wrong &#128546;</p>
            <p>Please reload the page.</p>
          </Col>
        ) : (
          comments !== [] &&
          comments.map((comment) => {
            console.log("creating comment");
            return (
              <CommentCard
                key={comment.id}
                sessionUsername={sessionUsername}
                comment={comment}
                handleSessionTimeout={handleSessionTimeout}
                refreshComments={refreshComments}
              />
            );
          })
        )}
      </Col>
    </Row>
  );
}
