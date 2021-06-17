# e-Template REST API

## Users

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /api/users    | GET       | Gets all user information for all users in the database, returns list of objects where object corresponds to a user with info
| /api/users                 | POST    	| Create new user - takes in name {string}, email {string}, password {string}, returns id of account created {string}, throws {400} if invalid request, throws {401} if email already exists or banned email
| /api/users/isSignedIn      | GET    	| Check if user is signed in given the session ID, returns true if user is signed in, false if session ID is not defined (not signed in)
| /api/users/signin	         | POST 		| Signs in a particular user - takes in email {string}, password {string}, returns id {string} of account, throws {400} for invalid request, {401} if email/pass combo is incorrect, {403} if already signed in
| /api/users/signout	       | DELETE 	| Signs out of a user session - returns uuid of signed out user {string}, throws {401} if no user signed in
| /api/users/:id    		| GET    		  | Get a users name from uuid - takes in a param of user id, returns the name associated with user if a user ID exists, throws {401} if no id given or id doesn't match any users
| /api/users    		| DELETE    		  | Deletes the logged in users account - takes in current password {string}, returns message saying properly deleted, throws {401} if not signed in, throws {403} if incorrect password given
| /api/users/name    		| PUT    		  | Changes user name for signed in user - takes in new name {string}, and existing password {string}, returns new name {string} if successful, throws {400} for empty new name, {401} if not signed in, {403} for incorrect password
| /api/users/email    		| PUT    		  | Changes user email for signed in user - takes in new email {string}, and existing password {string}, returns new email {string} if successful, throws {400} for empty new email, {401} if not signed in, {403} for incorrect password
| /api/users/password    		| PUT    		  | Changes user password for signed in user - takes in new password {string}, and existing password {string}, returns nothing (no passwords should be sent back), throws {400} for empty new password, {401} if not signed in {403} for incorrect password
| /api/users/email/:id    		| GET    		  | Gets a users email - takes in params user id {string}, returns email for that user {string}, throws {400} if a user with id does not exist
| /api/users/auth    		| POST    		  | Check if cookie matches an existing user account - takes in cookie {string}, throws {404} for cookie not passed in, and {400} for not user account associated with the cookie
| /api/users/all/nonAdmin   | GET       | Gets all user information for non admin users, returns list of object where object represents a user and has their id and email, route used for admin page to see non-admin

