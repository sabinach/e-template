import React from "react";
import RequestLocation from "../services/RequestLocation.js";
import RequestTemplates from "../services/RequestTemplates.js";
import { AsyncTypeahead } from "react-bootstrap-typeahead";

function LocationAutocomplete({
  onSelect,
  showExistingLocations,
  placeholder = "",
  defaultInputValue = "",
}) {
  const [isLoading, setIsLoading] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  const [selected, setSelected] = React.useState([]);
  const [existingLocations, setExistingLocations] = React.useState([]);

  React.useEffect(() => {
    if (showExistingLocations) {
      RequestTemplates.getAllLocations()
        .then((res) => {
          setExistingLocations(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return (
    <AsyncTypeahead
      id="locationInput"
      placeholder={placeholder}
      defaultInputValue={defaultInputValue}
      isLoading={isLoading}
      labelKey={(option) => `${option.name}`}
      onSearch={(query) => {
        setIsLoading(true);
        RequestLocation.autocomplete(query)
          .then((res) => {
            let data = res.data.data;
            if (showExistingLocations) {
              data = data.concat(existingLocations);
            }
            setOptions(data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(`err: ${err}`);
            setIsLoading(false);
          });
      }}
      onChange={(selected) => {
        setSelected(selected);
        if (selected.length > 0) onSelect(selected[0]);
      }}
      selected={selected}
      options={options}
      shouldSelectHint
      newSelectionPrefix={"Add: "}
      flip
      highlightOnlyResult
    />
  );
}

export default LocationAutocomplete;
