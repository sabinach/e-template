# Workflow for making a new feature
- pull
```
git pull
```

- make a new feature branch and switch to it
```
git checkout -b branchname
```

- set push upstream branch
```
git push --set-upstream origin branchname
```

- make changes

- add and commit changes
```
git add *
git commit -m "i made some changes"
```

- optionally squash your commits into one commit
```
git rebase -i
```

- before pushing (or if you want to pull in changes), do this and then test your changes again
```
git pull --rebase origin master
```

- push your changes to remote branch
```
git push
```

- go to [repo](https://github.com/6170-fa20/final-project-team-not-fritter)
- go to Pull Requests
- click New pull request
- choose base: main and compare: branchname
- add a comment and click create pull request
- ask someone else to review and merge it

# Rebasing and Merging:
```
git checkout main
git pull --rebase
git checkout <branch>
git rebase main
git push origin --force-with-lease HEAD:<branch>
git checkout main
git merge --no-ff <branch> -m "merged <branch>"
git push origin main
```
If you run into issues with rebasing:
```
git add .
git rebase --continue
```
Rinse and repeat until you have resolved merge conflicts, then push again:
```
git push origin --force-with-lease HEAD:<branch>
```

# How to run and test changes

- if you only want to look at the front end, you can try:
```
cd client
npm install
npm run start
```

- if you want to test front and back end together locally, open two terminal windows one in client/ folder and one in root directory.
- Run the following in the root:
```
npm install
npm run demon
```
- See above for how to run the front end.
- or you can try just using `nodemon` instead of `npx nodemon`

- if you want to run it like heroku does (production build, will be slow to build)
```
npm install; cd client; npm install; npm run build; cd ..; npm start
```
- you can then access the website at [localhost:8080](localhost:8080)

# How to get heroku environment config vars for the database

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
optionally do a `rm .env`
