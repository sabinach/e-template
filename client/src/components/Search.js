/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import {
  Row,
  Col,
  Form,
  InputGroup,
  DropdownButton,
  Dropdown,
  Container,
} from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import { toOptionArray } from "./TagInput";
import SearchToken from "./SearchToken";
import "../styles/Search.css";
import LocationAutocomplete from "./LocationAutocomplete";

export default function Search({
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
  existingTopics = [],
  existingAuthors = [],
  existingLocations = [],
}) {
  // const [searchText, setSearchText] = React.useState("");
  const [currentFilter, setCurrentFilter] = React.useState("topic");

  function getExistingOptions() {
    let ret = [];
    if (currentFilter === "topic") {
      ret = existingTopics;
    } else if (currentFilter === "author") {
      ret = existingAuthors;
    } else if (currentFilter === "location") {
      ret = existingLocations;
    }
    return toOptionArray(ret);
  }

  function handleSearchSubmit(searchText) {
    // prevent automatic refresh
    // e.preventDefault();

    // produce pill in respective category
    if (currentFilter === "topic") {
      updateTopicTags(searchText, "add");
      updateAllTopicTags(searchText, "add");
    } else if (currentFilter === "author") {
      updateAuthorTags(searchText, "add");
      updateAllAuthorTags(searchText, "add");
    } else if (currentFilter === "location") {
      updateLocationTags(searchText, "add");
      updateAllLocationTags(searchText, "add");
    }
  }

  function deactivateTag(buttonName, filterType) {
    if (filterType === "topic") updateTopicTags(buttonName, "delete");
    else if (filterType === "author") updateAuthorTags(buttonName, "delete");
    else if (filterType === "location")
      updateLocationTags(buttonName, "delete");
  }

  function activateTag(buttonName, filterType) {
    if (filterType === "topic") updateTopicTags(buttonName, "add");
    else if (filterType === "author") updateAuthorTags(buttonName, "add");
    else if (filterType === "location") updateLocationTags(buttonName, "add");
  }

  function handleToggleButton(buttonName, filterType, isActive) {
    if (isActive) {
      console.log("deactivate");
      deactivateTag(buttonName, filterType);
    } else {
      console.log("activate");
      activateTag(buttonName, filterType);
    }
  }

  function handleDeleteButton(buttonName, filterType) {
    deactivateTag(buttonName, filterType);
    if (filterType === "topic") updateAllTopicTags(buttonName, "delete");
    else if (filterType === "author") updateAllAuthorTags(buttonName, "delete");
    else if (filterType === "location")
      updateAllLocationTags(buttonName, "delete");
  }

  return (
    <Container fluid>
      <Row>
        <Col>
          {/* Search Bar */}
          <Form onSubmit={handleSearchSubmit}>
            <InputGroup>
              { currentFilter === "location" ?
                <LocationAutocomplete
                  onSelect={selected => {
                    handleSearchSubmit(selected);
                  }}
                  showExistingLocations={true}
                  placeholder="Search by"
                />
                :
                <Typeahead
                  id="search-bar"
                  placeholder="Search by"
                  options={getExistingOptions()}
                  minLength={1}
                  highlightOnlyResult
                  clearButton
                  shouldSelectHint
                  onChange={(selected) => {
                    if (selected.length > 0) {
                      handleSearchSubmit(selected[0].label);
                    }
                  }}
                />
              }
              <DropdownButton
                as={InputGroup.Append}
                variant="outline-secondary"
                title={currentFilter === "topic" ? "tag" : currentFilter}
                id="input-group-dropdown-2"
              >
                <Dropdown.Item onClick={() => setCurrentFilter("topic")}>
                  tag
                </Dropdown.Item>

                <Dropdown.Item onClick={() => setCurrentFilter("author")}>
                  author
                </Dropdown.Item>

                <Dropdown.Item onClick={() => setCurrentFilter("location")}>
                  location
                </Dropdown.Item>
              </DropdownButton>
            </InputGroup>
          </Form>
          {/* <Form.Text>Press ENTER to Search</Form.Text> */}

          {/* Tags */}
          <Container fluid>
            {/* By Topic */}
            {allTopicTags.length > 0 && (
              <>
                <Row className="mt-4 pb-1">Filtered by tags:</Row>
                <Row>
                  {allTopicTags.map((topic, index) => {
                    return (
                      <SearchToken
                        key={`topic-${topic}`}
                        label={topic}
                        filterType="topic"
                        isActivated={topicTags.includes(topic)}
                        handleToggleButton={handleToggleButton}
                        handleDeleteButton={handleDeleteButton}
                      />
                    );
                  })}
                </Row>
              </>
            )}
            {/* By Author */}
            {allAuthorTags.length > 0 && (
              <>
                <Row className="mt-4 pb-1">Filtered by authors:</Row>
                <Row>
                  {allAuthorTags.map((author, index) => {
                    return (
                      <SearchToken
                        key={`author-${author}`}
                        label={author}
                        filterType="author"
                        isActivated={authorTags.includes(author)}
                        handleToggleButton={handleToggleButton}
                        handleDeleteButton={handleDeleteButton}
                      />
                    );
                  })}
                </Row>
              </>
            )}
            {/* By Location */}
            {allLocationTags.length > 0 && (
              <>
                <Row className="mt-4 pb-1">Filtered by locations (within 50 mi of):</Row>
                <Row>
                  {allLocationTags.map((location, index) => {
                    return (
                      <SearchToken
                        key={`location-${location}`}
                        label={location.name}
                        locationId={location.id}
                        filterType="location"
                        isActivated={locationTags.filter(loc => loc.id === location.id).length > 0}
                        handleToggleButton={handleToggleButton}
                        handleDeleteButton={handleDeleteButton}
                      />
                    );
                  })}
                </Row>
              </>
            )}
            <Row className="mt-4" />
          </Container>
        </Col>
      </Row>
    </Container>
  );
}
