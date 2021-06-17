/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ReactTimeAgo from "react-time-ago";
import { useHistory } from "react-router-dom";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";
import { Card, Container, Row } from "react-bootstrap";
import { Bookmark, BookmarkFill } from "react-bootstrap-icons";
import {
  CARD_BOOKMARK_ICON_SIZE,
  CARD_SETTINGS_ICON_SIZE,
} from "../constants/TemplateCard.js";
import "../styles/TemplateCard.css";
import DuplicatedFrom from "./DuplicatedFrom.js";
import RequestTemplates from "../services/RequestTemplates.js";

import DeleteModal from "./template_options/DeleteModal.js";
import DeleteDropdownItem from "./template_options/DeleteDropdownItem.js";
import ShareModal from "./template_options/ShareModal.js";
import ShareDropdownItem from "./template_options/ShareDropdownItem.js";
import ReportModal from "./template_options/ReportModal.js";
import ReportDropdownItem from "./template_options/ReportDropdownItem.js";
import DuplicateDropdownItem from "./template_options/DuplicateDropdownItem.js";
import EditDropdownItem from "./template_options/EditDropdownItem.js";
import PublishDropdownItem from "./template_options/PublishDropdownItem.js";
import UnpublishDropdownItem from "./template_options/UnpublishDropdownItem.js";
import OptionsDropdownToggle from "./template_options/OptionsDropdownToggle.js";

