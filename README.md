# Project Instructions

This project was build with Webpack, Sass, Service workers, an external API, express and node.js.

The goal of this project was to have practice with:

- Setting up Webpack
- Sass styles
- Webpack Loaders and Plugins
- Creating layouts and page design
- Service workers
- Using APIs and creating requests to external urls

The Aylien API used was a Natural Language Processing. NLPs leverage machine learning and deep learning create a program that can interpret natural human speech. Natural language processing (NLP) is a subfield of computer science, information engineering, and artificial intelligence concerned with the interactions between computers and human (natural) languages, in particular how to program computers to
process and analyze large amounts of natural language data.

## Getting started

Clone or fork the project, you will still need to install everything:

`cd` into your new folder and run:

- `npm install`

## Setting up the API

You need credencial of the Aylien API to validade your requests.
https://developer.aylien.com/signup

### Step 4: Environment Variables

Next we need to declare our API keys, which will look something like this:

```
// set aylien API credentias
var textapi = new aylien({
  application_id: "your-api-id",
  application_key: "your-key"
});
```

Use NPM to run the project in Dev mode with the command npm run build-dev, or in production mode with npm build-prod.
