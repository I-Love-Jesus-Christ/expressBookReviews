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

// Task 10
async function get_all_books(){
  if (Object.keys(books).length > 0) {
    return books;
  } else {
    throw "There are no books available in the shop.";
  }
}

// Get the book list available in the shop
// Task 10
public_users.get('/', async function (req, res) {
  try {
    const books = await get_all_books();
    return res.status(200).json(books);
  } catch (error_message) {
    return res.status(404).json({message: error_message});
  }
});


// Get book details based on ISBN
// Task 11
public_users.get('/isbn/:isbn', async function (req, res) {
  const ISBN = req.params.isbn;
  const the_promise = new Promise(function (resolve, reject) {
    const book = books[ISBN];
    if (book != undefined) {
      resolve(book);
    } else {
      reject(`No book with ISBN ${ISBN} found.`);
    } 
  });

  the_promise.then(function (book) {
      return res.status(200).json(book);
  },
  function (error_message) {
    return res.status(404).json({message: error_message});
  });
});

// Get book details based on author
// Task 12
public_users.get('/author/:author',async function (req, res) {
  const author = req.params.author;
  const the_promise = new Promise(function (resolve, reject) {
    const target_books = [];
    for (key in books) {
      let book = books[key];
      if (author == book["author"]) {
        target_books.push(book);
      }
    }
    if (target_books.length > 0) {
      resolve(target_books);
    } else {
      reject(`No book of author ${author} found.`);
    }
  });
  the_promise.then(function (target_books) {
    return res.status(200).json(target_books);
  },
  function (error_message) {
    return res.status(404).json({message: error_message});
  });
});


// Get all books based on title
// Task 13
public_users.get('/title/:title',async function (req, res) {
  const title = req.params.title;
  const the_promise = new Promise(function (resolve, reject) {
    const target_books = [];
    for (key in books) {
      let book = books[key];
      if (title == book["title"]) {
        target_books.push(book);
      }
    }
    if (target_books.length > 0) {
      resolve(target_books);
    } else {
      reject(`No book titled ${title} found.`);
    }
  });

  the_promise.then(function (target_books) {
    return res.status(200).json(target_books);
  }, 
  function (error_message) {
    return res.status(404).json({message: error_message});
  });
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
