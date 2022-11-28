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

## Add a new entry to the db

We an use postman with post method to send a request to the create url and gett the query from the url and passing it (object) to the sql query fns.

Here we'll create a form(in place of postman), to add person details and add it to the db.

- Firstly create a new hbs file `addData.hbs`.
- Now create 2 routes for this page
  - one for the get and another for post, once we do a req to the page to add new user it is GET method and once the form page is rendered and we input and submit the details this is a POST method, ie on clicking the submit button the data is sent to the server via the url(same url with the query appended to it after ?, since this is a post method the query is hidden), so this is the second request.

```
<form method="post">
                    <div>
                        <label for="p_id">p_id</label>
                        <input type="text" name="p_id" id="p_id" class="form-control" placeholder="Enter p_id">
                    </div>
...
                    <div>
                        <label for="p_country">p_country</label>
                        <input type="name" name="p_country" id="p_country" class="form-control"
                            placeholder="Enter p_country">
                    </div>

                    {{#if result}}
                    {{#if result.success}}
                    <div class="alert alert-success">
                        Data saved successfully.
                    </div>

                    {{else}}
                    <div class="alert alert-danger">
                        Unable to Save Data.
                    </div>
                    {{/if}}

                    {{/if}}

                    <div class="d-grid mt-3">
                        <button class="btn btn-primary">Save</button>
                    </div>
                </form>
```

- We render the form page without any data

```
else if (path == "/users/add" && req.method == "GET") {
    let template = renderTemplate("addData", {});
    res.end(template);
```

This is similar to the way we send req from postman.

```
else if (path == "/users/add" && req.method == "POST") {
    console.log("Post reached");

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
  }
```

- We get the url in the formData
- We parse it to get the query which is in object format
- We pass the query to the sql query executing fns.
- Then we again render the template, this time with a data object