## Templates

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /api/templates    			| POST    		| Create a template - takes in title {string}, blurb {string}, locationId {string}, locationName {string}, published {bool}, subject {string}, content {string}, tags {list\<string>}, toRecipients (the 'to' emails) {list\<object>}, ccRecipients (the 'cc' emails) {list\<object>}, bccRecipients (the 'bcc' emails) {list\<object>} (where object corresponds to either plain email, contact, or group), returns id of new template created {string}, throws {401} if user is not signed in, throws {400} if published is not given
| /api/templates/id    		| PUT    		  | Edits a template - takes in id of template to be edited {string}, title {string}, blurb {string}, locationId {string}, locationName {string}, published {bool}, subject {string}, content {string}, tags {list\<string>}, toRecipients (the 'to' emails) {list\<object>}, ccRecipients (the 'cc' emails) {list\<object>}, bccRecipients (the 'bcc' emails) {list\<object>}, returns id of edited templates {string}, throws {400} for no published bool, {401} if no user is signed in, {403} if user does not match the author of the template
| /api/templates/id    		| DELETE    	| Deletes template with id - takes in template id to delete {string}, returns message saying its been deleted {string}, throws {400} if template does not exist for given id, {401} if user is not logged in, {403} if user is not the author of the template
| /api/templates/publish/id    		| PUT    		  | Publishes a template with id - takes in id of template to be published, returns message saying its been published {string}, throws {400} if no template exists with given id, {401} if not logged in, {403} if signed in user doesnt own the template
| /api/templates/unpublish/id    		| PUT    		  | Unpublishes a template with id - takes in id of template to be unpublished, returns message saying its been unpublished {string}, throws {400} if no template exists with given id, {401} if not logged in, {403} if signed in user doesnt own the template
| /api/templates/duplicate/:id    		| POST    		  | Creates a duplicate from given id (as a draft), takes in template id to be duplicated {string}, returns id of newly created template {string}, throws {400} if no template exists with this id, {401} if user is not logged in
| /api/templates/id/:id   | GET    		  | Gets template info for id - takes in id to get template info for {string}, returns id {string}, blurb {string}, location_id {string}, display_location {string}, published {bool}, creator_id {string}, author {string}, subject {string}, content {string}, created_on {timestamp - string}, tags {list\<string>}, toRecipients {list\<object>}, ccRecipients {list\<object>}, bccRecipients{list\<object>}
| /api/templates/ids    		| POST    		  | Gets template info for multiple template ids - returns list\<object>, where object corresponds to what is returned for GET/api/templates/id/:id (the one above)
| /api/templates    		| GET    		  | Find all published template ids - returns ids {list\<string>} of all template ids that are currently published
| /api/templates/filters   | POST    		| Find all published templates with filters - returns {list\<string>} of all templates that match filters such as tags, locations, and authors, takes in tags {list\<string>}, authors {list\<string>}, and locations {list\<string>} to filter by, returns ids {list\<string>} of ids that match at least one filter
| /api/templates/tags    	 | POST    		| Retrieve all templates (by tag) - takes in tags to filter by {list\<string>}, returns ids that match at least one tag {list\<string>}, returns {400} if no tags passed in
| /api/templates/locations | POST    		| Retrieve all templates (by location) takes in locations to filter by {list\<string>}, returns ids that match at least one location {list\<string>}, returns {400} if no locations passed in
| /api/templates/authors   | POST    		| Retrieve all published templates (by author) takes in authors to filter by {list\<string>}, returns ids that match at least one author {list\<string>}, returns {400} if no authors passed in or authors do not exist in db
| /api/templates/authors/:id | GET		| Retrieve all published templates (by author uuid) - takes in id of author to get publishesd templates for {string}, returns published template ids for that author {list\<string>}, throws {400} if author id not specified
| /api/templates/drafts    | GET    		| Retrieve all draft templates for signed in user - returns published template ids for that author {list\<string>}, throws {401} if user is not logged in
| /api/templates/bookmarks    		| GET    		  | Get template ids for signed in user bookmarked templates - returns bookmarked template ids for the signed in user {list\<string>}, throws {401} if not signed in
| /api/users/bookmarks/:id    		| POST    		  | Adds template to users bookmarked templates - takes in a template id to be bookmarked {string}, returns id of bookmarked template {string}, throws {400} if no template is associated with the ID or if its been already bookmarked, throws {401} if a user is not signed in
| /api/users/bookmarks/:id    		| DELETE    		  | Removes template from users bookmarked templates - takes in a template id to be un-bookmarked {string}, returns id of un-bookmarked template {string}, throws {400} if no template is associated with the ID or if its not currently bookmarked, throws {401} if a user is not signed in
| /api/templates/tags    		| GET    		  | Gets all tags for published templates - returns {list\<string>} of all published tags
| /api/templates/locations    		| GET    		  | Gets all published locations, returns {list\<string>} of all published locations
| /api/templates/authors    		| GET    		  | Gets all published authors - returns {list\<string>} of published author names
| /api/templates/drafts/tags    | GET           | Gets all tags for draft templates for logged in user - returns {list\<string>} of all draft tags for the signed in user, throws {401} if user is not signed in
| /api/templates/drafts/locations       | GET       | Gets all locations for draft templates logged in user - returns {list\<string>} of all draft locations for the signed in locations, throws {401} if user is not signed in
| /api/templates/comments       | POST    	| Adds comment to a template, takes in id {string} of template to add comment for, comment {string}, returns id {string} of new comment id, throws {401} if not logged in, {400} if empty comment or template id
| /api/templates/comments       | DELETE    | Deletes a comment for a template, takes in id {string} of comment to remove, returns deleted {bool} true if removed, throws {401} if user not logged in, {403} if logged in user is not author of comment, {400} if no comment with this id exists
| /api/templates/comments/:id   | GET      	| Gets comments for a template, takes in template id {string}, returns comments {list\<object>} where object corresponds to comment: {id: {string}, user_id: {string}, comment {string}, commented_on: timestamp {string}, name (of author): {string}}, throws {400} if no template id given

