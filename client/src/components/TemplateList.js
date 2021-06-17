/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { useLocation } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { TEMPLATE_REFRESH_INTERVAL } from "../constants/TemplateList";
import TemplateCard from "../components/TemplateCard";
import OnMount from "../utils/OnMount.js";
import RequestTemplates from "../services/RequestTemplates.js";
import RequestModeration from "../services/RequestModeration.js";

export default function TemplateList({
  topicTags,
  authorTags,
  locationTags,
  updateTopicTags,
  updateAuthorTags,
  updateLocationTags,
  updateAllAuthorTags,
  updateAllTopicTags,
  updateAllLocationTags,
  searchFilter,
  updateSearchFilter,
  sessionUsername,
  handleSessionTimeout,
}) {
  const isFirstMount = OnMount();
  const currentURL = useLocation().pathname;

  // generate state
  const [templates, setTemplates] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);
  const [noTemplates, setNoTemplates] = React.useState(false);
  const [bookmarkedTemplates, setBookmarkedTemplates] = React.useState([]);

  // on first mount
  React.useEffect(() => {
    if (currentURL === "/") {
      console.log("set search filter to Public");
      updateSearchFilter("Public");
    } else if (currentURL === "/profile") {
      console.log("set search filter to Published");
      updateSearchFilter("Published");
    }
    console.log("reset search tags");
    updateTopicTags([], "reset");
    updateAuthorTags([], "reset");
    updateLocationTags([], "reset");

    const interval = setInterval(() => {
      console.log("update templates");
      refreshTemplates(false);
    }, TEMPLATE_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  // call for template ids on mount
  React.useEffect(() => {
    if (!isFirstMount) {
      refreshTemplates();
    }
  }, [searchFilter, topicTags, authorTags, locationTags, sessionUsername]);

  function refreshTemplates(showLoading = true) {
    if (!isFirstMount) {
      console.log("get template ids by filter: ", searchFilter);
      setIsLoading(showLoading);
      // if user is signed in
      if (sessionUsername !== "") {
        // get bookmarks list
        RequestTemplates.getBookmarkedTemplateIDs()
          .then((res) => {
            setBookmarkedTemplates(res.data.ids);
          })
          .catch((error) => {
            handleError(error);
          });
      }
      // start filtering
      getTemplateIDsBySearchFilter(
        searchFilter,
        topicTags,
        authorTags,
        locationTags
      );
    }
  }

  function handleError(error) {
    if (error.response && error.response.status === 401) {
      handleSessionTimeout();
    } else {
      setIsError(true);
    }
  }

  // Public, Bookmarked, Drafts, Published
  function getTemplateIDsBySearchFilter(
    searchFilter,
    topicTags,
    authorTags,
    locationTags
  ) {
    console.log("current searchFilter: ", searchFilter);
    if (searchFilter === "Public") {
      console.log("Requesting public");
      RequestTemplates.getPublishedTemplateIDs()
        .then((res) => {
          const searchFilterIDs = res.data.ids;
          querySearchResults(
            searchFilter,
            searchFilterIDs,
            topicTags,
            authorTags,
            locationTags
          );
        })
        .catch((error) => {
          handleError(error);
        });
    } else if (searchFilter === "Published") {
      console.log("Requesting published");
      RequestTemplates.getPublishedTemplateIDsByAuthorUUID(sessionUsername)
        .then((res) => {
          const searchFilterIDs = res.data.ids;
          querySearchResults(
            searchFilter,
            searchFilterIDs,
            topicTags,
            authorTags,
            locationTags
          );
        })
        .catch((error) => {
          handleError(error);
        });
    } else if (searchFilter === "Bookmarked") {
      console.log("Requesting bookmarked");
      querySearchResults(
        searchFilter,
        bookmarkedTemplates,
        topicTags,
        authorTags,
        locationTags
      );
    } else if (searchFilter === "Drafts") {
      console.log("Requesting drafts");
      RequestTemplates.getDraftTemplateIDs()
        .then((res) => {
          const searchFilterIDs = res.data.ids;
          querySearchResults(
            searchFilter,
            searchFilterIDs,
            topicTags,
            authorTags,
            locationTags
          );
        })
        .catch((error) => {
          handleError(error);
        });
    }
  }

  function querySearchResults(
    searchFilter,
    searchFilterIDs,
    topicTags,
    authorTags,
    locationTags
  ) {
    console.log(`received ${searchFilter} template ids: `, searchFilterIDs);
    if (searchFilterIDs.length > 0) {
      if (
        topicTags.length > 0 ||
        authorTags.length > 0 ||
        locationTags.length > 0
      ) {
        getTemplateIDsByTags(
          searchFilterIDs,
          topicTags,
          authorTags,
          locationTags
        );
      } else {
        updateTemplates(searchFilterIDs);
      }
    } else {
      setTemplates([]);
      setIsLoading(false);
      setIsError(false);
      setNoTemplates(true);
    }
  }

  function getTemplateIDsByTags(
    searchFilterIDs,
    topicTags,
    authorTags,
    locationTags
  ) {
    RequestTemplates.getTemplateIDsByFilters({
      tags: topicTags,
      authors: authorTags,
      locations: locationTags.map(tag => tag.id),
    })
      .then((res) => {
        const tagFilterIDs = res.data.ids;
        console.log("received template ids by TAGs: ", tagFilterIDs);
        if (tagFilterIDs.length > 0) {
          intersectSearchAndTagResults(searchFilterIDs, tagFilterIDs);
        } else {
          setTemplates([]);
          setIsLoading(false);
          setIsError(false);
          setNoTemplates(true);
        }
      })
      .catch((error) => {
        handleError(error);
      });
  }

  function intersectSearchAndTagResults(searchFilterIDs, tagFilterIDs) {
    const intersectedTemplates = searchFilterIDs.filter((id) =>
      tagFilterIDs.includes(id)
    );
    console.log(
      "intersectedTemplates between search/tag results: ",
      intersectedTemplates
    );
    updateTemplates(intersectedTemplates);
  }

  // axios get all templates by id
  function updateTemplates(ids) {
    console.log("ids to retrieve templates for: ", ids);
    if (ids.length > 0) {
      RequestTemplates.getTemplatesByIds({ ids })
        .then((res) => {
          const receivedTemplates = res.data.data;
          console.log("received templates: ", receivedTemplates);
          if (sessionUsername !== "") {
            filterReportedTemplates(receivedTemplates);
          } else {
            setTemplates(receivedTemplates);
            setIsLoading(false);
            setIsError(false);
            setNoTemplates(false);
          }
        })
        .catch((error) => {
          handleError(error);
        });
    } else {
      setTemplates([]);
      setIsLoading(false);
      setIsError(false);
      setNoTemplates(true);
    }
  }

  function filterReportedTemplates(receivedTemplates) {
    RequestModeration.getReportedTemplatesForUser(sessionUsername)
      .then((res) => {
        const reportedIds = res.data.reported;
        console.log("received Reported templates: ", reportedIds);
        if (reportedIds.length > 0) {
          const intersectedTemplates = receivedTemplates.filter(
            (template) => !reportedIds.includes(template.id)
          );
          console.log(
            "intersectedTemplates between available/reported results: ",
            intersectedTemplates
          );
          // set values
          setTemplates(intersectedTemplates);
          setIsLoading(false);
          setIsError(false);
          if (intersectedTemplates.length > 0) {
            setNoTemplates(false);
          } else {
            setNoTemplates(true);
          }
        } else {
          setTemplates(receivedTemplates);
          setIsLoading(false);
          setIsError(false);
          setNoTemplates(false);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div>
      <Container fluid>
        <Row className="justify-content-xl-left">
          {isLoading ? (
            <Col>
              <p>Loading templates...</p>
            </Col>
          ) : noTemplates ? (
            <Col>
              <p>No templates found.</p>
            </Col>
          ) : isError ? (
            <Col>
              <p className="mb-0 pb-0">Something went wrong &#128546;</p>
              <a href="/">Retry?</a>
            </Col>
          ) : (
            templates &&
            templates.map((template) => {
              console.log("creating template");
              const isBookmarked = bookmarkedTemplates.includes(template.id);
              return (
                <Col xl="4" lg="6" md="12" key={template.id}>
                  <TemplateCard
                    template={template}
                    sessionUsername={sessionUsername}
                    updateTopicTags={updateTopicTags}
                    updateAuthorTags={updateAuthorTags}
                    updateLocationTags={updateLocationTags}
                    updateAllTopicTags={updateAllTopicTags}
                    updateAllAuthorTags={updateAllAuthorTags}
                    updateAllLocationTags={updateAllLocationTags}
                    refreshTemplates={refreshTemplates}
                    isBookmarked={isBookmarked}
                    handleSessionTimeout={handleSessionTimeout}
                  />
                </Col>
              );
            })
          )}
        </Row>
      </Container>
    </div>
  );
}
