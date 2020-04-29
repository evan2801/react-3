import React, { useState, useContext } from 'react';
import { Jumbotron, Container, Row, Col, Form, Card, Button, CardColumns, Collapse } from 'react-bootstrap';
import SavedBookContext from '../utils/SavedBookContext';

import { saveBook, searchGoogleBooks } from '../utils/API';

function SearchBooks() {
    // set state for managing collapsed 

    // create state for holding returned google api data 
    const [searchedBooks, setSearchedBooks] = useState([]);
    // create styate for holding our search field data
    const [searchInput, setSearchInput] = useState([]);

    // get saved books from app.js on load
    const {books: savedBooks, getSavedBooks} = useContext(SavedBookContext);

    console.log(savedBooks);

    // create method to search for books and set state on form submit
    const handleFormSubmit = event => {
      event.preventDefault();

      if (!searchInput) {
         return false;
}

    searchGoogleBooks(searchInput)
    .then(({ data }) => {
         const bookData = data.items.map(book => ({
         bookId: book.id,
         authors: book.volumeInfo.authors || ['No  author to display'],
         title: book.volumeInfo.title,
         description: book.volumeInfo.description,
         image: book.volumeInfo.imageLinks?.thumbnail || '',
        }));
        console.log(bookData);


    return setSearchedBooks(bookData);
  })
    .then(() => setSearchInput(''))
    .catch((err) => console.log(err));
  };

   // create function to handle saving a book to our database
   const handleSaveBook = (bookId) => {
    // find the book in `searchedBooks` state by the matching id
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);
    console.log(bookToSave);
    // send the books data to our api
    saveBook(bookToSave)
      .then(() => getSavedBooks())
      .catch((err) => console.log(err));
  };

  
    return (
    <>
        <Jumbotron fluid className='text-light bg-info'>
          <Container>
             <h1><span>📖</span>  Search for Books! <span>📖</span></h1>
            <Form onSubmit={handleFormSubmit}>
              <Form.Row>
                <Col xs={12} md={8}>
                  <Form.Control
                    name='searchInput'
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    type='text'
                    size='lg'
                    placeholder='📕  Search for a book'
                  />
                  </Col>
                  <Col xs={12} md={4}>
                  <Button type='submit' variant='danger' size='lg'>
                      Submit Search
                  </Button>
                </Col>
              </Form.Row>
            </Form>
          </Container>
        </Jumbotron>

        <Container fluid>
          <h2>{searchedBooks.length ? `Viewing ${searchedBooks.length} results:` : 'Search for a book to begin'}</h2>
          <CardColumns>
              {searchedBooks.map((book) => {
                  return(
                <Card key={book.bookId} bg='info' text='light' border='danger'>
                    {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                    <Card.Body>
                        <Card.Title>{book.title}</Card.Title>
                        <h4 className='small'> Authors: {book.authors}</h4>
                        <Card.Text>{book.description}</Card.Text>
                        <Button 
                        disabled ={savedBooks.some((saveBook) => saveBook.bookId === book.bookId)} className='Btn-block btn-danger' 
                        onClick={() => handleSaveBook(book.bookId)}>
                        {savedBooks.some((savedBook) => savedBook.bookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                        </Button>
                    </Card.Body>
                </Card>
               );  
            })}
          </CardColumns>
        </Container>
     </>
  );
}

export default SearchBooks;