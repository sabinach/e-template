import React from "react";
import Form from "react-bootstrap/Form";
import Badge from "react-bootstrap/Badge";
import "../styles/Pill.css";

function PillFormGroup({
  onChange,
  placeholder,
  label,
  separatorRegexp,
  formText,
  validate,
  initialItems = [],
  spacesAllowed,
}) {
  const [items, setItems] = React.useState([]);
  const [value, setValue] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);

  const handleBlur = () => {
    const trimmed = value.trim();

    if (trimmed && isValid(trimmed)) {
      setValue("");
      const newItems = [...items, trimmed];
      setItems(newItems);
      onChange(newItems);
    }
  };

  const handleKeyDown = (e) => {
    const keyCode = e.keyCode || e.which;
    if (keyCode === 13) {
      e.preventDefault();
    }
    if (keyCode === 13 || (separatorRegexp && separatorRegexp.test(e.key))) {
      handleBlur();
    }
  };

  const handleChange = (e) => {
    let newValue = spacesAllowed ? e.target.value : e.target.value.trim();
    newValue = newValue.replace(separatorRegexp, "");
    setValue(newValue);
    setError("");
  };

  const handleDelete = (item) => {
    const newItems = items.filter((i) => i !== item);
    setItems(newItems);
    onChange(newItems);
  };

  const handlePaste = (e) => {
    e.preventDefault();

    const paste = e.clipboardData.getData("text");
    let toBeAdded = paste.split(separatorRegexp);

    toBeAdded = toBeAdded.filter((input) => !isInList(input));

    const newItems = [...items, ...toBeAdded];
    setItems(newItems);
    onChange(newItems);
  };

  function isValid(input) {
    let error = "";
    if (validate) {
      error = validate(input);
    }
    if (error) {
      setError(error);
      return false;
    }
    if (isInList(input)) {
      setError(`${input} already added.`);
      return false;
    }
    return true;
  }

  function isInList(input) {
    return items.includes(input);
  }

  return (
    <Form.Group>
      <div className="mb-1">
        <Form.Label>{label}:</Form.Label>&nbsp;
        {items.map((item) => (
          <Badge pill variant="primary" key={item} className="pill-item">
            {item}
            <button
              type="button"
              className="button"
              onClick={() => handleDelete(item)}
            >
              &times;
            </button>
          </Badge>
        ))}
      </div>

      <Form.Control
        className={"input " + (error && " is-invalid")}
        value={value}
        placeholder={placeholder}
        onKeyDown={handleKeyDown}
        onChange={handleChange}
        onBlur={handleBlur}
        onPaste={handlePaste}
      />
      <Form.Text className="text-muted">{formText}</Form.Text>

      {error && (
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      )}
    </Form.Group>
  );
}

export default PillFormGroup;
