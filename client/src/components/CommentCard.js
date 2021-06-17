import React from "react";
import ReactTimeAgo from "react-time-ago";
import { Row, Card, Dropdown } from "react-bootstrap";
import { ThreeDots, TrashFill, FlagFill } from "react-bootstrap-icons";
import { COMMENT_SETTINGS_ICON_SIZE } from "../constants/CommentCard.js";
import "../styles/CommentCard.css";
import DeleteCommentModal from "./DeleteCommentModal.js";
import ReportCommentModal from "./ReportCommentModal.js";

export default function CommentCard({
  sessionUsername,
  comment,
  handleSessionTimeout,
  refreshComments,
}) {
  // states
  const [showDeleteCommentModal, setShowDeleteCommentModal] = React.useState(
    false
  );
  const [showReportCommentModal, setShowReportCommentModal] = React.useState(
    false
  );

  function handleDeleteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteCommentModal(true);
  }

  function handleReportClick(e) {
    e.preventDefault();
    e.stopPropagation();
    setShowReportCommentModal(true);
  }

  const OptionsDropdownToggle = React.forwardRef(({ onClick }, ref) => (
    <ThreeDots
      className="optionsdropdowntoggle-threedots align-top"
      size={COMMENT_SETTINGS_ICON_SIZE}
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
    />
  ));

  return (
    <>
      <Card className={"mb-3"}>
        <Card.Body>
          <Card.Title>
            <span className="p-0 m-0 d-flex align-items-center">
              <span className="pr-2">{comment.name}</span>
              {sessionUsername !== "" && (
                <Dropdown className="d-inline">
                  <Dropdown.Toggle as={OptionsDropdownToggle}></Dropdown.Toggle>
                  <Dropdown.Menu>
                    {sessionUsername === comment.user_id && (
                      <Dropdown.Item as="button" onClick={handleDeleteClick}>
                        <Row className="px-3 d-flex justify-content-between align-items-center">
                          Delete
                          <TrashFill />
                        </Row>
                      </Dropdown.Item>
                    )}

                    {sessionUsername !== comment.user_id && (
                      <Dropdown.Item as="button" onClick={handleReportClick}>
                        <Row className="px-3 d-flex justify-content-between align-items-center">
                          Report
                          <FlagFill />
                        </Row>
                      </Dropdown.Item>
                    )}
                  </Dropdown.Menu>
                </Dropdown>
              )}
            </span>
          </Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            <small>
              <ReactTimeAgo
                date={new Date(comment.commented_on)}
                locale="en-US"
              />
            </small>
          </Card.Subtitle>
          <Card.Text>
            <span dangerouslySetInnerHTML={{ __html: comment.comment }}></span>
          </Card.Text>
        </Card.Body>
      </Card>

      {/* Delete Template */}
      <ReportCommentModal
        comment={comment}
        showReportCommentModal={showReportCommentModal}
        setShowReportCommentModal={setShowReportCommentModal}
        handleSessionTimeout={handleSessionTimeout}
        refreshComments={refreshComments}
      />

      {/* Report Template */}
      <DeleteCommentModal
        comment={comment}
        showDeleteCommentModal={showDeleteCommentModal}
        setShowDeleteCommentModal={setShowDeleteCommentModal}
        handleSessionTimeout={handleSessionTimeout}
        refreshComments={refreshComments}
      />
    </>
  );
}
