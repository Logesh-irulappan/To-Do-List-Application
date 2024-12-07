const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");

const app = express();
const PORT = 3000;

const db = new pg.Client({ 
    user: "postgres",
    host: "localhost",
    database: "Premalist",
    password: "Logesh@0414",
    port: "5432",
})
db.connect();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost${PORT}`);
});

// app content
async function getAllData() {
    let result = await db.query("SELECT * FROM items");
    return result.rows;
}

app.get("/", async (req ,res) => {  
    let listItems = await getAllData();
    res.render("index.ejs", { listTitle: "Today List", listItems: listItems } );
});

app.post("/add", async (req, res) => {
    let newItem = req.body["newItem"];

    await db.query("INSERT INTO items (title) VALUES ($1)", [newItem]);
    res.redirect("/");
});

app.post("/delete", async (req, res) => {
    let id = req.body["deleteItemId"];
    await db.query("DELETE FROM items WHERE id = ($1)", [id]);
    res.redirect("/");
});

app.post("/edit", async (req, res) => {
    let id = req.body["updatedItemId"];
    let updatedTitle = req.body["updatedItemTitle"];
    await db.query("UPDATE items SET title = ($1) WHERE id = ($2)", [updatedTitle, id]);
    res.redirect("/");
});