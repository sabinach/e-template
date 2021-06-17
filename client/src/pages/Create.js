/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Switch, Route } from "react-router-dom";
import TemplateEdit from "../components/TemplateEdit";

export default function Create({
  sessionUsername,
  handleSessionTimeout,
  contacts,
}) {
  return (
    <Switch>
      <Route
        path="/create"
        children={
          <TemplateEdit
            sessionUsername={sessionUsername}
            handleSessionTimeout={handleSessionTimeout}
            contacts={contacts}
          />
        }
      />
    </Switch>
  );
}
