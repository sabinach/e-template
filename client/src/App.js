/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { createBrowserHistory } from "history";
import { LinkContainer } from "react-router-bootstrap";
import { Nav, Navbar, NavItem, Dropdown } from "react-bootstrap";
import {
  PlusCircleFill,
  PersonCircle,
  PersonLinesFill,
  PeopleFill,
  GearFill,
  DoorOpenFill,
  Asterisk,
} from "react-bootstrap-icons";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Contacts from "./pages/Contacts";
import Settings from "./pages/Settings";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import Use from "./pages/Use";
import Admin from "./pages/Admin";
import Error from "./pages/Error";
import SessionTimeoutModal from "./components/SessionTimeoutModal";
import ComponentTester from "./pages/ComponentTester";
import {
  COOKIE_NAME,
  NAV_PLUS_ICON_SIZE,
  NAV_PROFILE_ICON_SIZE,
} from "./constants/App.js";
import "./styles/App.css";
import "react-bootstrap-typeahead/css/Typeahead.css";
import RequestUsers from "./services/RequestUsers.js";
import RequestModeration from "./services/RequestModeration.js";
import RequestContacts from "./services/RequestContacts.js";
import Cookies from "universal-cookie";

export default function App() {
  /** --------- User Session Related --------- **/

  // get cookies
  const cookies = new Cookies(); // should be token in the future, not sessionUsername
  const history = createBrowserHistory();

  // cookie state
  const [cookieName, setCookieName] = React.useState("");

  // reset sessionUsername on refresh ==> change to cookies
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [sessionUsername, setSessionUsername] = React.useState("");
  const [currentUsername, setCurrentUsername] = React.useState("");
  const [showSessionTimeoutModal, setShowSessionTimeoutModal] = React.useState(
    false
  );

  React.useEffect(() => {
    const cookie = cookies.get(COOKIE_NAME);
    console.log(cookie);
    if (cookie) {
      setCookieName(cookie);
    }
  }, []);

  // TODO: runs on first mount: check if logged in via cookies
  React.useEffect(() => {
    // cookie exists
    if (cookieName) {
      console.log("cookie exists: ", cookieName);
      // check if user with associated sessionUsername actually exists / auto-signin
      RequestUsers.authenticateCookie({ cookie: cookieName }) // automatically signs in in backend
        .then((res) => {
          console.log("authenticated: ", res);
          handleLogin(res.data.id);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("cookie does not exist");
    }
  }, [cookieName]);

  React.useEffect(() => {
    console.log("frontend sessionUsername: ", sessionUsername);
    if (sessionUsername !== "") {
      RequestUsers.getNameFromUUID(sessionUsername)
        .then((res) => {
          const name = res.data.name;
          setCurrentUsername(name);
          updateContacts();
        })
        .catch((error) => {
          console.log(error);
          if (
            error.response &&
            error.response.status &&
            error.response.status === 401
          ) {
            handleSessionTimeout();
          } else {
            history.push("/error");
            handleLogout();
          }
        });
      RequestModeration.getIsAdmin(sessionUsername)
        .then((res) => {
          setIsAdmin(res.data.isAdmin);
        })
        .catch((error) => {
          console.log(error);
          if (error.response.status && error.response.status === 401) {
            handleSessionTimeout();
          } else {
            history.push("/error");
            handleLogout();
          }
        });
    }
  }, [sessionUsername]);

  // global - passed down to children
  function handleLogin(userId) {
    if (userId) {
      // ONLY ALLOW IF SIGNED OUT
      cookies.set(COOKIE_NAME, userId);
      setCookieName(userId);
      setSessionUsername(userId);
      setShowSessionTimeoutModal(false);
    } else {
      console.log("attempted to handleLogin without valid userId");
    }
  }

  // global - passed down to children
  function handleLogout() {
    RequestUsers.signOut()
      .then((res) => {
        const userId = res.data.id;
        console.log("backend signout successful: ", userId);
        setSessionUsername("");
        setNavbarExpanded(false);
        setContacts([]);
        cookies.remove(COOKIE_NAME);
        setCookieName("");
      })
      .catch((error) => {
        console.log(error);
        history.push("/error");
      });
  }

  function handleSessionTimeout() {
    setShowSessionTimeoutModal(true);
    setSessionUsername("");
    setNavbarExpanded(false);
    setContacts([]);
    cookies.remove(COOKIE_NAME);
    setCookieName("");
  }

  function updateDisplayName() {
    console.log("updated display name.");
    RequestUsers.getNameFromUUID(sessionUsername)
      .then((res) => {
        const name = res.data.name;
        setCurrentUsername(name);
      })
      .catch((error) => {
        // TODO
        console.log(error);
        history.push("/error");
      });
  }

  /** --------- Template Search Filter --------- **/

  // current search filter: Public, Bookmarked, Drafts, Published
  const [searchFilter, setSearchFilter] = React.useState("Public");

  function updateSearchFilter(filter) {
    setSearchFilter(filter);
  }

  /** --------- Template Tag --------- **/

  // current topic tags
  const [topicTags, setTopicTags] = React.useState([]);
  const [authorTags, setAuthorTags] = React.useState([]);
  const [locationTags, setLocationTags] = React.useState([]);

  const [allTopicTags, setAllTopicTags] = React.useState([]);
  const [allAuthorTags, setAllAuthorTags] = React.useState([]);
  const [allLocationTags, setAllLocationTags] = React.useState([]);

  function clearTags() {
    setTopicTags([]);
    setAuthorTags([]);
    setLocationTags([]);
    setAllTopicTags([]);
    setAllAuthorTags([]);
    setAllLocationTags([]);
  }

  React.useEffect(() => {
    console.log("updated searchFilter: ", searchFilter);
    clearTags();
  }, [searchFilter]);

  function updateAllTopicTags(tag, action) {
    if (action === "reset") setAllTopicTags([]);
    else if (action === "add")
      setAllTopicTags((prevTopics) => {
        return Array.from(new Set([...prevTopics, tag]));
      });
    else if (action === "delete")
      setAllTopicTags((prevTopics) => {
        return prevTopics.filter((topic) => topic !== tag);
      });
  }

  function updateAllAuthorTags(tag, action) {
    if (action === "reset") setAllAuthorTags([]);
    else if (action === "add")
      setAllAuthorTags((prevAuthors) => {
        return Array.from(new Set([...prevAuthors, tag]));
      });
    else if (action === "delete")
      setAllAuthorTags((prevAuthors) => {
        return prevAuthors.filter((author) => author !== tag);
      });
  }

  function updateAllLocationTags(tag, action) {
    if (action === "reset") setAllLocationTags([]);
    else if (action === "add")
      setAllLocationTags((prevLocations) => {
        if (prevLocations.filter((loc) => loc.id === tag.id) === 0) {
          return prevLocations.concat([tag]);
        }
        return prevLocations;
      });
    else if (action === "delete")
      setAllLocationTags((prevLocations) => {
        return prevLocations.filter((loc) => loc.id !== tag.id);
      });
  }

  function updateTopicTags(tag, action) {
    if (action === "reset") {
      setTopicTags([]);
      setAllTopicTags([]);
      return;
    }
    let newTopicTags;
    if (action === "add") {
      newTopicTags = Array.from(new Set([...topicTags, tag]));
    } else if (action === "delete") {
      newTopicTags = topicTags.filter((Topic) => Topic !== tag);
    }
    setTopicTags(newTopicTags);
    const inactiveTopicTags = allTopicTags.filter(
      (Topic) => !newTopicTags.includes(Topic)
    );
    setAllTopicTags([...newTopicTags, ...inactiveTopicTags]);
  }

  function updateAuthorTags(tag, action) {
    if (action === "reset") {
      setAuthorTags([]);
      setAllAuthorTags([]);
      return;
    }
    let newAuthorTags;
    if (action === "add") {
      newAuthorTags = Array.from(new Set([...authorTags, tag]));
    } else if (action === "delete") {
      newAuthorTags = authorTags.filter((author) => author !== tag);
    }
    setAuthorTags(newAuthorTags);
    const inactiveAuthorTags = allAuthorTags.filter(
      (author) => !newAuthorTags.includes(author)
    );
    setAllAuthorTags([...newAuthorTags, ...inactiveAuthorTags]);
  }

  function updateLocationTags(tag, action) {
    if (action === "reset") {
      setLocationTags([]);
      setAllLocationTags([]);
      return;
    }
    let newLocationTags = [];
    if (action === "add") {
      if (newLocationTags.filter((el) => el.id === tag.id).length === 0) {
        newLocationTags = locationTags.concat([tag]);
      }
    } else if (action === "delete") {
      newLocationTags = locationTags.filter((loc) => loc.id !== tag.id);
    }
    setLocationTags(newLocationTags);
    const inactiveLocationTags = allLocationTags.filter(
      (loc) => newLocationTags.filter((el) => el.id === loc.id).length === 0
    );
    setAllLocationTags([...newLocationTags, ...inactiveLocationTags]);
  }

  React.useEffect(() => {
    console.log("updated topicTags: ", topicTags);
    console.log("updated authorTags: ", authorTags);
    console.log("updated locationTags: ", locationTags);
  }, [topicTags, authorTags, locationTags]);

  /** --------- Contacts --------- **/

  const [contacts, setContacts] = React.useState([]);
  function updateContacts() {
    RequestContacts.getContacts()
      .then((res) => {
        console.log("contacts: ", res.data.contacts);
        setContacts(res.data.contacts);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          handleSessionTimeout();
        } else {
          history.push("/error");
        }
      });
    /*
    setContacts([
      { name: "Steph", email: "steph@email.com" },
      { name: "Sarah", email: "sarah@email.com" },
      {
        name: "The twins",
        members: [
          { name: "Steph", email: "steph@email.com" },
          { name: "Sarah", email: "sarah@email.com" },
        ],
      },
    ]);
    */
  }

  /** --------- Navbar --------- **/

  const [navbarExpanded, setNavbarExpanded] = React.useState(false);
  const ProfileToggle = React.forwardRef(({ children, onClick }, ref) => (
    <div
      onClick={(e) => {
        e.preventDefault();
        onClick(e);
      }}
      ref={ref}
    >
      <PersonCircle size={NAV_PROFILE_ICON_SIZE} className="navbar-item" />
      <span className="navbar-item ml-2">{currentUsername}</span>
    </div>
  ));

  const showNavSignedIn = (
    <Nav className="mr-2 navbar-expand-xl">
      {/* Plus Icon */}
      <LinkContainer to="/create">
        <Nav.Link>
          <PlusCircleFill size={NAV_PLUS_ICON_SIZE} className="navbar-item" />
          <span className="navlink-label navbar-item ml-2 create-template-label">
            Create Template
          </span>
        </Nav.Link>
      </LinkContainer>
      {/* Profile Icon */}
      <Dropdown>
        <Nav.Link className="mr-0 pr-0">
          <Dropdown.Toggle as={ProfileToggle} />
        </Nav.Link>
        <Dropdown.Menu align="right">
          {isAdmin ? (
            <Link to="/admin" className="navbar-item">
              <Dropdown.Item
                as={NavItem}
                onSelect={() => {
                  setNavbarExpanded(false);
                }}
              >
                <span className="p-0 m-0 d-flex align-items-center">
                  <Asterisk className="align-top" />
                  <span className="ml-2">Admin Portal</span>
                </span>
              </Dropdown.Item>
            </Link>
          ) : (
            <></>
          )}

          <Link to="/profile" className="navbar-item">
            <Dropdown.Item
              as={NavItem}
              onSelect={() => {
                setNavbarExpanded(false);
              }}
            >
              <span className="p-0 m-0 d-flex align-items-center">
                <PersonLinesFill className="align-top" />
                <span className="ml-2">Profile</span>
              </span>
            </Dropdown.Item>
          </Link>

          <Link to="/contacts" className="navbar-item">
            <Dropdown.Item
              as={NavItem}
              onSelect={() => {
                setNavbarExpanded(false);
              }}
            >
              <span className="p-0 m-0 d-flex align-items-center">
                <PeopleFill className="align-top" />
                <span className="ml-2">Contacts</span>
              </span>
            </Dropdown.Item>
          </Link>

          {/* Failed prop type warning, idk how to fix this */}
          <Link to="/settings" className="navbar-item">
            <Dropdown.Item
              as={NavItem}
              onSelect={() => {
                setNavbarExpanded(false);
              }}
            >
              <span className="p-0 m-0 d-flex align-items-center">
                <GearFill className="align-top" />
                <span className="ml-2">Settings</span>
              </span>
            </Dropdown.Item>
          </Link>
          <Dropdown.Item onSelect={handleLogout}>
            <span className="p-0 m-0 d-flex align-items-center">
              <DoorOpenFill className="align-top" />
              <span className="ml-2">Logout</span>
            </span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </Nav>
  );

  const showNavSignedOut = (
    <Nav>
      <LinkContainer to="/login">
        <Nav.Link className="navbar-item">Login</Nav.Link>
      </LinkContainer>
      <LinkContainer to="/signup">
        <Nav.Link className="navbar-item">Signup</Nav.Link>
      </LinkContainer>
    </Nav>
  );

  /** --------- General Page --------- **/

  return (
    <Router history={history}>
      {/* Navbar */}
      <div className="h-100 d-flex flex-column">
        <Navbar
          bg="light"
          expand="lg"
          sticky="top"
          onToggle={setNavbarExpanded}
          expanded={navbarExpanded}
          onSelect={() => {
            setNavbarExpanded(false);
          }}
        >
          <LinkContainer to="/">
            <Navbar.Brand
              className="navbar-item"
              onClick={() => {
                setNavbarExpanded(false);
              }}
            >
              e-Template
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse className="justify-content-end">
            {sessionUsername ? showNavSignedIn : showNavSignedOut}
          </Navbar.Collapse>
        </Navbar>
        <div className="justify-content-center flex-grow-1">
          <Switch>
            <Route path="/create">
              <Create
                sessionUsername={sessionUsername}
                handleSessionTimeout={handleSessionTimeout}
                contacts={contacts}
              />
            </Route>
            <Route path="/edit">
              <Edit
                sessionUsername={sessionUsername}
                handleSessionTimeout={handleSessionTimeout}
                contacts={contacts}
              />
            </Route>
            <Route path="/settings">
              <Settings
                sessionUsername={sessionUsername}
                handleSessionTimeout={handleSessionTimeout}
                handleLogout={handleLogout}
                updateDisplayName={updateDisplayName}
              />
            </Route>
            <Route path="/profile">
              <Profile
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
                clearTags={clearTags}
                searchFilter={searchFilter}
                updateSearchFilter={updateSearchFilter}
                sessionUsername={sessionUsername}
                handleSessionTimeout={handleSessionTimeout}
              />
            </Route>
            <Route path="/contacts">
              <Contacts
                sessionUsername={sessionUsername}
                handleSessionTimeout={handleSessionTimeout}
                contacts={contacts}
                updateContacts={updateContacts}
              />
            </Route>
            <Route path="/login">
              <Login
                handleLogin={handleLogin}
                sessionUsername={sessionUsername}
              />
            </Route>
            <Route path="/signup">
              <Signup
                handleLogin={handleLogin}
                sessionUsername={sessionUsername}
              />
            </Route>
            {/* rather than using storybook, here's a page we can use for sandboxing components */}
            <Route path="/components">
              <ComponentTester
                sessionUsername={sessionUsername}
                handleSessionTimeout={handleSessionTimeout}
              />
            </Route>
            <Route path="/use">
              <Use
                sessionUsername={sessionUsername}
                handleSessionTimeout={handleSessionTimeout}
                contacts={contacts}
              />
            </Route>
            <Route path="/admin">
              <Admin
                sessionUsername={sessionUsername}
                isAdmin={isAdmin}
                handleSessionTimeout={handleSessionTimeout}
              />
            </Route>
            <Route path="/error">
              <Error errorMessage="Something went wrong. We'll fix it soon! (500 Internal Server Error)" />
            </Route>
            <Route path="/">
              <Home
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
                clearTags={clearTags}
                searchFilter={searchFilter}
                updateSearchFilter={updateSearchFilter}
                sessionUsername={sessionUsername}
                handleSessionTimeout={handleSessionTimeout}
              />
            </Route>
            <Route path="*">
              <Error errorMessage="The page you were looking for does not exist. (404 Not Found)" />
            </Route>
          </Switch>
          <SessionTimeoutModal
            show={showSessionTimeoutModal}
            handleLogout={handleLogout}
            onHide={setShowSessionTimeoutModal}
          />
        </div>
      </div>
    </Router>
  );
}
