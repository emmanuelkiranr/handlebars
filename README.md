# Handlebars

To render dynamic data from db to html page

- Firstlly we connect to the db.
- Define the functions which execute different queries when we pass queries from browser/postman

## Setting up handlebars

- Create a folder `views` inside it create a folder `partials`.

- Inside partials we register the partials, since in all the page there is a navbar, head and footer, and since the content inside these doesnt change, so we put them in the partials folder. `navbar.handlebars`. and we call these files in the html pages rendered as output.

- We create different pages for displaying the body content, ie one page for displaying the db (index.handlebars), another for adding to the db(addData.handlebars). And we send the appropriate page as response from the route.

- This will render a complete html page along with partials with the data output.

### Create a basic server using http to test the route to hbs

```
registerPartials(); - This fn gets called before the server starts and sets the partials

const server = http.createServer((req, res) => {
  let link = url.parse(req.url, true);
  let path = link.pathname;

  if (path == "/" && req.method == "GET") {
    res.end(renderTemplate("index", {data: "Home Page"})); - This will call the renderTemplate fn and will render the page passed as parameter along with the data passed as an object
  }
});
```

This below code will register all the partials (navbar in this case), once registered, in the index.hbs in views we can use {{>navbar}} statement and this will fetch the navbar from the partials and add to the index hbs template.

```
function registerPartials() {
  let filePath = path.join(__dirname, "views", "partials", "navbar.handlebars");
  console.log(filePath);  /Users/emmanuel/Documents/MERN/handlebars/views/partials/navbar.handlebars

  let templateText = fs.readFileSync(filePath, "utf-8");
  Handlebars.registerPartial("navbar", templateText);
}
```

This code will render the html page along with the data, we pass in 2 args, name (of the hbs page) and data (in object format)

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

`__dirname` gives us the absolute path of the project /Users/emmanuel/Documents/MERN/handlebars
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
else if (path == "/users" && req.method == "GET") {
  db.getAll((err, result) => {
    console.log(result);

    let content = { data: result };
    - we have to pass the data in object format since in `getData handlebars` we access values using this.
    console.log(content);

    res.end(renderTemplate("getData", content));
});

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

We are storing the result into `{ data: result }` format cause now we have a variable (data here) which can be used to iterate each objects in the array of objects from the getData.handlebars

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
