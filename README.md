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

### Get db content in a table

`person.js`

```
function getAll(callback) {
  let sql = `select * from person`;
  db(sql, [], callback);
}
```

routing in `index.js`

```
case "/users":
  db((err, result) => {
    let content = { data: result };
    - we have to pass the data in object format since in `getData handlebars` we access values using this.

    res.end(renderTemplate("getData", content));
  });
  break;

// renderTemplate fn
let filePath = path.join(__dirname, "views", name + ".handlebars");
console.log(filePath);
let templateText = fs.readFileSync(filePath, "utf-8");
let template = Handlebars.compile(templateText);
return template(data);
```

`result`

```
[
  {
    p_id: 1,
    p_name: 'ekr',
    p_age: 22,
    p_email: 'ekr@mail',
    p_country: 'IN'
  },
  {
    p_id: 2,
    p_name: 'gjr',
    p_age: 14,
    p_email: 'gjr@mail',
    p_country: 'IN'
  },
]
```

`{ data: result }`

```
{
  data: [
    {
      p_id: 1,
      p_name: 'ekr',
      p_age: 22,
      p_email: 'ekr@mail',
      p_country: 'IN'
    },
    {
      p_id: 2,
      p_name: 'gjr',
      p_age: 14,
      p_email: 'gjr@mail',
      p_country: 'IN'
    },
  ]
}
```

We are storing the result into `{ data: result }` this format cause now we have a variable (data here) which can be used to iterate each objects in the array of objects from the getData.handlebars

`getData.handlebars`

```
<h1 class="text-center"><u>Customers</u></h1>

<div class="container">
    <table class="table">
        <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>AGE</th>
            <th>EMAIL</th>
            <th>COUNTRY</th>
        </tr>
        {{#each data}} - iterate the data array of objects
        <tr>
            <td>{{this.p_id}}</td> - access each elt using each iteration
            <td>{{this.p_name}}</td>
            <td>{{this.p_age}}</td>
            <td>{{this.p_email}}</td>
            <td>{{this.p_country}}</td>
        </tr>
        {{/each}}
    </table>
</div>
```
