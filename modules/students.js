import { db } from 'db'

export async function allStudents() {
    let stds = await db.query(`SELECT user, (SELECT COUNT(isbn) FROM books WHERE borrowedby=user) as books FROM accounts WHERE librarian='0' `)
    return stds
}

export async function studentDetails(user) {
    console.log(user)
    let books = await db.query(`SELECT *, isbn as rr, 
    DATE_FORMAT(currenttime, "%d/%m/%Y") as date_borrowed,
    DATE_ADD(currenttime, INTERVAL loanperiod DAY) as return_date,
    (SELECT COUNT(isbn) from books WHERE isbn=rr) as stocked,
    (SELECT COUNT(isbn) from books WHERE isbn=rr AND borrowedby IS NULL) as available
    FROM books WHERE borrowedby = "${user}"`)
    return { user, books }
}