## Moderation

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /api/moderation/admins                 | POST    	| Adds a user to admin - takes in user id to add as an admin, returns id of user added to admins {string}, throws {400} if no user is associated with uuid or is already in admin, {500} for unknown error
| /api/moderation/admins                 | DELETE    	| Removes a user from admin - takes in an id of user to remove from admin, returns id of user removed from admins {string}, throws {400} if user does not exist or user is already not admin, {500} for unknown error
| /api/moderation/admins/:id                 | GET    	| Gets if a user with uuid is an admin - takes in uuid of user to check {string}, returns {bool} whether or not user is an admin, throws {400} if no user associated with uuid
| /api/moderation/reports/templates                 | POST    	| Reports a template - takes in an id of template to be reported {string} and reason (possibly null) explaining why you are reporting {string}, returns true if reported, throws {400} if template does not exist or user has already reported the template, throws {401} if user is not signed in
| /api/moderation/reports/users                 | POST    	| Reports a user - takes in an id of user to be reported {string} and reason (possibly null) explaining why you are reporting {string}, returns true if reported, throws {400} if reported user does not exist or user has already reported the other user, throws {401} if user is not signed in
| /api/moderation/reports/comments        | POST             | Reports a comment - takes in an id of comment to be reported {string} and reason (possibly null) {string} explaining why you are reporting, returns true if reported, throws {400} if reported comment does not exist or user has already reported comment, throws {401} if not signed in
| /api/moderation/reports/templates                 | GET    	| Gets all current reports for templates along with reasons for admin - returns {list\<string, string>} that is a list of tuples corresponding to template ids and reasons for reporting, throws {401} if user is not signed in, {403} if signed in user is not an admin
| /api/moderation/reports/users                 | GET    	| Gets all current reports for users along with reasons for admin - returns {list\<string, string>} that is a list of tuples corresponding to user ids and reasons for reporting, throws {401} if user is not signed in, {403} if signed in user is not an admin
| /api/moderation/reports/comments        | GET             | Gets all current reports for comments along with reasons for admin - returns {list\<string, string>} that is a list of tuples corresponding to comment ids and reasons for reporting, throws {401} if user is not signed in, {403} if signed in user is not an admin
| /api/moderation/reports/templates/deletion                 | DELETE    	| Deletes a template due to report - takes in reported template id to delete, returns true if it was deleted, throws {400} if template was never reported, {401} if user is not signed in, {403} if signed in user is not an admin
| /api/moderation/reports/templates/resolution                 | DELETE    	| Resolves a template in reported templates (ignores report request) - takes in reported template id to remove all report requests, returns true if it was resolved, throws {400} if template was never reported, {401} if user is not signed in, {403} if signed in user is not an admin
| /api/moderation/reports/comments/deletion        | DELETE             | Deletes a comment due to report - takes in reported comment id to delete, returns true if deleted, throws {400} if comment was never reported, {401} if user is not signed in, {403} if signed in user is not admin
| /api/moderation/reports/comments/resolution        | DELETE             | Resolves a comment in reported comments (ignores request, deletes reports for comment) - takes in reported comment id to remove all report requests, returns true if it was resolved, throw {400} if comment was never reported, {401} if user is not signed in, {403} if signed in user is not an admin
| /api/moderation/reports/users/banned                 | POST    	| Bans a user's email in the reported users (where ban means deleting the user account and adding email to banned emails list) - takes in id of user to ban {string}, returns true if banned, throws {400} if user was never reported, {401} if user is not signed in, {403} if signed in user is not an admin
| /api/moderation/reports/users/resolution                 | DELETE    	| Resolves a user in reported users (ignores the report) - takes in reported user id to remove all report requests, returns true if it was resolved, throws {400} if user was never reported, {401} if user is not signed in, {403} if signed in user is not an admin
| /api/moderation/reports/templates/:id                 | GET    	| Gets reported template ids for a user - takes in id of user to check for template report {string}, returns {list\<string>} of template ids that have been reported
| /api/moderation/reports/comments/:id        | GET             | Gets reported comments for user id, takes in id {string}, returns {comment_id: list\<string>} comment ids reported
| /api/moderation/reports/admins        | GET             | Gets all admins, returns admins {list\<object>} where object corresponds to {user_id: {string}, name: {string}, email: {string}}, throws {401} if not logged in, {403} if logged in user is not admin
| /api/moderation/reports/users/banned        | DELETE             | Unbans an email (removes it from banned list), takes in email to unban {string}, returns unbanned {bool} true if removed, throws {400} if no email given, {401} if not logged in, {403} if not admin

