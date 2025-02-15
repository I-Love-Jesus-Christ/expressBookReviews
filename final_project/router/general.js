const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {

  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  if (book != undefined) {
    return res.status(200).json(book);
  } else {
    return res.status(200).json({message: `No book with ISBN ${ISBN} found.`});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let target_books = [];
  const author = req.params.author;
  for (key in books) {
    let book = books[key];
    if (author == book["author"]) {
      target_books.push(book);
    }
  }
  if (target_books.length > 0) {
    return res.status(200).json(target_books);
  } else {
    return res.status(200).json({message: `No book of author ${author} found.`})
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let target_books = [];
  const title = req.params.title;
  for (key in books) {
    let book = books[key];
    if (title == book["title"]) {
      target_books.push(book);
    }
  }
  if (target_books.length > 0) {
    return res.status(200).json(target_books);
  } else {
    return res.status(200).json({message: `No book titled ${title} found.`})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const ISBN = req.params.isbn;
  let target_book = books[ISBN];
  let reviews;
  if (target_book != undefined) {
    reviews = target_book.reviews;
    if (Object.keys(reviews).length > 0) {
      return res.status(200).json(reviews);
    } else {
      return res.status(200).json({message: `No reviews for the book with the ISBN ${ISBN} have been written yet.`})
    }
  } else {
    return res.status(200).json({message: `No book with the ISBN ${ISBN} found.`})
  }
  
});

module.exports.general = public_users;
