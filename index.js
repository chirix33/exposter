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
    new Post("chirix", "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla id nibh ipsum. Sed varius sapien sit amet pretium viverra. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. Integer vitae scelerisque purus. Donec laoreet ligula sed mi mollis, id blandit dolor tempus. Vivamus pretium ligula sodales, pretium dolor eget, malesuada lorem. Proin non mauris et tellus congue lobortis in ut turpis.Nulla arcu libero, porttitor et nibh eget, dignissim mattis quam. Proin sed faucibus elit. Duis non turpis sed nulla gravida vestibulum id sed metus. Fusce placerat accumsan fermentum. Praesent dapibus feugiat leo id pharetra. Sed neque ex, aliquam et sapien vulputate, pharetra blandit diam. Quisque ac eros sollicitudin, rutrum sem id, ultrices sem. Sed finibus scelerisque libero ut rutrum. In id mi elit. Cras et augue nec mi rhoncus tincidunt posuere eu velit. Sed at dui ut eros vehicula finibus. In blandit neque non massa semper, non viverra nibh pretium. Nulla at lorem vel dui consequat lacinia.In felis massa, maximus ut sodales nec, tincidunt eget lorem. Pelle", "James Bond"),
    new Post("ashraf", "Another post from Ashraf", "Andrew Tate")
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