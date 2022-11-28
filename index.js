import http from "http";
import url from "url";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import qs from "querystring";
import { fileURLToPath } from "url";
import { dirname } from "path";
import db from "./models/person.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

registerPartials();
const server = http.createServer((req, res) => {
  let link = url.parse(req.url, true);
  let path = link.pathname;

  if (path == "/" && req.method == "GET") {
    res.end(renderTemplate("index", { data: "Welcome To SQL DataBase" }));
  } else if (path == "/users" && req.method == "GET") {
    db.getAll((err, result) => {
      console.log(result);
      let content = { data: result };
      console.log(content);
      res.end(renderTemplate("getData", content));
    });
  }
});

function renderTemplate(name, data) {
  console.log(__dirname);
  //   let filePath = path.join(__dirname, "views", "layouts", name + ".handlebars"); // for testing handlebars only since only main file is in layouts
  let filePath = path.join(__dirname, "views", name + ".handlebars");
  console.log(filePath);
  let templateText = fs.readFileSync(filePath, "utf-8");
  let template = Handlebars.compile(templateText);
  return template(data);
}

function registerPartials() {
  let filePath = path.join(__dirname, "views", "partials", "navbar.handlebars");
  console.log(filePath);
  let templateText = fs.readFileSync(filePath, "utf-8");
  Handlebars.registerPartial("navbar", templateText);
}

server.listen(3000);
