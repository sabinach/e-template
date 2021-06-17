/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Link } from "react-router-dom";
import RequestTemplates from "../services/RequestTemplates.js";

export default function DuplicatedFrom({ template }) {
  const templateDeletedMessage = "[Template Deleted]";
  const [duplicatedFromTitle, setDuplicatedFromTitle] = React.useState(
    templateDeletedMessage
  );
  const [duplicatedUrl, setDuplicatedUrl] = React.useState("/");

  React.useEffect(() => {
    if (template.duplicate) {
      // if duplicated_from template is not null (aka still exists)
      if (template.duplicated_from) {
        RequestTemplates.getTemplateById({
          id: template.duplicated_from,
        })
          .then((res) => {
            setDuplicatedFromTitle(res.data.title);
            setDuplicatedUrl(`/use/${res.data.id}`);
          })
          .catch((error) => {
            // TODO - error occured (most likely that an original template of a duplicate no longer exists)
          });
      } else {
        // TODO - error occured (most likely that an original template of a duplicate no longer exists)
      }
    }
  }, []);

  return (
    <>
      {template.duplicate ? (
        <>
          <small>
            Based on:{" "}
            {duplicatedFromTitle === templateDeletedMessage ? (
              <>{duplicatedFromTitle}</>
            ) : (
              <Link
                to={duplicatedUrl}
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {duplicatedFromTitle}
              </Link>
            )}
          </small>
        </>
      ) : (
        <></>
      )}
    </>
  );
}
