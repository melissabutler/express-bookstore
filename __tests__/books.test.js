const request = require('supertest')

const app = require('../app')
const db = require('../db')
const Book = require("../models/book")
const Test = require('supertest/lib/test')

describe("Book routes Test", function () {
    beforeEach(async function() {
      await db.query("DELETE FROM books");
      
      let book1 = await Book.create({
            id: 1,
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Test",
            language: "english",
            pages: 100,
            publisher: "Test Press",
            title: "Test Book",
            year: 2017

      });
    });


    describe("GET / All books", function() {
        test("Can get a list of all books", async function() {
            let response = await request(app).get('/books')
            expect(response.body).toEqual(
                { "books": [{
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Test",
                    language: "english",
                    pages: 100,
                    publisher: "Test Press",
                    title: "Test Book",
                    year: 2017
                }]})
                
            })
        });
    
    describe("GET /ISBN", function() {
        test("Can get info on a single book given id", async function() {
            let response = await request(app).get('/books/0691161518')
            expect(response.body).toEqual(
                { book: 
                    {isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Test",
                    language: "english",
                    pages: 100,
                    publisher: "Test Press",
                    title: "Test Book",
                    year: 2017}

                }
            )
        })
    })

    describe("POST /", function() {
        test("Can upload a valid book", async function() {
            let response = await request(app).post("/books")
            .send({
                isbn: "0691161519",
                amazon_url: "http://a.co/eobPtX3",
                author: "Test",
                language: "english",
                pages: 100,
                publisher: "Test Press",
                title: "Test Book 2",
                year: 2017})
            expect(response.body).toEqual({
                book: {
                    isbn: "0691161519",
                    amazon_url: "http://a.co/eobPtX3",
                    author: "Test",
                    language: "english",
                    pages: 100,
                    publisher: "Test Press",
                    title: "Test Book 2",
                    year: 2017}
            })
        })

        test("A repeat book upload fails", async function() {
            let response = await request(app).post('/books')
            .send({
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Test",
                    language: "english",
                    pages: 100,
                    publisher: "Test Press",
                    title: "Test Book",
                    year: 2017
            })
            expect(response.status).toBe(500)
            expect(response.body).toEqual({
                "error": {
                    "length": 191,
                    "name": "error",
                    "severity": "ERROR",
                    "code": "23505",
                    "detail": "Key (isbn)=(0691161518) already exists.",
                    "schema": "public",
                    "table": "books",
                    "constraint": "books_pkey",
                    "file": "nbtinsert.c",
                    "line": "663",
                    "routine": "_bt_check_unique"
                },
                "message": "duplicate key value violates unique constraint \"books_pkey\""
            })
        })
    })

    describe("PUT /[isbn]", function() {
        test("Can edit a book", async function() {
            let response = await request(app).put('/books/0691161518')
            .send(
                {
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Test Author",
                    language: "english",
                    pages: 100,
                    publisher: "Test Press Publishing",
                    title: "Test Book",
                    year: 2017
            })
            expect(response.body).toEqual({
                book: {
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Test Author",
                    language: "english",
                    pages: 100,
                    publisher: "Test Press Publishing",
                    title: "Test Book",
                    year: 2017}
            })
        })
    })

    describe("DELETE /[isbn]", function() {
        test("Can delete a book", async function() {
            let response = await request(app).delete('/books/0691161518')
            expect(response.body).toEqual({
                "message": "Book deleted"
            })
        })
    })

afterAll(async function() {
    await db.end();
});

})

