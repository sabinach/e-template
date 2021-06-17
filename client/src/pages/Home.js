/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import HomeMessage from "../components/HomeMessage";
import Search from "../components/Search";
import TemplateList from "../components/TemplateList";
import RequestTemplates from "../services/RequestTemplates";
import { TEMPLATE_REFRESH_INTERVAL } from "../constants/TemplateList";

function Home({
  topicTags,
  authorTags,
  locationTags,
  updateTopicTags,
  updateAuthorTags,
  updateLocationTags,
  allTopicTags,
  allAuthorTags,
  allLocationTags,
  updateAllTopicTags,
  updateAllAuthorTags,
  updateAllLocationTags,
  searchFilter,
  updateSearchFilter,
  sessionUsername,
  handleSessionTimeout,
}) {
  const [existingTopics, setExistingTopics] = React.useState([]);
  const [existingAuthors, setExistingAuthors] = React.useState([]);
  const [existingLocations, setExistingLocations] = React.useState([]);

  function refreshHome() {
    RequestTemplates.getAllTags().then((response) =>
      setExistingTopics(response.data.tags)
    );
    RequestTemplates.getAllAuthors().then((response) =>
      setExistingAuthors(response.data.authors)
    );
    RequestTemplates.getAllLocations().then((response) =>
      setExistingLocations(response.data.locations)
    );
  }

  React.useEffect(() => {
    console.log("loaded");
    refreshHome();
    const interval = setInterval(() => {
      console.log("update home");
      refreshHome();
    }, TEMPLATE_REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col>
          <HomeMessage />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg="4">
          <Search
            topicTags={topicTags}
            authorTags={authorTags}
            locationTags={locationTags}
            updateTopicTags={updateTopicTags}
            updateAuthorTags={updateAuthorTags}
            updateLocationTags={updateLocationTags}
            existingTopics={existingTopics}
            existingAuthors={existingAuthors}
            existingLocations={existingLocations}
            allTopicTags={allTopicTags}
            allAuthorTags={allAuthorTags}
            allLocationTags={allLocationTags}
            updateAllTopicTags={updateAllTopicTags}
            updateAllAuthorTags={updateAllAuthorTags}
            updateAllLocationTags={updateAllLocationTags}
          />
        </Col>
        <Col>
          <TemplateList
            topicTags={topicTags}
            authorTags={authorTags}
            locationTags={locationTags}
            updateTopicTags={updateTopicTags}
            updateAuthorTags={updateAuthorTags}
            updateLocationTags={updateLocationTags}
            updateAllTopicTags={updateAllTopicTags}
            updateAllAuthorTags={updateAllAuthorTags}
            updateAllLocationTags={updateAllLocationTags}
            searchFilter={searchFilter}
            updateSearchFilter={updateSearchFilter}
            sessionUsername={sessionUsername}
            handleSessionTimeout={handleSessionTimeout}
          />
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
