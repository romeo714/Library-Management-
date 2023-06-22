
/* db.js */

import { Client } from 'mysql'


const home = Deno.env.get('HOME')
console.log(`HOME: ${home}`)

const connectionData = {
  '/home/codio': {
    hostname: '127.0.0.1',
    username: 'root',
    password: 'p455w0rd',
    db: 'website'
  },
  '/app': {
    hostname: 'HOSTNAME',
    username: 'USERNAME',
    password: 'PASSWORD',
    db: 'DATABASE'
  }
}

const conn = connectionData[home]
console.log(conn)

const db = await new Client().connect(conn)


// console.log(await db.execute(`CREATE TABLE books (
//   name VARCHAR(45) NOT NULL,
//   author VARCHAR(45) NOT NULL,
//   isbn DECIMAL(13,0) NOT NULL,
//   dewey INT NOT NULL,
//   loanperiod VARCHAR(45) NOT NULL,
//   librarian VARCHAR(45) NOT NULL DEFAULT '1 Week',
//   currenttime DATETIME NOT NULL,
//   uuid INT NOT NULL AUTO_INCREMENT,
//   PRIMARY KEY(uuid));`))


// console.log(await db.query(`ALTER TABLE books ADD COLUMN borrowedby VARCHAR(45)`))

// Enable below code to reset all passwords to p455w0rd
// import { compare, genSalt, hash } from 'bcrypt'
// const saltRounds = 10
// const salt = await genSalt(saltRounds)

// const password = await hash('p455w0rd', salt)

// await db.query(`UPDATE accounts SET pass="${password}" WHERE pass IS NOT NULL`)

// await db.query(`UPDATE accounts SET pass="p455w0rd" WHERE pass IS NOT NULL`)


export { db }
