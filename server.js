const uuid = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");

const PORT = process.env.PORT || 3001;

//expresss app
const app = express();

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

//return index.html file = GET *
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/index.html"))
);

//read the db.json file, show all saved notes as JSON = GET
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "./public/notes.html"))
);

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Darn!");
    } else {
      console.log("Yay!");
      let savedNote = JSON.parse(data);
      res.json(savedNote);
    }
  });
  //   res.json(db);
});

app.post("api/notes", (req, res) => {
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid.v1(),
    };
    let savedNote = [];
    fs.readFile("./db/db.json", "utf-8", (err, data) => {
      if (err) {
      } else {
        savedNote = JSON.parse(data);
        savedNote.push(newNote);
        fs.writeFileSync("./db/db.json", JSON.stringify(savedNote), "utf-8");
      }
    });

    res.json(savedNote);

    res.status(201).json(response);
  } else {
    res.status(500).json("Error in adding new note");
  }
});

app.listen(PORT, () =>
  console.log(`App listening on http://localhost:${PORT} 🚀`)
);

// //Import custom middleware
// app.use(clog);

// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use("/api", api);

// app.use(express.static("public"));

// app.get("/", (req, res) =>
//   res.sendFile(path.join(__dirname, "/public/index.html"))
// );
