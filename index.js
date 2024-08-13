//Main application File.
import express from "express";
import bodyParser from "body-parser";
import _ from "lodash";
import axois from "axios";

const app = express();
const PORT = 3000;

//global variable.
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    body: "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
];
let postId = 1;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(bodyParser.json());

//1: rendering the home page.
app.get("/", (req, res) => {
  //6.collecting the posts from post method & rendering it to the home page.
  res.render("home.ejs", { posts: posts });
});
//4.make a compose page where user can post blog & render it.
app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

//5.User will post blogs using post.
app.post("/compose", (req, res) => {
  const newId = (postId += 1);
  //using req.body to collect the data user typed through the input name.
  const post = {
    //here req.body.postTile should be the same as the name of the input name.
    id: newId,
    title: req.body.postTitle,
    date: new Date(),
    body: req.body.postBody,
    author: req.body.postAuthor,
  };
  console.log(post);
  postId = newId;
  //pushing the user inputed blog into the global posts array.
  posts.push(post);
  //redirecting to the home page.
  res.redirect("/");
});

//7.Now when the user want to enter into a single post then we can use the post title to nevigate that.
app.get("/posts/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts.forEach((post) => {
    if (post.id === id) {
      res.render("post.ejs", {
        id: post.id,
        title: post.title,
        content: post.body,
        author: post.author,
      });
    }
  });
  //it will convert any post name parameter to lowercase string.
  /* const requestedTitle = _.lowerCase(req.params.postName); */
  //here it will loop through the posts array & converting the title to lowercase string.
  /* posts.forEach((post) => {
    const storedTitle = _.lowerCase(post.title); */
  //here we are finding if the user requested post is available or not.
  /* if (requestedTitle === storedTitle) {
      res.render("post.ejs", { title: post.title, content: post.body });
    }
  }); */
});

app.get("/posts/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  posts.forEach((post) => {
    if (post.id === id) {
      res.render("edit.ejs", {
        id: post.id,
        title: post.title,
        content: post.body,
        author: post.author,
      });
    }
  });
});

app.post("/posts/edit/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const existingPost = posts.find((post) => post.id === id);
  if (!existingPost) {
    res.status(404).json({ message: "Post not found!" });
  }
  const editedPost = {
    id: id,
    title: req.body.postTitle || existingPost.title,
    body: req.body.postBody || existingPost.content,
    author: req.body.author || existingPost.author,
    date: new Date(),
  };
  const searchIndex = posts.findIndex((post) => post.id === id);

  posts[searchIndex] = editedPost;
  res.render("home.ejs", { posts: posts });
});

app.get("/posts/delete/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const searchIndex = posts.findIndex((post) => post.id === id);
  if (searchIndex > -1) {
    posts.splice(searchIndex, 1);
    res.render("home.ejs", { posts: posts });
  } else {
    res
      .status(404)
      .json({ error: `Post with id: ${id} not found. No posts were deleted.` });
  }
});

app.listen(PORT, () => {
  console.log(`Listening to post ${PORT}`);
});
