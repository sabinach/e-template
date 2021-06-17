/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import ReactTimeAgo from "react-time-ago";
import { Form, Button, Row, Col, Card, Modal, Dropdown } from "react-bootstrap";
import { Bookmark, BookmarkFill } from "react-bootstrap-icons";
import { useParams, useHistory } from "react-router-dom";
import { validateEmail } from "../utils/Validation";
import { addRandomizedCharacters } from "../utils/FilterBuster";
import { Token } from "react-bootstrap-typeahead";
import RecipientInput from "./RecipientInput";
import DuplicatedFrom from "./DuplicatedFrom.js";
import "../styles/TemplateUse.css";
import RequestTemplates from "../services/RequestTemplates.js";
import RequestInsights from "../services/RequestInsights.js";
import OnMount from "../utils/OnMount.js";
import { USE_CARD_SETTINGS_ICON_SIZE } from "../constants/TemplateUse.js";
import BackButton from "./BackButton";
import HelpIcon from "./HelpIcon";
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
import { validateRecipients } from "../utils/Validation";
import ContactToken from "./ContactToken.js";

import RTE from "../components/RTE";
import { RTEInputTypes } from "../constants/RTE";
import CommentList from "../components/CommentList.js";

function TemplateUse({ sessionUsername, contacts, handleSessionTimeout }) {
  let { templateId } = useParams();
  const history = useHistory();
  const isFirstMount = OnMount();

  const [template, setTemplate] = React.useState(null);
  const [title, setTitle] = React.useState("");
  const [blurb, setBlurb] = React.useState("");
  const [location, setLocation] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [content, setContent] = React.useState("");
  const [body, setBody] = React.useState("");
  const [tags, setTags] = React.useState([]);
  const [toRecipients, setToRecipients] = React.useState([]);
  const [ccRecipients, setCcRecipients] = React.useState([]);
  const [bccRecipients, setBccRecipients] = React.useState([]);
  const [createdDate, setCreatedDate] = React.useState("");
  const [author, setAuthor] = React.useState("");
  const [creatorId, setCreatorId] = React.useState("");
  const [published, setPublished] = React.useState(null);

  const [useFilterBuster, setUseFilterBuster] = React.useState(false);
  const bodyDiv = React.useRef(null);

  // modals
  const [dropdownMenu, setDropdownMenu] = React.useState(null);
  const [showModal, setShowModal] = React.useState(false);
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);
  const [showShareModal, setShowShareModal] = React.useState(false);
  const [showReportTemplateModal, setShowReportTemplateModal] = React.useState(
    false
  );
  const [showContactModal, setShowContactModal] = React.useState(false);
  const [expandedContact, setExpandedContact] = React.useState(null);

  // when newComment is posted, update comments list
  const iframeRef = React.useRef(null);
  const [newComment, setNewComment] = React.useState("");
  const [posted, setPosted] = React.useState(false);

  const [showGroupModal, setShowGroupModal] = React.useState(false);
  const [expandedGroup, setExpandedGroup] = React.useState(null);
  const [currentField, setCurrentField] = React.useState("");

  const [rerender, setRerender] = React.useState(false);
  const [isBookmarked, setIsBookmarked] = React.useState(false);

  // insights
  const [insights, setInsights] = React.useState(null);

  // get template data
  React.useEffect(() => {
    console.log("retrieving template: ", templateId);
    RequestTemplates.getTemplateById({ id: templateId })
      .then((res) => {
        let data = res.data;
        console.log("retrieved template: ", data);
        setTemplate(data);
        setTitle(data.title);
        setBlurb(data.blurb);
        setLocation(data.display_location);
        setSubject(data.subject);
        setContent(data.content);
        setTags(data.tags);
        setToRecipients(data.toRecipients);
        setCcRecipients(data.ccRecipients);
        setBccRecipients(data.bccRecipients);
        setCreatedDate(data.created_on);
        setAuthor(data.author);
        setCreatorId(data.creator_id);
        setPublished(data.published);
        setRerender(false);
        return data;
      })
      .then(() => {
        if (bodyDiv.current) {
          bodyDiv.current.childNodes.forEach((node) => {
            if (node.nodeName === "BUTTON") {
              node.onclick = (e) => {
                e.preventDefault();
                console.log(e.target);
                if (e.target.style.textDecoration === "") {
                  e.target.style.textDecoration = "line-through";
                } else {
                  e.target.style.textDecoration = "";
                }
              };
            }
          });
        }
      })
      .catch((err) => {
        console.log(err);
        history.push("/notfound");
      });

    // if user is signed in
    if (sessionUsername !== "") {
      // get bookmarks list
      RequestTemplates.getBookmarkedTemplateIDs()
        .then((res) => {
          const bookmarkedTemplates = res.data.ids;
          setIsBookmarked(bookmarkedTemplates.includes(templateId));
        })
        .catch((error) => {
          console.log(error);
          handleSessionTimeout();
        });
    }
  }, [templateId, rerender, sessionUsername]);

  React.useEffect(() => {
    if (!isFirstMount) {
      // if user is signed in and template's author
      if (sessionUsername !== "" && sessionUsername === creatorId) {
        // get template insights
        console.log("retrieving insights: ", templateId);
        RequestInsights.getInsightsForTemplate(templateId)
          .then((res) => {
            const insights = res.data;
            setInsights(insights);
            console.log("retrieved insights: ", insights);
          })
          .catch((error) => {
            console.log(error);
          });
      }

      // if template data successfully retrieved
      if (templateId !== "") {
        // increase the view count
        console.log("adding +1 view to insights: ", templateId);
        RequestInsights.addViewForTemplate({ id: templateId })
          .then((res) => {
            const added = res.data.added;
            console.log("added +1 view insights: ", added);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }
  }, [rerender, sessionUsername, creatorId, posted]);

  function decode(node) {
    let nn = node.nodeName;
    let ret = "";
    if (nn === "#text") {
      ret = `${node.textContent}`;
    } else if (nn === "BR") {
      ret = "\n\n";
    } else if (nn === "SPAN" && node.innerHTML === "&nbsp;") {
      ret = "";
    } else if (nn === "DIV" || nn === "SPAN") {
      if (node.childNodes.length > 0) {
        node.childNodes.forEach((ch) => {
          const decodedChild = decode(ch);
          if (
            ret.charAt(ret.length - 1) === "\n" &&
            decodedChild.charAt(0) === "\n"
          ) {
            ret = ret.substring(0, ret.length - 1);
          }
          ret += decodedChild;
        });
      } else {
        ret += `${node.textContent}`.trim();
      }
    } else if (nn === "INPUT") {
      console.log(nn);
      ret = node.value.trim();
    } else if (nn === "SELECT") {
      for (let option of node.childNodes) {
        if (option.nodeName === "OPTION" && option.selected) {
          ret = option.textContent;
        }
      }
    } else if (nn === "BUTTON") {
      if (!node.style.textDecoration) {
        ret = node.textContent;
        ret += "\n\n";
      }
    }
    return ret;
  }

  function onNext(e) {
    e.preventDefault();
    if (bodyDiv.current) {
      console.log(bodyDiv.current.innerHTML);
      let composition = "";
      bodyDiv.current.childNodes.forEach((node) => {
        const section = decode(node);
        composition += section;
      });
      setBody(composition);
    }
    setShowModal(true);
  }

  function getEmailsFromRecipientField(field) {
    const emails = new Set();
    field.forEach((recipient) => {
      if (typeof recipient === "object") {
        if (recipient.members) {
          recipient.members.forEach((member) => {
            emails.add(member.email);
          });
        } else {
          emails.add(recipient.email);
        }
      } else {
        emails.add(recipient);
      }
    });
    return Array.from(emails).join();
  }

  function handleSubmit() {
    // increase mailed count
    console.log("adding mailed count: ", templateId);
    RequestInsights.addMailedForTemplate({ id: templateId })
      .then((res) => {
        console.log("+1 mailed: ", res.data.added);
      })
      .catch((error) => {
        console.log(error);
      });

    // increase filterbuster count
    if (useFilterBuster) {
      console.log("useFilterBuster: ", useFilterBuster);
      console.log("adding filterbuster count: ", templateId);
      RequestInsights.addFilterBusterForTemplate({ id: templateId })
        .then((res) => {
          console.log("+1 filterbustered: ", res.data.added);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // open mail to
    let mailto = "mailto:";
    mailto += getEmailsFromRecipientField(toRecipients);
    mailto += "?";
    if (ccRecipients !== []) {
      mailto += "&cc=";
      mailto += getEmailsFromRecipientField(ccRecipients);
    }
    if (bccRecipients !== []) {
      mailto += "&bcc=";
      mailto += getEmailsFromRecipientField(bccRecipients);
    }
    if (subject !== "") {
      mailto += "&subject=";
      if (useFilterBuster)
        mailto += encodeURIComponent(addRandomizedCharacters(subject));
      else mailto += encodeURIComponent(subject);
    }
    if (body !== "") {
      mailto += "&body=";
      if (useFilterBuster)
        mailto += encodeURIComponent(addRandomizedCharacters(body));
      else mailto += encodeURIComponent(body);
    }
    let win = window.open(mailto, "_blank");
    win.focus();
  }

  React.useEffect(() => {
    if (template) {
      const menu = sessionUsername ? (
        sessionUsername === template.creator_id ? (
          <Dropdown.Menu>
            {template.published ? (
              <UnpublishDropdownItem
                template={template}
                handleSessionTimeout={handleSessionTimeout}
                type={"templateUse"}
                setRerender={setRerender}
              />
            ) : (
              <PublishDropdownItem
                template={template}
                handleSessionTimeout={handleSessionTimeout}
                type={"templateUse"}
                setRerender={setRerender}
              />
            )}
            <EditDropdownItem template={template} />
            <DuplicateDropdownItem template={template} />
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
      setDropdownMenu(menu);
    }
  }, [template, sessionUsername]);

  function handlePost() {
    RequestTemplates.addCommentForTemplate({
      id: templateId,
      comment: newComment,
    })
      .then((res) => {
        const id = res.data.id;
        console.log("ADDED commentId: ", id);
        setPosted(true);
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response &&
          error.response.status &&
          error.response.status === 401
        ) {
          handleSessionTimeout();
        }
      });
  }

  function handleBookmark(e) {
    console.log("adding bookmark...", template.id);
    e.stopPropagation();
    RequestTemplates.addBookmark(template.id)
      .then((res) => {
        console.log(`bookmarked template: ${res.data.template_id}`);
        setRerender(true); // refresh page
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response &&
          error.response.status &&
          error.response.status === 401
        ) {
          handleSessionTimeout();
        }
      });
  }
  function handleRemoveBookmark(e) {
    console.log("removing bookmark...", template.id);
    e.stopPropagation();
    RequestTemplates.deleteBookmark(template.id)
      .then((res) => {
        console.log(`unbookmarked template: ${res.data.template_id}`);
        setRerender(true); // refresh page
      })
      .catch((error) => {
        console.log(error);
        if (
          error.response &&
          error.response.status &&
          error.response.status === 401
        ) {
          handleSessionTimeout();
        }
      });
  }

  const filterBusterExplanation = (
    <>
      <p>
        A feature inspired by{" "}
        <a
          href="https://linktr.ee/justiceforelijahmcclain"
          target="_blank"
          rel="noopener noreferrer"
        >
          @Justiceforelijahmcclain
        </a>{" "}
        that helps ensure your email won't be ignored by your intended
        recipients.
      </p>
      <p>
        After you finish editing the content of your email, FilterBuster inserts
        a randomized character into each word to bypass any filters.
      </p>
    </>
  );

  function handleExpandGroup(contact, field) {
    setShowGroupModal(true);
    setExpandedGroup(contact);
    setCurrentField(field);
  }

  function groupModal() {
    if (!expandedGroup) {
      return <></>;
    }
    function updateGroup(newMembers) {
      const newGroup = { ...expandedGroup, members: newMembers };
      setExpandedGroup(newGroup);
      if (currentField === "to") {
        setToRecipients(
          toRecipients.map((recipient) => {
            if (typeof recipient === "object") {
              if (recipient.name === expandedGroup.name) {
                return newGroup;
              }
            }
            return recipient;
          })
        );
      } else if (currentField === "cc") {
        setCcRecipients(
          toRecipients.map((recipient) => {
            if (typeof recipient === "object") {
              if (recipient.name === expandedGroup.name) {
                return newGroup;
              }
            }
            return recipient;
          })
        );
      } else if (currentField === "bcc") {
        setBccRecipients(
          toRecipients.map((recipient) => {
            if (typeof recipient === "object") {
              if (recipient.name === expandedGroup.name) {
                return newGroup;
              }
            }
            return recipient;
          })
        );
      }
    }
    return (
      <>
        <p>
          Tap the "x" button to remove a group member from the recipients list.
        </p>
        {expandedGroup.members.map((member, index) =>
          typeof member === "object" ? (
            <ContactToken
              key={index}
              option={{ label: member.name, contact: member }}
              onRemove={() => {
                const newMembers = expandedGroup.members.filter(
                  (m) => m.name !== member.name
                );

                updateGroup(newMembers);
              }}
              index={index}
              tabIndex={index}
              setShowContactModal={setShowContactModal}
              setExpandedContact={setExpandedContact}
              handleExpandGroup={() => {}}
            />
          ) : (
            <Token
              key={index}
              option={member}
              onRemove={() => {
                const newMembers = expandedGroup.members.filter(
                  (m) => typeof m === "object" || m === member
                );
                updateGroup(newMembers);
              }}
              index={index}
              tabIndex={index}
            >
              {member}
            </Token>
          )
        )}
      </>
    );
  }
  return (
    <>
      {template ? (
        <>
          {/* Use Editor */}
          <Row className="justify-content-md-center mb-3">
            <Col lg="7">
              <Form noValidate>
                <h3>
                  <span className="p-0 m-0 d-flex align-items-center">
                    <BackButton />
                    <span className="px-2">{title || "[Untitled]"}</span>
                    {sessionUsername !== "" ? (
                      isBookmarked ? (
                        <BookmarkFill
                          className="align-top mr-2 template-use-bookmark"
                          onClick={handleRemoveBookmark}
                        />
                      ) : (
                        <Bookmark
                          className=" align-top mr-2 template-use-bookmark"
                          onClick={handleBookmark}
                        />
                      )
                    ) : (
                      <></>
                    )}
                    {/* Three Dots */}
                    <OptionsDropdownToggle
                      THREEDOT_ICON_SIZE={USE_CARD_SETTINGS_ICON_SIZE}
                      dropdownMenu={dropdownMenu}
                    />
                  </span>
                </h3>

                <div className="mb-3">
                  {sessionUsername && sessionUsername === creatorId ? (
                    <div className="mb-3">
                      <small className="text-muted">
                        {insights
                          ? insights.viewCount +
                              insights.mailCount +
                              insights.commentCount >
                            0
                            ? `Your template has:${
                                insights.viewCount > 0
                                  ? ` ${insights.viewCount} views.`
                                  : ""
                              } ${
                                insights.mailCount > 0
                                  ? ` ${insights.mailCount} uses`
                                  : ""
                              } ${
                                insights.mailCount > 0
                                  ? ` (${insights.filterBusterCount} with FilterBuster).`
                                  : ""
                              } ${
                                insights.bookmarkCount > 0
                                  ? ` ${insights.bookmarkCount} bookmarks.`
                                  : ""
                              } ${
                                insights.commentCount > 0
                                  ? ` ${insights.commentCount} comments.`
                                  : ""
                              }`
                            : "It's a bit quiet here... revise or share your template to gain traction!"
                          : "Retrieving insights..."}
                      </small>
                    </div>
                  ) : (
                    <p className="mb-0">by {author}</p>
                  )}
                  <p className="mb-0">{location || "No Location"}</p>
                  <div className="mt-1">
                    {tags.map((tag) => {
                      return (
                        <Token disabled option={{ label: tag }} key={tag}>
                          {tag}
                        </Token>
                      );
                    })}
                  </div>
                  <small className="text-muted">
                    {createdDate ? (
                      published ? (
                        <>
                          {sessionUsername !== "" && sessionUsername === creatorId ? <>Published, </> : <></>}
                          <>Created: </>
                          <ReactTimeAgo
                            date={new Date(createdDate)}
                            locale="en-US"
                          />
                        </>
                      ) : (
                        <>
                          {sessionUsername !== "" && sessionUsername === creatorId ? (
                            <>Unpublished Draft, </>
                          ) : (
                            <></>
                          )}
                          <>Last Saved: </>
                          <ReactTimeAgo
                            date={new Date(createdDate)}
                            locale="en-US"
                          />
                        </>
                      )
                    ) : (
                      <>Unpublished Draft</>
                    )}
                  </small>
                  <br></br>
                  <DuplicatedFrom template={template} />
                </div>

                <div dangerouslySetInnerHTML={{ __html: blurb }}></div>
                <Card className="mt-3">
                  <Card.Body>
                    {/* Subject */}
                    <Form.Group>
                      <h3 className={subject ? "" : "text-muted"}>
                        {subject || "[No Subject]"}
                      </h3>
                    </Form.Group>

                    <hr />

                    {/* To */}

                    <RecipientInput
                      options={[...contacts, ...template.toRecipients]}
                      selected={toRecipients}
                      handleChange={(items) => {
                        setToRecipients(items);
                      }}
                      validate={(input) => {
                        return !input || validateEmail(input)
                          ? ""
                          : "Not a valid email";
                      }}
                      formLabel="To"
                      setShowContactModal={setShowContactModal}
                      setExpandedContact={setExpandedContact}
                      handleExpandGroup={handleExpandGroup}
                      field={"to"}
                    />

                    {/* Cc */}
                    <RecipientInput
                      options={[...contacts, ...template.ccRecipients]}
                      selected={ccRecipients}
                      handleChange={(items) => {
                        setCcRecipients(items);
                      }}
                      validate={(input) => {
                        return !input || validateEmail(input)
                          ? ""
                          : "Not a valid email";
                      }}
                      formLabel="Cc"
                      setShowContactModal={setShowContactModal}
                      setExpandedContact={setExpandedContact}
                      handleExpandGroup={handleExpandGroup}
                      field={"cc"}
                    />

                    {/* Bcc */}

                    <RecipientInput
                      options={[...contacts, ...template.bccRecipients]}
                      handleChange={(items) => {
                        setBccRecipients(items);
                      }}
                      validate={(input) => {
                        return !input || validateEmail(input)
                          ? ""
                          : "Not a valid email";
                      }}
                      formLabel="Bcc"
                      selected={bccRecipients}
                      setShowContactModal={setShowContactModal}
                      setExpandedContact={setExpandedContact}
                      handleExpandGroup={handleExpandGroup}
                      field="bcc"
                    />

                    <hr className="mt-4" />

                    {/* Content */}
                    <Form.Group>
                      {content && content.length > 0 ? (
                        <div
                          ref={bodyDiv}
                          // className="body-div"
                          dangerouslySetInnerHTML={{ __html: content }}
                        ></div>
                      ) : (
                        <div>
                          <span className="text-muted">[No Body]</span>
                        </div>
                      )}
                    </Form.Group>
                  </Card.Body>
                </Card>
                {/* Send */}

                <Form.Group className="mt-4">
                  <Button
                    block
                    className="rounded-pill"
                    onClick={onNext}
                    disabled={
                      !validateRecipients(toRecipients) ||
                      !validateRecipients(ccRecipients) ||
                      !validateRecipients(bccRecipients)
                    }
                  >
                    Next
                  </Button>
                </Form.Group>
              </Form>
            </Col>
          </Row>

          {/* Comments */}
          {published &&
            (sessionUsername !== "" ? (
              <Row className="justify-content-md-center mb-3">
                <Col lg="7">
                  <Form>
                    <RTE
                      iframeRef={iframeRef}
                      inputType={RTEInputTypes.COMMENT}
                      initialContent=""
                      content={newComment}
                      handlePost={handlePost}
                      handleChange={(c) => {
                        setNewComment(c);
                      }}
                    />
                  </Form>
                </Col>
              </Row>
            ) : (
              <Row className="justify-content-md-center mb-3">
                <Col lg="7">
                  <span>Sign in to post a comment!</span>
                </Col>
              </Row>
            ))}

          {published && (
            <CommentList
              sessionUsername={sessionUsername}
              templateId={templateId}
              handleSessionTimeout={handleSessionTimeout}
              posted={posted}
              setPosted={setPosted}
            />
          )}

          {/* Finalize Content */}
          <Modal
            centered
            show={showModal}
            onHide={() => {
              setShowModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                Finalize content
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form noValidate>
                <Form.Group>
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    value={subject}
                    placeholder="[No Subject]"
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Label>Body</Form.Label>
                  <Form.Control
                    as="textarea"
                    placeholder={"[No Body]"}
                    value={body}
                    onChange={(e) => {
                      setBody(e.target.value);
                    }}
                    rows="10"
                  />
                </Form.Group>
                <Form.Group className="row justify-content-start pl-3 pb-0 mb-0">
                  <Form.Check
                    type="checkbox"
                    className="pr-2"
                    checked={useFilterBuster}
                    onChange={(e) =>
                      setUseFilterBuster(e.currentTarget.checked)
                    }
                    label={
                      useFilterBuster
                        ? "FilterBuster enabled"
                        : "FilterBuster disabled"
                    }
                  />
                  <HelpIcon
                    body={filterBusterExplanation}
                    title="What is this?"
                  />
                </Form.Group>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button
                className="rounded-pill"
                variant="outline-dark"
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Cancel
              </Button>
              <Button
                className="rounded-pill"
                onClick={() => {
                  handleSubmit();
                  setShowModal(false);
                  history.push("/");
                }}
              >
                Open in Mail
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Confirm Delete Template */}
          <DeleteModal
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            template={template}
            type={"templateUse"}
          />
          {/* Share Template */}
          <ShareModal
            showShareModal={showShareModal}
            setShowShareModal={setShowShareModal}
            template={template}
          />
          {/* Report Template */}
          <ReportModal
            template={template}
            showReportTemplateModal={showReportTemplateModal}
            setShowReportTemplateModal={setShowReportTemplateModal}
            type={"templateUse"}
          />
          <Modal
            size="sm"
            centered
            show={showContactModal}
            onHide={() => {
              setShowContactModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {expandedContact ? expandedContact.name : "Contact name"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {expandedContact ? expandedContact.email : "Contact email"}
            </Modal.Body>
          </Modal>
          <Modal
            centered
            show={showGroupModal}
            onHide={() => {
              setShowGroupModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {expandedGroup ? expandedGroup.name : "Group name"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>{groupModal()}</Modal.Body>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
}

export default TemplateUse;
