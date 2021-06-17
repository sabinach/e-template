# e-Template

## Not Fritter

### Purpose and Functionality

e-Template will

- make it easy for activists to find email templates applicable to the causes they want to support.
- make it easy for activists with or without a tech background to make customizable email templates.
- allow authors to see insights as to how much reach their published templates have had.

### To View on Heroku:

- https://e-template.herokuapp.com/

### To Run Locally:

- Frontend access the website at: [localhost:3000](http://localhost:3000)
- Backend access the website at: [localhost:8080](http://localhost:8080)

#### How to get heroku environment config vars for the database

Initialize this repo with heroku's git. You must be a collaborator and signed in on heroku for the e-template account to do this:

```
heroku git:remote -a e-template
```

there is a script called `get_env_from_heroku.sh` in `root/`.

```
npm install
chmod a+x get_env_from_heroku.sh
./get_env_from_heroku.sh
```

#### Frontend Only

- if you only want to look at the front end, you can try:

```
cd client
npm install
npm run start
```

#### Frontend and Backend

- if you want to test front and back end together locally, open two terminal windows one in `client/` folder and one in `root/` directory.
- Run the following in the `root/`:

```
npm install
npm run demon
```

- Run the following in `client/`:

```
cd client
npm install
npm run start
```

#### Production Build

- if you want to run it like heroku does (production build, will be slow to build)

```
npm install; cd client; npm install; npm run build; cd ..; npm start
```

### Authorship:

- **Stephanie Yoon**:

  - client/src/
    - App.js (co-wrote with Sabina)
  - client/src/pages/
    - Error.js
    - Settings.js (co-wrote with Sabina)
    - Edit.js (co-wrote with Sabina and Jonathan)
    - Create.js (co-wrote with Sabina)
    - Use.js (co-wrote with Jonathan)
    - Profile.js (co-wrote with Sabina)
    - Home.js (co-wrote with Sabina)
    - Contacts.js (co-wrote with Sabina)
  - client/src/components/
    - RTEIframe.js
    - RTELinkButton.js
    - RTEPostButton.js
    - RTEInsertButton.js
    - RTE.js
    - TagInput.js
    - SearchToken.js
    - SessionTimeoutModal.js
    - TemplateEdit.js
    - HelpIcon.js
    - BackButton.js
    - ForgotPassword.js
    - ContactToken.js
    - RecipientInput.js
    - SignupForm.js (co-wrote with Sabina)
    - LoginForm.js (co-wrote with Sabina)
    - SignupMessage.js (co-wrote with Sabina)
    - LoginMessage.js (co-wrote with Sabina)
    - TemplateUse.js (co-wrote with Sabina and Jonathan)
    - HomeMessage.js (co-wrote with Sabina)
    - Search.js (co-wrote with Sabina)
    - TemplateList.js (co-wrote with Sabina)
    - TemplateEditor.js (co-wrote with Jonathan)
    - TemplateUse.js (co-wrote with Jonathan)
    - TemplateCard.js (co-wrote with Sabina)
    - CommentCard.js (co-wrote with Sabina)
  - client/src/components/template_options/
    - ShareModal.js (co-wrote with Sabina)
    - DeleteModal.js (co-wrote with Sabina)
    - DuplicateDropdownItem.js (co-wrote with Sabina)
    - EditDropdownItem.js (co-wrote with Sabina)
    - OptionsDropdownToggle.js (co-wrote with Sabina)
    - ReportModal.js (co-wrote with Sabina)
    - UnpublishDropdownItem.js (co-wrote with Sabina)
  - client/src/constants/
    - RTE.js
    - ShareModal.js
    - TemplateEditor.js
    - TemplateList.js
  - client/src/styles/
    - RTE.css
    - BackButton.css
    - Login.css
    - LoginForm.css
    - Search.css
    - Signup.css
    - TemplateCard.css
    - TemplateUse.css
    - App.css (co-wrote with Sabina)
    - TemplateCard.css (co-wrote with Sabina)
  - client/src/utils
    - Validation.js (co-wrote with Sabina)
  - client/public
    - favicon.ico
    - index.html
    - logo192.png
    - logo512.png

- **Jonathan Wang**:
  - Boilerplate code
  - heroku deploy workflow
  - heroku config vars for DB
  - /
    - .gitignore
    - devops.md (co-wrote with Steph and Sabina)
    - get_env_from_heroku.sh
  - client/src/components/
    - TemplateEditor.js (co-wrote with Steph and Sabina)
    - TemplateUse.js (co-wrote with Steph and Sabina)
    - LocationAutocomplete.js
    - TemplateList.js (location refactoring)
  - client/src/pages/
    - Edit.js (co-wrote with Steph)
    - Use.js  (co-wrote with Steph and Sabina)
    - Admin.js  (co-wrote with Sabina)
    - Search.js (location refactoring)
  - client/src/util/
    - Validation.js (template validation methods)
  - client/
    - App.js (location refactoring)
  - db/
    - db_config.js (co-wrote with Tess)
  - models/
    - Templates.js (location refactoring)
    - Locations.js
  - routes/
    - templates.js (location refactoring)
    - location.js
- **Tess Gustafson**:
  - db/
    - db_config.js
      - The whole set up
      - Everything except minor change to templates for Jonathan's location refactor 
    - setting up Heroku postgres (all)
  - models/
    - Templates.js (all- except minor location refactor by Jonathan)
    - Users.js (all)
    - Moderation.js (all)
    - Contacts.js (all)
    - Insights.js (all)
  - routes/
    - index.js (all)
    - templates.js (all except minor change by Jonathan)
    - users.js (all except one)
    - moderation.js (all except one)
    - contact.js (all)
    - insights.js (all)
  - client/src/services/
    - RequestUsers.js
      - isSignedIn
      - getNameFromUUID
      - getBookmarkedTemplates
      - setUserName
      - setUserEmail
      - setUserPassword
      - addBookmark
      - deleteBookmark
      - deleteAccount
    - RequestTemplates.js
      - deleteTemplateByID
      - publishTemplateById
      - unpublishTemplateById
      - getTemplateIDsByFilter
      - getPublishedTemplateIDsByAuthorUUID
      - duplicateTemplate
      - getAllLocations
      - getAllTags
      - getAllAuthors
      - getAllDraftTags
      - getAllDraftLocations
    - RequestModeration.js (all)
    - RequestInsights.js (all)
    - RequestContacts.js (all)
  - Frontend backend integration
    - First to link sign up information from front to backend
    - Small frontend changes for backend errors
  - Various pair-coding/debugging tasks with Sabina over Zoom related to integrating front and backend that took many hours
  - Basicall all of the backend other than location refactor done by Jonathan
- **Sabina Chen**:
  - /
    - API.md (co-wrote with Tess)
    - devops.md (co-wrote with Steph and Jonathan)
  - client/src/
    - App.js (co-wrote with Steph)
  - client/src/components/
    - AdminAddNew.js
    - AdminBannedEmails.js
    - AdminCommentTable.js
    - AdminCurrentTable.js
    - AdminModal.js
    - AdminTemplateTable.js
    - DuplicatedFrom.js
    - CommentCard.js (co-wrote with Steph)
    - CommentList.js (co-wrote with Steph)
    - ForgotPassword.js (co-wrote with Steph)
    - HomeMessage.js (co-wrote with Steph)
    - LoginForm.js (co-wrote with Steph)
    - LoginMessage.js (co-wrote with Steph)
    - ProfileMessage.js (co-wrote with Steph)
    - Search.js (co-wrote with Steph)
    - SignupForm.js (co-wrote with Steph)
    - SignupMessage.js (co-wrote with Steph)
    - TemplateCard.js (co-wrote with Steph)
    - TemplateEdit.js (co-wrote with Steph and Jonathan)
    - TemplateEditor.js (co-wrote with Steph and Jonathan)
    - TemplateList.js (co-wrote with Steph)
    - TemplateUse.js (co-wrote with Steph and Jonathan)
  - client/src/components/template_options
    - DeleteDropdownItem.js
    - EditDropdownItem.js
    - ReportDropdownItem.js
    - ShareDropdownItem.js
    - ViewDropdownItem.js
    - DeleteModal.js (co-wrote with Steph)
    - DuplicateDropdownItem.js (co-wrote with Steph)
    - OptionsDropdownToggle.js (co-wrote with Steph)
    - PublishDropdownItem.js (co-wrote with Steph)
    - ReportModal.js (co-wrote with Steph)
    - ShareModal.js (co-wrote with Steph)
    - UnpublishDropdownItem.js (co-wrote with Steph)
  - client/src/constants/
    - App.js
    - CommentCard.js
    - ShareModal.js
    - TemplateEdit.js
    - TemplateUse.js
    - TemplateCard.js (co-wrote with Steph)
  - client/src/pages/
    - Admin.js (co-wrote with Jonathan)
    - ComponentTester.js (co-wrote with Steph)
    - Contacts.js (co-wrote with Steph)
    - Create.js (co-wrote with Steph)
    - Edit.js (co-wrote with Steph and Jonathan)
    - Home.js (co-wrote with Steph)
    - Login.js (co-wrote with Steph)
    - Profile.js (co-wrote with Steph)
    - Settings.js (co-wrote with Steph)
    - Signup.js (co-wrote with Steph)
    - Use.js (co-wrote with Steph and Jonathan)
  - client/src/services/
    - RequestTemplates.js (co-wrote with Tess)
    - RequestUsers.js (co-wrote with Tess)
  - client/src/styles/
    - AdminTable.css
    - CommentCard.css
    - Settings.css
    - App.css (co-wrote with Steph)
    - Contacts.css (co-wrote with Steph)
    - Login.css (co-wrote with Steph)
    - LoginForm.css (co-wrote with Steph)
    - OptionsDropdownToggle.css (co-wrote with Steph)
    - Search.css (co-wrote with Steph)
    - Signup.css (co-wrote with Steph)
    - TemplateCard.css (co-wrote with Steph)
    - TemplateUse.css (co-wrote with Steph)
  - client/src/utils/
    - OnMount.js
    - Validation.js (co-wrote with Steph and Jonathan)
  - routes/
    - moderation.js
      - GET /api/moderation/admins
    - user.js
      - GET /api/users/
      - POST /api/users/auth
  - Main Tasks
    - Frontend UI / functionality (with Steph)
    - Frontend-to-backend routing (debugging with Tess)
