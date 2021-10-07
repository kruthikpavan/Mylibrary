const express = require("express");
const router = express.Router();
const Author = require("../models/author");


//All Author route
router.get("/", async (req, res) => {
    //  await Author.deleteMany({})
    let searchOptions= {}
    if(req.query.name!=null &&req.query.name!=''){
        searchOptions.name= new RegExp(req.query.name.trim(),'i')
        

    }
    try{
       
       const authors= await Author.find(searchOptions)
       res.render("authors/index",{authors:authors,
        searchOptions: req.query

    });
       
    }
    catch{
        res.redirect("/")
    }




});

//new author route
router.get("/new", (req, res) => {
  res.render("authors/new", { author: new Author() });
});

//create author route
router.post("/", async (req, res) => {
  const author = new Author({
    name: req.body.name,
  });

  try {
    const newAuthor = await author.save();
    res.redirect("/authors");
  } catch {
    res.render("authors/new", {
      author: author,
      errorMessage: "error while creating author",
    });
  }
});

module.exports = router;
