const uuid = require("uuid");
const express = require("express");
const fs = require("fs");
const path = require("path");
const db = require("./db/db.json");
var bodyParser = require("body-parser");

const PORT = process.env.PORT || 3001;

//expresss app
const app = express();
// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

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

app.get("/api/notes/", jsonParser, function (req, res) {
  console.log("LOAD LIST");
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log("Darn!");
    } else {
      console.log("1 Yay!");
      let savedNote = JSON.parse(data);
      res.json(savedNote);
    }
  });
});

app.delete("/api/notes/:id", function (req, res) {
  const noteId = req.url.slice(11);

  let savedNote = [];
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
    } else {
      savedNote = JSON.parse(data);
      console.log("my saved notes" + savedNote);
      // const note = savedNote.find((obj) => obj.id === noteId);
      // const findIndexOfNote = savedNote.findIndex(note);
      const index = savedNote.findIndex((x) => x.id === noteId);

      console.log("THIS IS THE INDEX WE WANT TO DELETE: " + index);
      //console.log("NOTE WE WANT TO DELETE" + note.id);
      savedNote.splice(index, 1);
      console.log(savedNote);
      fs.writeFileSync("./db/db.json", JSON.stringify(savedNote), "utf-8");
    }
  });
  res.json(savedNote);
  console.log(noteId);
});

//   jsonParser,

//     console.log("DELETE CLICKED");
//     let id = new URLSearchParams(url/id);
//     console.log(id);
//     fs.readFile("./db/db.json", "utf-8", (err, data) => {
//       if (err) {
//         console.log("Darn!");
//       } else {
//         console.log("1 Yay!");
//         let savedNote = JSON.parse(data.id);
//         savedNote.pop("9726d140-2d5f-11ed-9fbc-0974d0fa06bc");
//         res.json(savedNote);
//       }
//     });
//   }
// );

app.post("/api/notes", jsonParser, function (req, res) {
  console.log("POST HIT", req.body);
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

    res.status(201).json("Success");
  } else {
    res.status(500).json("Error in adding new note");
  }
});

app.listen(PORT, () =>
  console.log(`App listening on http://localhost:${PORT} 🚀`)
);
