import React from "react";
import { Table, Row, Container, Button } from "react-bootstrap";
import { CheckCircle } from "react-bootstrap-icons";
import AdminModal from "./AdminModal.js";

export default function AdminBannedEmails({
  bannedEmails,
  refreshAdminTables,
}) {
  // modal type
  const [type, setType] = React.useState(false);
  const [uuid, setUuid] = React.useState("");
  const [name, setName] = React.useState("");
  const [showModal, setShowModal] = React.useState(false);

  const bannedEmailsTableRows = () => {
    let res = [];
    if (bannedEmails.length > 0) {
      bannedEmails.forEach((email, index) => {
        res.push(
          <tr key={index + email}>
            <td>{email}</td>
            <td>
              <Container fluid>
                <Row className="px-0 d-flex justify-content-center">
                  <Button
                    className="mr-3 d-flex align-items-center"
                    variant="outline-success"
                    onClick={(e) => {
                      setType("unbanUser");
                      setUuid(email);
                      setName(email);
                      setShowModal(true);
                    }}
                  >
                    <CheckCircle className="mr-2" />
                    Unban
                  </Button>
                </Row>
              </Container>
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
        </tr>
      );
    return res;
  };

  return (
    <>
      <h5>Banned Emails</h5>
      <Table bordered size="md">
        <thead>
          <tr>
            <th style={{ width: "80%" }}>Email</th>
            <th style={{ width: "20%" }}>Actions</th>
          </tr>
        </thead>
        <tbody>{bannedEmailsTableRows()}</tbody>
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
