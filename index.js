import express from "express";
import bodyParser from "body-parser";

// A function to truncate long posts to 250 characters
function truncatePost(str, maxLength = 250) { 
    if (str.length > maxLength) { 
        return str.trim().slice(0, maxLength - 3) + '...'; 
    }
    return str.trim(); 
}

// A constructor for blog posts
function Post(name, content, author) {
    this.name = name;
    this.content = content;
    this.truncatedPost = truncatePost(content);
    this.author = author;
    this.date = function getDate() {
        let date = new Date();
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        return month+"/"+day+"/"+year;
    }; 
} 

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.use("/public", express.static("static"));

var posts = [
    new Post("What are the side effects of Creatine?", "Creatine is a chemical found naturally in the body. It's also in red meat and seafood. It is often used to improve exercise performance and muscle mass. Creatine is involved in making energy for muscles. About 95% of it is found in skeletal muscle. The majority of sports supplements in the US contain creatine. People who have lower creatine levels when they start taking creatine seem to get more benefit than people who start with higher levels.", "Lavet"),
    new Post("Cardio before or after workout?", "If, like most people, you don’t have hours to hang out at the gym, you probably want to make your workouts as efficient as possible. Even if you only have 30 minutes, using your time wisely can help you get results, especially with a routine focused on gradual progression. Maximizing your time often means combining cardiovascular exercise and strength training in the same session. But should you do cardio before or after weights? There are some important factors that can help you decide.", "Kristi")
];


// Root Route. All the posts would be displayed in this page 
app.get("/", (req, res) => {
    res.render("index.ejs", {posts: posts});
});


// Article Route. The full post would be displayed here for the user to read
app.get("/post/:name", (req, res) => {
    const postName = req.params.name;
    const post = posts.find(p => p.name === postName);

    if (!post) {
        res.status(404).send("Post not found");
        return;
    }

    res.render("post.ejs", { post: post });
});

// Publishing a new post Route. The form to add a post is rendered from here.
app.get("/writepost", (req, res) => {
    res.render("writepost.ejs");
});

// Posting a new post Route.
app.post("/publishpost", (req, res) => {
    var counter = 0;
    var error = false;
    posts.forEach(post => {
        if (req.body.title == post.name) {
            res.send("<h1>Post with the same title already exists</h1>");
            error = true;
            return;
        }
        counter++;
    });

    if (counter === posts.length && error === false) {
        var newPost = new Post(req.body.title, req.body.content, req.body.author);

        if (counter === posts.length) {
            posts.push(newPost);
        }

        res.render("index.ejs", {posts: posts});
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});