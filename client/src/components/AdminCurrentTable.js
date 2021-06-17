import React from "react";
import { Container, Row, Table, Button } from "react-bootstrap";
import { PersonX, Trash } from "react-bootstrap-icons";
import AdminModal from "./AdminModal.js";
import "../styles/AdminTable.css";

export default function AdminCurrentTable({
  sessionUsername,
  adminIds,
  adminUserNames,
  adminEmails,
  refreshAdminTables,
}) {
  // modal type
  const [type, setType] = React.useState(false);
  const [uuid, setUuid] = React.useState("");
  const [name, setName] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  const adminCurrentTableRows = () => {
    let res = [];

    if (
      adminIds.length > 0 &&
      adminUserNames.length > 0 &&
      adminEmails.length > 0
    ) {
      adminUserNames.forEach((name, index) => {
        const id = adminIds[index];
        const email = adminEmails[index];
        res.push(
          <tr key={index + name}>
            <td>
              <Container fluid>
                <Row className="px-0 d-flex align-items-center">
                  <PersonX
                    className="mr-2 admin-ban-user"
                    style={{ color: "#BF0000" }}
                    onClick={(e) => {
                      setType("banUser");
                      setUuid(id);
                      setName(name);
                      setShowModal(true);
                    }}
                  />
                  {name}
                </Row>
              </Container>
            </td>

            <td>{email}</td>
            <td>
              {sessionUsername !== id ? (
                <Container fluid>
                  <Row className="px-0 d-flex justify-content-center">
                    <Button
                      className="mr-3 d-flex align-items-center"
                      variant="outline-danger"
                      onClick={(e) => {
                        setType("removeAdmin");
                        setUuid(id);
                        setName(name);
                        setShowModal(true);
                      }}
                    >
                      <Trash className="mr-2" />
                      Remove Admin
                    </Button>
                  </Row>
                </Container>
              ) : (
                <></>
              )}
            </td>
          </tr>
        );
      });
    }
    // no admins
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
      <h5>Current Admins</h5>
      <Table bordered size="md">
        <thead>
          <tr>
            <th style={{ width: "24%" }}>Name</th>
            <th style={{ width: "36%" }}>Email</th>
            <th style={{ width: "40%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>{adminCurrentTableRows()}</tbody>
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
