const express = require('express')
const router = express.Router()
const Book = require('../models/book')
const Author = require('../models/author')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']
// const upload = multer({
//   dest: uploadPath,
  
//   fileFilter: (req, file, callback) => {
//     callback(null, imageMimeTypes.includes(file.mimetype))
//   }
// })

//all books route
router.get("/", async (req, res) => {
  // await Book.deleteMany({})

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
  router.post('/', async (req, res) => {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      publishDate: new Date(req.body.publishDate),
      pageCount: req.body.pageCount,
      description: req.body.description
    })

    saveCover(book,req.body.cover)
  
    try {
      const newBook = await book.save()
      // res.redirect(`books/${newBook.id}`)
      res.redirect(`books`)
    } catch(err) {
      // book.coverImageName!=null?removeBookCover(book.coverImageName): null
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
  

function saveCover(book,coverEncoded){
  if(coverEncoded===null) return
  const cover= JSON.parse(coverEncoded)
  if(cover!=null && imageMimeTypes.includes(cover.type)){
    book.coverImage= new Buffer.from(cover.data,'base64')
    book.coverImageType= cover.type

}
}


//remove book cover
// function removeBookCover(fileName){
//   fs.unlink(path.join(uploadPath,fileName),err=>{
//     if(err)console.error(err)
//   })

// }


  module.exports = router