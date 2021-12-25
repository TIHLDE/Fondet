import express from "express";
import * as Functions from "./index";

// eslint-disable-next-line
const yamlenv = require("yamlenv");
yamlenv.config({ path: ".env.yaml" });

const app = express();

const port = 8080;

console.log("Loading functions:");

Object.entries(Functions).forEach(([name, func]) => {
  app.get(`/${name}`, func);
  app.post(`/${name}`, func);
  console.log(`/${name}`);
});

app.listen(port, () => {
  console.log(`Functions listening at http://localhost:${port}`);
});
