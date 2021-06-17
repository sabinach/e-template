/* eslint-disable react-hooks/exhaustive-deps */

import React from "react";
import { useHistory } from "react-router-dom";
import { ButtonGroup, Button, Container, Row, Col } from "react-bootstrap";
import ProfileMessage from "../components/ProfileMessage";
import Search from "../components/Search";
import TemplateList from "../components/TemplateList";
import RequestUsers from "../services/RequestUsers.js";
import "../styles/Profile.css";
import RequestTemplates from "../services/RequestTemplates";
import { TEMPLATE_REFRESH_INTERVAL } from "../constants/TemplateList";

export default function Profile({
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
  const history = useHistory();

  const [existingTopics, setExistingTopics] = React.useState([]);
  const [existingAuthors, setExistingAuthors] = React.useState([]);
  const [existingLocations, setExistingLocations] = React.useState([]);

  // filter state
  const [currentUsername, setCurrentUsername] = React.useState("");

  function refreshProfile() {
    console.log("refresh profile");
    RequestUsers.getNameFromUUID(sessionUsername)
      .then((res) => {
        const name = res.data.name;
        setCurrentUsername(name);
        RequestTemplates.getAllAuthors().then((res) => {
          console.log(name);
          const combined = Array.from(new Set([...res.data.authors, name]));
          combined.sort();
          setExistingAuthors(combined);
        });
      })
      .then((name) => console.log(name))
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          handleSessionTimeout();
        }
      });

    console.log("getting draft tags");
    RequestTemplates.getAllDraftTags()
      .then((draftTags) => {
        console.log(`draftTags: ${draftTags}`);
        RequestTemplates.getAllTags()
          .then((publishedTags) => {
            const combined = [
              ...draftTags.data.tags,
              ...publishedTags.data.tags,
            ];
            combined.sort();
            console.log(`combined: ${combined}`);
            setExistingTopics(combined);
          })
          .catch((error) => {
            console.log("get all tags error");
            console.log(error);
          });
      })
      .catch((error) => {
        console.log("draft tags error");
        console.log(error);
        if (error.response && error.response.status === 401) {
          handleSessionTimeout();
        }
      });
    console.log("getting draft locations");
    RequestTemplates.getAllDraftLocations()
      .then((draftLocations) => {
        console.log(`draftLocations: ${draftLocations}`);
        RequestTemplates.getAllLocations()
          .then((publishedLocations) => {
            console.log();
            const combined = [
              ...draftLocations.data.locations,
              ...publishedLocations.data.locations,
            ];
            combined.sort();
            console.log(`combined: ${combined}`);
            setExistingLocations(combined);
          })
          .catch((error) => {
            console.log("get all locations error");
            console.log(error);
          });
      })
      .catch((error) => {
        console.log("draft tags error");
        console.log(error);
        if (error.response && error.response.status === 401) {
          handleSessionTimeout();
        }
      });
  }

  // redirect to home page if signed in
  React.useEffect(() => {
    console.log("loaded");
    if (sessionUsername === "") {
      history.push("/");
      return;
    } else {
      console.log("logged in");
      refreshProfile();
      const interval = setInterval(() => {
        console.log("update profile");
        refreshProfile();
      }, TEMPLATE_REFRESH_INTERVAL);
      return () => clearInterval(interval);
    }
  }, []);

  return (
    <Container fluid className="mt-3">
      <Row>
        <Col>
          <ProfileMessage name={currentUsername} />
        </Col>
      </Row>
      <Row className="mt-4">
        <Col lg="4">
          <Container>
            <Row>
              <Col>
                <ButtonGroup
                  aria-label="Basic example"
                  className="mb-4 w-100"
                  size="sm"
                >
                  <Button
                    key={1}
                    onClick={() => updateSearchFilter("Bookmarked")}
                    active={searchFilter === "Bookmarked"}
                    variant="outline-primary"
                    className="buttongroup"
                  >
                    {"Bookmarked"}
                  </Button>
                  <Button
                    key={2}
                    onClick={() => updateSearchFilter("Drafts")}
                    active={searchFilter === "Drafts"}
                    variant="outline-primary"
                    className="buttongroup"
                  >
                    {"Drafts"}
                  </Button>
                  <Button
                    key={3}
                    onClick={() => updateSearchFilter("Published")}
                    active={searchFilter === "Published"}
                    variant="outline-primary"
                    className="buttongroup"
                  >
                    {"Published"}
                  </Button>
                </ButtonGroup>
              </Col>
            </Row>
          </Container>

          <Search
            topicTags={topicTags}
            authorTags={authorTags}
            locationTags={locationTags}
            updateTopicTags={updateTopicTags}
            updateAuthorTags={updateAuthorTags}
            updateLocationTags={updateLocationTags}
            allTopicTags={allTopicTags}
            allAuthorTags={allAuthorTags}
            allLocationTags={allLocationTags}
            updateAllTopicTags={updateAllTopicTags}
            updateAllAuthorTags={updateAllAuthorTags}
            updateAllLocationTags={updateAllLocationTags}
            existingTopics={existingTopics}
            existingLocations={existingLocations}
            existingAuthors={existingAuthors}
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
            authorClickable={false}
          />
        </Col>
      </Row>
    </Container>
  );
}
