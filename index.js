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
  let query = link.query;

  if (path == "/" && req.method == "GET") {
    res.end(renderTemplate("index", { data: "Welcome To SQL DataBase" }));
  } else if (path == "/users" && req.method == "GET") {
    db.getAll((err, result) => {
      console.log(result);
      let content = { data: result };
      console.log(content);
      res.end(renderTemplate("getData", content));
    });
  } else if (path == "/users/add" && req.method == "GET") {
    let template = renderTemplate("addData", {});
    res.end(template);
  } else if (path == "/users/add" && req.method == "POST") {
    console.log("Post reached");
    // instead of postman we send req directly from a form in this url
    let formData = "";
    req.on("data", (data) => {
      formData += data.toString();
    });
    console.log(formData);
    req.on("end", () => {
      let query = qs.parse(formData);
      db.addOne(query, (err, result) => {
        //   var content = { data: result };
        let content = {
          result: {
            success: "true",
            error: [],
          },
        };
        if (err) {
          console.log(err);
          content.result.success = false;
        }
        res.end(renderTemplate("addData", content));
      });
    });
  } else if (path == "/users/get" && req.method == "GET") {
    console.log("request reached");
    let id = query.p_id;
    console.log(id);
    db.getOne(id, (err, result) => {
      let content = { data: result };
      res.end(renderTemplate("getOne", content));
    });
  }
});

function renderTemplate(name, data) {
  console.log(__dirname);
  let filePath = path.join(__dirname, "views", name + ".handlebars");
  console.log(filePath);
  let templateText = fs.readFileSync(filePath, "utf-8");
  let template = Handlebars.compile(templateText);
  return template(data);
}

function registerPartials() {
  let filePathNav = path.join(
    __dirname,
    "views",
    "partials",
    "navbar.handlebars"
  );
  let filePathHead = path.join(
    __dirname,
    "views",
    "partials",
    "head.handlebars"
  );

  // console.log(filePath);
  let templateText = fs.readFileSync(filePathNav, "utf-8");
  let templateHead = fs.readFileSync(filePathHead, "utf-8");

  Handlebars.registerPartial("navbar", templateText);
  Handlebars.registerPartial("head", templateHead);
}

server.listen(3000);
