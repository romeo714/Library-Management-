
/* accounts.js */

// import { compare, genSalt, hash } from 'bcrypt'

import { db } from 'db'

// const saltRounds = 10
// const salt = await genSalt(saltRounds)



/**
 * Checks user credentials.
 * @param {string} username
 * @param {string} password
 * @returns {string} the username for the valid account
 */
export async function login(data) {
	console.log(data)
	let sql = `SELECT count(id) AS count FROM accounts WHERE user="${data.username}";`
	let records = await db.query(sql)
	if(!records[0].count) throw new Error(`username "${data.username}" not found`)
	sql = `SELECT pass FROM accounts WHERE user = "${data.username}";`
	records = await db.query(sql)
	const valid = data.password == records[0].pass //await compare(data.password, records[0].pass)
	if(valid === false) throw new Error(`invalid password for account "${data.username}"`)
	let us = await db.query(`SELECT user, librarian FROM accounts WHERE user='${data.username}' LIMIT 1`)
	console.log(us)
	return us[0]
}

/**
 * Adds x and y.
 * @param {number} x
 * @param {number} y
 * @returns {number} Sum of x and y
 */
export async function register(data) {
	// make the password as requested. Can change it with data.password
	const password ='p455w0rd' //await hash('p455w0rd', salt)
	const sql = `INSERT INTO accounts(user, pass) VALUES("${data.username}", "${password}")`
	console.log(sql)
	await db.query(sql)
	return true
}
