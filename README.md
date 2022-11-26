# Handlebars

To render dynamic data from db to html page

- Firstlly we connect to the db.
- Define the functions which execute different queries when we pass queries from browser/postman

## Setting up handlebars

- Create a folder `views` inside it create 2 folder `layouts` and `partials`.
- Inside the layouts we save the main html file in handlebars format. since this is the base layout on top of which we'll add the body data from other handlebar template templates.
- So depending on the body data we render different views on top of the `main.handlebars` file.

- Inside partials we register the partials, since in all the page there is a navbar in the body data, and since the content inside in navbar doesnt change here we put the `navbar.handlebars` and similar files like footer in the partils directory.

- The body data and all is defined in separate files which is stored directly under the views folder.
- In the routes we'll define which body data should be rendered along withe the `main.handlebars`

<!-- hbs path test -->

### Create a basic server using http to test the route to hbs

```
registerPartials(); - This fn gets called before the server starts and this sets the partials

const server = http.createServer((req, res) => {
  let link = url.parse(req.url, true);
  let path = link.pathname;

  switch (path) {
    case "/":
      res.end(renderTemplate("main")); - once executed calls the renderTemplate fn and
      break;
  }
});
```

This below code will register all the partials (navbar in this case), once registered, in the main.hbs in layouts we can use {{>navbar}} statement and this will fetch the navbar from the partials and add to the main hbs template.

```
function registerPartials() {
  let filePath = path.join(__dirname, "views", "partials", "navbar.handlebars");
  console.log(filePath);  /Users/emmanuel/Documents/MERN/handlebars/views/partials/navbar.handlebars

  let templateText = fs.readFileSync(filePath, "utf-8");
  Handlebars.registerPartial("navbar", templateText);
}
```

This code will render the body data to the main.hbs file, we pass in 2 args(here 1 since we aren't passing data) name (of the hbs body) and data (in object format)

```
function renderTemplate(name, data*) {
  let filePath = path.join(__dirname, "views", "layouts", name + ".handlebars");
  console.log(filePath);  /Users/emmanuel/Documents/MERN/handlebars/views/layouts/main.handlebars

  let templateText = fs.readFileSync(filePath, "utf-8");
  let template = Handlebars.compile(templateText);
  return template();

  return template(data)*
}
```

Filepaths

`import path from "path";`

`__dirname` gives us the path of the project /Users/emmanuel/Documents/MERN/handlebars
To this we join the file path which is in view > layouts folder and then append the extension to the file name

Then we compile this template using hbs and render it.