# Contacts

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /api/contacts/groups                 | POST    	| Adds a group to a users contacts, takes in name {string} of new group name and members {list\<object>} where object corresponds to either contact (of form {name: {string}, email: {string}}) or email {string}, returns id {string} of new group id, throws {400} if group name already exists for the user or name or members is empty, {401} if not logged in
| /api/contacts/individuals                 | POST    	| Adds an individual to a users contacts, takes in name {string}, email {string} of new contact, returns id {string} of new contact id, throws {400} if individual with email already exists for user or if name/email is empty, {401} if not logged in
| /api/contacts/groups                 | GET    	| Gets groups for signed in user, returns groups {list\<object>} where object corresponds to {id: {string}, name {string} of group, members: {list\<object>} where object correspond to either string or individual object}, throws {401} if not logged in
| /api/contacts/individuals                 | GET    	| Gets individuals for signed in user, returns individuals {list\<object>} where object corresponds to {id: {string}, name: {string}, email: {string}}, throws {401} if not logged in
| /api/contacts/                 | GET    	| Gets all contacts for a user, returns contacts {list\<object>} where object corresponds to either group or individual, throws {401} if user not signed in
| /api/contacts/groups                 | PUT    	| Edits pre-existing group, takes in id {string} of group to edit, {string} (possibly new) name of group, {list\<object>} members, returns id {string} of editted group, throws {401} if not logged in, {400} if new name/members are empty or if group id is invalid, or if new group name already exists for different group for user
| /api/contacts/individuals                 | PUT    	| Edits pre-existing individual, takes in id {string} of individual to edit, name (possibly new) {string}, email {string}, returns id {string} of editted individual, throws {401} if not logged in, {400} if name/email is empty, or new email corresponds to different individual contact, {400} if individual id is invalid
| /api/contacts/groups                 | DELETE    	| Deletes a group from contacts for a user, takes in group id {string} to delete, returns deleted {bool} true if removed, throws {401} if not logged in, {400} if group id is invalid
| /api/contacts/individuals                 | DELETE    	| Deletes an individual for a user, takes in individual id {string} to delete, returns deleted {bool} true if removed, throws {401} if not logged in, {400} if id is invalid

# Insights

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /api/insights/viewCount                 | POST    	| Adds a view count for a template, takes in template id to add view count for, returns added {bool} if count was added
| /api/insights/mailCount                 | POST    	| Adds a mailed count for a template, takes in template id to add mailed count for, returns added {bool} if count was added
| /api/insights/filterBusterCount                 | POST    	| Adds a filter buster use count for a template, takes in template id to add filter buster count for, returns added {bool} if count was added
| /api/insights/viewCount/:id                 | GET    	| Gets viewCount for an id, takes in template id to get count for, returns viewCount {int} number of views
| /api/insights/mailCount/:id                 | GET    	| Gets mailCount for an id, takes in template id to get mailed count for, returns mailCount {int} number of mailed uses
| /api/insights/filterBusterCount/:id                 | GET    	| Gets filterBusterCount for an id, takes in template id to get number of filter buster uses, returns filterBusterCount {int} number of filter buster uses
| /api/insights/bookmarkCount/:id                 | GET    	| Gets bookmark count for an id, takes in template id to get number of bookmarks, returns bookmarkCount {int} number of bookmarks for template
| /api/insights/commentCount/:id                 | GET    	| Gets comment count for an id, takes in template id to get number of comments, returns commentCount {int} number of comments for template
| /api/insights/:id                 | GET    	| Gets insights for an id, takes in template id to get insights for, returns viewCount {int}, mailCount {int}, filterBusterCount {int}, bookmarkCount {int}, commentCount {int}

# Location

| **URL** | **HTTP Verb** |  **Action**|
|------------|-------------|------------|
| /api/location/autocomplete                 | GET    	| Gets location autocomplete results from Google Places API, returns a list of id {string} and name {string} to be used to the client side for location selection; throws {400} if missing parameter
