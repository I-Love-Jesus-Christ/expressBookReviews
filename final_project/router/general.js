const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


// Check if a user with the given username already exists
const doesExist = (username) => {
  // Filter the users array for any user with the same username
  let userswithsamename = users.filter((user) => {
      return user.username === username;
  });
  // Return true if any user with the same username is found, otherwise false
  if (userswithsamename.length > 0) {
      return true;
  } else {
      return false;
  }
};

public_users.post("/register", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  // Check if both username and password are provided
  if (username && password) {
      // Check if the user does not already exist
      if (!doesExist(username)) {
          // Add the new user to the users array
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  // Return error if username or password is missing
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
// Task 10
public_users.get('/',function (req, res) {
  const the_promise = new Promise(function (resolve, reject) {
    if (Object.keys(books).length > 0) {
      resolve(books);
    } else {
      reject("There are no books available in the shop.");
    }
  });

  the_promise.then(
    function(the_books) {
      return res.status(200).json(the_books);
    }, 
    function(error_message) {
      return res.status(404).json(error_message);
    }
  );
});


// Task 11
async function get_book_by_isbn(ISBN) {
  const book = books[ISBN];
  if (book != undefined) {
    return book;
  } else {
    throw {message: `No book with ISBN ${ISBN} found.`};
  } 
}

// Get book details based on ISBN
// Task 11
public_users.get('/isbn/:isbn', async function (req, res) {
  const ISBN = req.params.isbn;
  try {
    const book = await get_book_by_isbn(ISBN);
    return res.status(200).json(book);
  } catch (error_message) {
    return res.status(404).json(error_message);
  }
});
  
// Get book details based on author
// Task 3
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
    return res.status(404).json({message: `No book of author ${author} found.`})
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
    return res.status(404).json({message: `No book titled ${title} found.`})
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
    return res.status(404).json({message: `No book with the ISBN ${ISBN} found.`})
  }
  
});

module.exports.general = public_users;
