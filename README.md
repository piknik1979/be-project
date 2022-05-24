# Piknik News API

This project is the back-end component to a news website that allows posting and deleting comments, voting for favourite comments and articles, and filtering articles by topic.

## CREATING A LOCAL COPY OF THE PROJECT

-- PLEASE NOTE THIS PROJECT IS STILL A WORK IN PROGRESS --

### INSTALLATION

## 1. CLONE THE REPO

```
git clone https://github.com/piknik1979/be-project
```

### 2. INSTALL ALL REQUIRED NPM DEPENDENCIES

```
$ npm install
```

### 3. RUNNING THE PROJECT LOCALLY AND ACCESS TO THE DATABASE

In order to run this project locally (with a link to Database), please make two -env files in the root folder:

```
.env.development
```

where this file will contain text:

```
PGDATABASE=nc_news
```

and a second file:

```
.env.test
```

with the text:

```
PGDATABASE=nc_news_test
```

### SEEDING THE LOCAL DATABASE

```
npm run setup-dbs
npm run seed
```

### RUNNING THE TESTS

```
$ npm t

```

|or|

```
$ npm test

```

### USAGE

Start the server listening with:

```
npm start

```

###

This project was made using:

## JavaScript, CSS, HTML, React, Github, Git

## PostgreSQL, Heroku, Node Js, Jest, Npm,

on the

## Linux Ubuntu System.
