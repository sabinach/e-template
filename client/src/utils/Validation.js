/* Login / Signup Form Input Validation */

export function validateName(name) {
  return name.length > 0;
}

export function validateEmail(email) {
  const validator = require("email-validator");
  return validator.validate(email);
}

export function validatePassword(password) {
  return password.length > 3;
}

export function validateConfirmPassword(password, confirmPassword) {
  return validatePassword(password) && password === confirmPassword;
}

export function validateVerifyPassword(password) {
  return password.length > 0;
}

/* Template Form Validation */

// TODO make maximum lengths for some of these
export function validateTitle(title) {
  return title.length > 0;
}

export function validateContent(content) {
  return content && content.length > 0;
}

export function validateTags(tags, limit = 0) {
  return tags.length > 0 && (limit > 0 ? tags.length <= limit : true);
}

export function validateRecipients(tags, limit = 20) {
  const emailsIncluded = [];
  tags.forEach((t) => {
    if (typeof t === "object") {
      if (t.email) {
        emailsIncluded.push(t.email);
      } else {
        t.members.forEach((member) => {
          if (typeof member === "object") {
            emailsIncluded.push(member.email);
          } else {
            emailsIncluded.push(member);
          }
        });
      }
    } else {
      emailsIncluded.push(t);
    }
  });
  return tags.length <= limit && emailsIncluded.length <= limit;
}

export function validateLocation(location_id) {
  return location_id.length > 0;
}
