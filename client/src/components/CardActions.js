import React from "react";
import { Dropdown } from "semantic-ui-react";

const CardActions = ({ editAction, deleteAction, pullRight }) => {
  return (
    <Dropdown
      style={{ float: pullRight ? "right" : "none", display: "inline-block" }}
      icon="bars"
    >
      <Dropdown.Menu>
        <Dropdown.Item onClick={editAction}>Edit</Dropdown.Item>
        <Dropdown.Item onClick={deleteAction}>Delete</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CardActions;