export default function TemplateCard({
  template,
  sessionUsername,
  updateAuthorTags,
  updateTopicTags,
  updateLocationTags,
  updateAllAuthorTags,
  updateAllTopicTags,
  updateAllLocationTags,
  handleSessionTimeout,
  refreshTemplates,
  isBookmarked,
}) {
  const history = useHistory();
  const blurbRef = React.useRef(null);

  // modals
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showReportTemplateModal, setShowReportTemplateModal] = React.useState(
    false
  );

  React.useEffect(() => {
    blurbRef.current.innerHTML = template.blurb;
  }, []);

  function handleCardClick() {
    history.push(`/use/${template.id}`);
  }
  function handleTagClick(e, tag) {
    e.stopPropagation();
    updateTopicTags(tag, "add");
    updateAllTopicTags(tag, "add");
  }
  function handleAuthorClick(e) {
    e.stopPropagation();
    updateAuthorTags(template.author, "add");
    updateAllAuthorTags(template.author, "add");
  }
  function handleLocationClick(e) {
    e.stopPropagation();
    updateLocationTags({id:template.location_id,name:template.display_location}, "add");
    updateAllLocationTags({id:template.location_id,name:template.display_location}, "add");
  }
  function handleBookmark(e) {
    console.log("adding bookmark...", template.id);
    e.stopPropagation();
    RequestTemplates.addBookmark(template.id)
      .then((res) => {
        console.log(`bookmarked template: ${res.data.template_id}`);
        refreshTemplates(false); // refresh page
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status && error.response.status === 401) {
          handleSessionTimeout();
        } else {
          history.push("/error");
        }
      });
  }
  function handleRemoveBookmark(e) {
    console.log("removing bookmark...", template.id);
    e.stopPropagation();
    RequestTemplates.deleteBookmark(template.id)
      .then((res) => {
        console.log(`unbookmarked template: ${res.data.template_id}`);
        refreshTemplates(false); // refresh page
      })
      .catch((error) => {
        console.log(error);
        if (error.response.status && error.response.status === 401) {
          handleSessionTimeout();
        } else {
          history.push("/error");
        }
      });
  }

  const dropdownMenu = sessionUsername ? (
    sessionUsername === template.creator_id ? (
      <Dropdown.Menu>
        {template.published ? (
          <UnpublishDropdownItem
            template={template}
            refreshTemplates={refreshTemplates}
            type={"templateCard"}
            handleSessionTimeout={handleSessionTimeout}
          />
        ) : (
          <PublishDropdownItem
            template={template}
            refreshTemplates={refreshTemplates}
            type={"templateCard"}
            handleSessionTimeout={handleSessionTimeout}
          />
        )}
        <EditDropdownItem
          template={template}
          handleSessionTimeout={handleSessionTimeout}
        />
        <DuplicateDropdownItem
          template={template}
          handleSessionTimeout={handleSessionTimeout}
        />
        <ShareDropdownItem setShowShareModal={setShowShareModal} />
        <DeleteDropdownItem setShowDeleteModal={setShowDeleteModal} />
      </Dropdown.Menu>
    ) : (
      <Dropdown.Menu>
        <DuplicateDropdownItem template={template} />
        <ShareDropdownItem setShowShareModal={setShowShareModal} />
        <ReportDropdownItem
          setShowReportTemplateModal={setShowReportTemplateModal}
        />
      </Dropdown.Menu>
    )
  ) : (
    <Dropdown.Menu>
      <ShareDropdownItem setShowShareModal={setShowShareModal} />
    </Dropdown.Menu>
  );

  return (
    <>
      <div onClick={handleCardClick}>
        <Card
          // border={`${sessionUsername === template.creator_id ? "light" : ""}`}
          className={`mb-4 template-card ${
            sessionUsername === template.creator_id
              ? template.published
                ? "template-card-owner"
                : "template-card-draft"
              : ""
          }`}
        >
          <Card.Body className="align-content-end d-flex flex-column">
            {/* Template Header */}
            <div width="100%">
              {/* Title */}
              <Card.Title className="mb-3 template-card-content">
                {template.title || "[Untitled]"}
              </Card.Title>
              {/* Blurb */}
              <div ref={blurbRef} className="template-card-blurb" />
            </div>

            {/* Template Info */}
            <div className="mt-auto mb-1" width="100%">
              <Card.Text>
                {/* Author */}
                <Button
                  variant="link"
                  className="m-0 p-0 template-card-content"
                  onClick={handleAuthorClick}
                >
                  {template.author}
                </Button>
                <br />
                {/* Location */}
                <Button
                  variant="link"
                  className="m-0 p-0 template-card-content"
                  onClick={handleLocationClick}
                  disabled={!template.display_location}
                >
                  {template.display_location || "No Location"}
                </Button>
                <br />
                {/* Date */}
                <small className="text-muted template-card-content">
                  {template.created_on ? (
                    template.published ? (
                      <>
                        <ReactTimeAgo
                          date={new Date(template.created_on)}
                          locale="en-US"
                        />
                      </>
                    ) : (
                      <>
                        <>Last Saved: </>
                        <ReactTimeAgo
                          date={new Date(template.created_on)}
                          locale="en-US"
                        />
                      </>
                    )
                  ) : (
                    <>Not Published Yet</>
                  )}
                </small>
                <br></br>
                <DuplicatedFrom template={template} />
              </Card.Text>

              {/* Tags */}
              <Card.Text>
                {template.tags.map((tag) => {
                  return (
                    <Button
                      size="sm"
                      variant="primary"
                      key={tag}
                      className="template-card-content rounded-pill py-0 px-7 template-card-tag"
                      onClick={(e) => handleTagClick(e, tag)}
                    >
                      {tag}
                    </Button>
                  );
                })}
              </Card.Text>

              {/* Bookmark / Edit */}
              <Card.Text as={Container} fluid>
                <Row
                  className={`d-flex justify-content-${
                    sessionUsername ? "between" : "end"
                  }`}
                >
                  {/* Bookmark */}
                  {sessionUsername &&
                    (isBookmarked ? (
                      <BookmarkFill
                        className="template-card-bookmark"
                        size={CARD_BOOKMARK_ICON_SIZE}
                        onClick={handleRemoveBookmark}
                      />
                    ) : (
                      <Bookmark
                        className="template-card-bookmark"
                        size={CARD_BOOKMARK_ICON_SIZE}
                        onClick={handleBookmark}
                      />
                    ))}
                  {/* Three Dots */}
                  <OptionsDropdownToggle
                    THREEDOT_ICON_SIZE={CARD_SETTINGS_ICON_SIZE}
                    dropdownMenu={dropdownMenu}
                  />
                </Row>
              </Card.Text>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* Confirm Delete Template */}
      <DeleteModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        template={template}
        refreshTemplates={refreshTemplates}
        handleSessionTimeout={handleSessionTimeout}
        type={"templateCard"}
      />
      {/* Share Template */}
      <ShareModal
        showShareModal={showShareModal}
        setShowShareModal={setShowShareModal}
        template={template}
        handleSessionTimeout={handleSessionTimeout}
      />
      {/* Report Template */}
      <ReportModal
        template={template}
        refreshTemplates={refreshTemplates}
        showReportTemplateModal={showReportTemplateModal}
        setShowReportTemplateModal={setShowReportTemplateModal}
        handleSessionTimeout={handleSessionTimeout}
        type={"templateCard"}
      />
    </>
  );
}
