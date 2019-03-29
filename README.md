# Setup
Make sure you have npm, then run
```
npm install
```
to install all dependencies

# Configuration
Make a copy of `.env.sample` and rename it to `.env`. Open `.env` and fill in your postgres username and password. It should look something like this (some of the entries are already filled out because they should be the same for everyone)
```bash
DB_USER=
DB_HOST=localhost
DB_DATABASE=shareleh
DB_PASSWORD=
DB_PORT=5432
```
Later on you can reference these variables in your code by calling `process.env.<variable_name>`.

# Running the website
To start the server, run
```
npm start
```
and visit `0.0.0.0:3000`
