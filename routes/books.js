const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const fs = require('fs')
const Book = require('../models/book')
const Author = require('../models/author')
const uploadPath = path.join('public', Book.coverImageBasePath)
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
const upload = multer({
  dest: uploadPath,
  
  fileFilter: (req, file, callback) => {
    callback(null, imageMimeTypes.includes(file.mimetype))
  }
})

//all books route
router.get("/", async (req, res) => {
  let query= Book.find()
  if(req.query.title!=null &&req.query.title!=''){
    query= query.regex('title',new RegExp(req.query.title.trim(),'i'))
  
}
  if(req.query.publishedAfter!=null &&req.query.publishedAfter!=''){
    query= query.gte('publishDate',req.query.publishedAfter)
  
}
  if(req.query.publishedBefore!=null &&req.query.publishedBefore!=''){
    query= query.lte('publishDate',req.query.publishedBefore)
  
}
  
  
  try{
    const books= await query.exec()
    console.log(books);
    res.render("books/index",{
      books:books,
      searchOptions:req.query
    })
  }
  catch(err){
    console.log(err);
    res.redirect('/')
  }
});
router.get('/new', async (req, res) => {
    renderNewPage(res, new Book())
  })
  
  // Create Book Route
  router.post('/', upload.single('cover'), async (req, res) => {
    const fileName = req.file != null ? req.file.filename : null
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      coverImageName: fileName,
      description: req.body.description
    })
  
    try {
      const newBook = await book.save()
      // res.redirect(`books/${newBook.id}`)
      res.redirect(`books`)
    } catch(err) {
      book.coverImageName!=null?removeBookCover(book.coverImageName): null
      renderNewPage(res, book, true)
    }
  })
  
// render the new page
  async function renderNewPage(res, book, hasError = false) {
    try {
      const authors = await Author.find({})
      const params = {
        authors: authors,
        book: book
      }
      if (hasError) params.errorMessage = 'Error Creating Book'
      res.render('books/new', params)
    } catch {
      res.redirect('/books')
    }
  }
  
//remove book cover
function removeBookCover(fileName){
  fs.unlink(path.join(uploadPath,fileName),err=>{
    if(err)console.error(err)
  })

}


  module.exports = router