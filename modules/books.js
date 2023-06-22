import { db } from "db"

export async function allbooks() {
    const books = await db.query(`SELECT isbn as id, 
    (SELECT name FROM books WHERE isbn = id LIMIT 1) as name,
    (SELECT author FROM books WHERE isbn = id LIMIT 1) as author,
    COUNT(isbn) as quantity
    FROM books GROUP BY isbn`)
    // console.log(books)
    return books
}

export async function addbooks(data) {
    let { name, author, isbn, dewey, quantity, loanperiod, librarian } = data
    // console.log(data)
    const bks = []
    for (let i = 0; i < quantity; i++) {
        const bk = await db.query(`INSERT INTO books(name, author, isbn, dewey, loanperiod, librarian, currenttime) 
        VALUES('${name}', '${author}','${isbn}','${dewey}','${loanperiod}','${librarian}','${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDay()} ${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}')`)
        console.log(bk)
        bks.push(bk)
    }
    return bks
}

export async function availableBooks(){
    const books = await db.query(`select * from books where borrowedby is NULL`)
    // console.log(books)
    return books
}

export async function lendBook(data){
    console.log(data)
    const {student, book} = data
    const resp = await db.query(`UPDATE books SET borrowedby="${student}" WHERE uuid="${book}"`)
    return resp
}

export async function returnBook(book){
    const resp = await db.query(`UPDATE books SET borrowedby=NULL WHERE uuid="${book}"`)
    return resp
}