import React from "react";
import { Table, Row, Container, Button } from "react-bootstrap";
import { PersonX, Trash, CheckCircle } from "react-bootstrap-icons";
import AdminModal from "./AdminModal.js";
import "../styles/AdminTable.css";

export default function AdminTemplateTable({
  usersToTemplates,
  templates,
  userNames,
  templateNames,
  refreshAdminTables,
}) {
  // modal type
  const [type, setType] = React.useState(false);
  const [uuid, setUuid] = React.useState("");
  const [name, setName] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  const templateTableRows = () => {
    let res = [];
    if (
      usersToTemplates.size > 0 &&
      templates.size > 0 &&
      userNames.size > 0 &&
      templateNames.size > 0
    ) {
      usersToTemplates.forEach((template_ids, user_id) => {
        template_ids.forEach((id, idx) => {
          res.push(
            <tr key={id + template_ids}>
              {idx === 0 ? (
                // User
                <td rowSpan={template_ids.length} className="align-top">
                  <Container fluid>
                    <Row className="px-0 d-flex align-items-center">
                      <PersonX
                        className="mr-2 admin-ban-user"
                        style={{ color: "#BF0000" }}
                        onClick={(e) => {
                          setType("banUser");
                          setUuid(user_id);
                          setName(userNames.get(user_id));
                          setShowModal(true);
                        }}
                      />
                      {userNames.get(user_id)}
                    </Row>
                  </Container>
                </td>
              ) : (
                <></>
              )}
              {/* Reported Templates */}
              <td>
                <Container fluid>
                  <Row className="px-0 d-flex align-items-center">
                    <a href={`/use/${id}`}>{templateNames.get(id)}</a>
                  </Row>
                </Container>
              </td>
              {/* Reasons */}
              <td>
                <ul className="pl-3">
                  {templates &&
                  templates.get(id) &&
                  templates.get(id).length > 0 ? (
                    templates
                      .get(id)
                      .map((reason) => (
                        <li key={reason}>
                          {reason ? reason : "(no reason given)"}
                        </li>
                      ))
                  ) : (
                    <li>{"(no reason given)"}</li>
                  )}
                </ul>
              </td>
              <td>
                <Container fluid>
                  <Row className="px-0 d-flex justify-content-center">
                    <Button
                      className="mr-3 d-flex align-items-center"
                      variant="outline-success"
                      onClick={(e) => {
                        setType("resolveTemplate");
                        setUuid(id);
                        setName(templateNames.get(id));
                        setShowModal(true);
                      }}
                    >
                      <CheckCircle />
                    </Button>
                    <Button
                      className="mr-3 d-flex align-items-center"
                      variant="outline-danger"
                      onClick={(e) => {
                        setType("deleteTemplate");
                        setUuid(id);
                        setName(templateNames.get(id));
                        setShowModal(true);
                      }}
                    >
                      <Trash />
                    </Button>
                  </Row>
                </Container>
              </td>
            </tr>
          );
        });
      });
    }

    // no templates reported
    if (res.length === 0)
      res.push(
        <tr key={0}>
          <td>None!</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      );
    return res;
  };

  return (
    <>
      <h5>Reported Templates</h5>
      <Table bordered width={"20%"}>
        <thead>
          <tr>
            <th style={{ width: "20%" }}>Author</th>
            <th style={{ width: "20%" }}>Template</th>
            <th style={{ width: "40%" }}>Reasons</th>
            <th style={{ width: "20%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>{templateTableRows()}</tbody>
      </Table>
      <AdminModal
        type={type}
        id={uuid}
        name={name}
        showModal={showModal}
        setShowModal={setShowModal}
        refreshAdminTables={refreshAdminTables}
      />
    </>
  );
}
