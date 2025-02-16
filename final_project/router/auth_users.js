const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

// Redundant function. 
const isValid = (username) => {  
  let target_username_found = false;
  let current_position = 0;
  while (current_position < users.length && target_username_found == false) {
    let current_user = users[current_position];
    if (current_user.username == username) {
      target_username_found = true;
    }
    current_position += 1;
  }

  return target_username_found;
}

const authenticatedUser = (username,password)=>{ //returns boolean
    // Filter the users array for any user with the same username and password
    let validusers = users.filter((user) => {
      return (user.username === username && user.password === password);
  });
  // Return true if any valid user is found, otherwise false
  if (validusers.length > 0) {
      return true;
  } else {
      return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Check if the username is valid.  Redundant and waste of time operation. Duplication of part of the authenticatedUser operation.
    if (!isValid(username)) {
      return res.status(404).json({message: "Invalid username"})
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: "1h" });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const username = req.session.authorization.username;
  if (username == undefined) {
    return res.status(404).json({message: `Unauthorized access`});
  }
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  if (book == undefined) {
    return res.status(404).json({message: `No book with ISBN ${ISBN} found`});
  } 
  const review = req.body.review;
  if (review == undefined) {
    return res.status(404).json({message: `Review from ${username} for the book with the ISBN ${ISBN} not given`});
  }
  books[ISBN].reviews[username] = review;
  return res.status(200).json({message: `Review from user ${username} added for the book with ISBN ${ISBN}`});
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", function (req, res) {
  const username = req.session.authorization.username;
  if (username == undefined) {
    return res.status(404).json({message: `Unauthorized access`});
  }
  const ISBN = req.params.isbn;
  const book = books[ISBN];
  if (book == undefined) {
    return res.status(404).json({message: `No book with ISBN ${ISBN} found`});
  } 
  console.log(book);
  const review = book.reviews[username];
  console.log(review);
  if (review == undefined) {
    return res.status(404).json({message: `Review from ${username} for the book with the ISBN ${ISBN} not found`});
  }

  delete books[ISBN].reviews[username];

  return res.status(200).json({message: `Review from ${username} for the book with the ISBN ${ISBN} has been deleted.`})
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
