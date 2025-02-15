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
  const book = books[req.params.isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Not Found"});
  }
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  let target_books = [];
  for (key in books) {
    let book = books[key];
    if (req.params.author == book["author"]) {
      target_books.push(book);
    }
  }
  if (target_books.length > 0) {
    return res.status(200).json(target_books);
  } else {
    return res.status(200).json({message: `No book of author ${req.params.author} found.`})
  }
  
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  let target_books = [];
  for (key in books) {
    let book = books[key];
    if (req.params.title == book["title"]) {
      target_books.push(book);
    }
  }
  if (target_books.length > 0) {
    return res.status(200).json(target_books);
  } else {
    return res.status(200).json({message: `No book titled ${req.params.title} found.`})
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
