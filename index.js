//Main application File.
import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";

const app = express();
const PORT = 3000;

//global variable.
let posts = [];

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

//1: rendering the home page.
app.get("/", (req, res) => {
  //6.collecting the posts from post method & rendering it to the home page.
  res.render("home.ejs", { posts: posts });
});

//2.about page
/* app.get("/about", (req, res) => {
  res.render("about.ejs");
}); */

//3.contact page
/* app.get("/contact", (req, res) => {
  res.render("contact.ejs");
}); */

//4.make a compose page where user can post blog & render it.
app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

//7.Now when the user want to enter into a single post then we can use the post title to nevigate that.
app.get("/posts/:postName", (req, res) => {
  //it will convert any post name parameter to lowercase string.
  const requestedTitle = _.lowerCase(req.params.postName);
  //here it will loop through the posts array & converting the title to lowercase string.
  posts.forEach((post) => {
    const storedTitle = _.lowerCase(post.title);
    //here we are finding if the user requested post is available or not.
    if (requestedTitle === storedTitle) {
      res.render("post.ejs", { title: post.title, content: post.body });
    }
  });
});

app.get("/posts/edit/:postName", (req, res) => {
  const requestedTitle = _.lowerCase(req.params.postName);
  posts.forEach((post) => {
    const storedTitle = _.lowerCase(post.title);
    if (requestedTitle === storedTitle) {
      res.render("edit.ejs", { title: post.title, content: post.body });
    }
  });
});

//5.User will post blogs using post.
app.post("/compose", (req, res) => {
  //using req.body to collect the data user typed through the input name.
  const post = {
    title: req.body.postTitle, //here req.body.postTile should be the same as the name of the input name.
    body: req.body.postBody,
  };
  //pushing the user inputed blog into the global posts array.
  posts.push(post);
  //redirecting to the home page.
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`Listening to post ${PORT}`);
});
