import http from "http";
import url from "url";
import Handlebars from "handlebars";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

registerPartials();
const server = http.createServer((req, res) => {
  let link = url.parse(req.url, true);
  let path = link.pathname;

  switch (path) {
    case "/":
      res.end(renderTemplate("main"));
      break;
  }
});

function renderTemplate(name) {
  console.log(__dirname);
  let filePath = path.join(__dirname, "views", "layouts", name + ".handlebars");
  console.log(filePath);
  let templateText = fs.readFileSync(filePath, "utf-8");
  let template = Handlebars.compile(templateText);
  return template();
}

function registerPartials() {
  let filePath = path.join(__dirname, "views", "partials", "navbar.handlebars");
  console.log(filePath);
  let templateText = fs.readFileSync(filePath, "utf-8");
  Handlebars.registerPartial("navbar", templateText);
}

server.listen(3000);
