
/* routes.js */
import { getQuery } from 'https://deno.land/x/oak/helpers.ts'
import { Router } from 'oak'
import { Handlebars } from 'handlebars'

import { login, register } from 'accounts'
import { allbooks, addbooks, availableBooks, lendBook, returnBook } from 'books'
import { allStudents, studentDetails } from 'students'

const handle = new Handlebars({ defaultLayout: '' })

const router = new Router()

// the routes defined here
router.get('/', async context => {
	const authorised = await context.cookies.get('authorised')
	const data = { authorised }
	const body = await handle.renderView('home', data)
	context.response.body = body
})

router.get('/login', async context => {
	const body = await handle.renderView('login')
	context.response.body = body
})

router.get('/register', async context => {
	const body = await handle.renderView('register')
	context.response.body = body
})

router.post('/register', async context => {
	console.log('POST /register')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	console.log(obj)
	await register(obj)
	context.response.redirect('/login')
})

router.get('/logout', async context => {
	// context.cookies.set('authorised', null) // this does the same
	await context.cookies.delete('authorised')
	context.response.redirect('/')
})

router.post('/login', async context => {
	console.log('POST /login')
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	console.log(obj)
	try {
		const { user, librarian } = await login(obj)
		// console.log(user)
		await context.cookies.set('authorised', user)
		if (librarian) context.response.redirect('/books', user)
		else context.response.redirect('/foo', user)
	} catch (err) {
		console.log(err)
		context.response.redirect('/login')
	}
})

router.get('/foo', async context => {
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) context.response.redirect('/')
	const data = { authorised }
	const user = await data.authorised
	const {books} = await studentDetails(user)
	const body = await handle.renderView('foo', { user, books })
	context.response.body = body
})

router.get('/books', async context => {
	let books = await allbooks()
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) context.response.redirect('/')
	const data = { authorised }
	// console.log(books)
	const avBooks = await availableBooks()
	const students = await allStudents()
	const body = await handle.renderView('books', { books, user: await data, avBooks, students })
	context.response.body = body
})

router.post('/books', async context => {
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) contexxt.response.redirect('/')
	const data = { authorised }
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	let lib = await data
	const bk = await addbooks({ ...obj, librarian: lib })
	context.response.redirect("/books")
})

router.get('/addbooks', async context => {
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) context.response.redirect('/')
	const data = { authorised }
	// let u = await data.authorized
	// if(!u.librarian) context.response.redirect('/')
	const body = await handle.renderView('addbooks', data)
	context.response.body = body

})

router.post('/lendbook', async context => {
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) context.response.redirect('/')
	const data = { authorised }
	const body = context.request.body({ type: 'form' })
	const value = await body.value
	const obj = Object.fromEntries(value)
	let lb = await lendBook(obj)
	context.response.redirect('/books')
})

router.post('/returnbook/:book', async context => {
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) context.response.redirect('/')
	const data = { authorised }
	let { book } = getQuery(context, { mergeParams: true })
	const rt = await returnBook(book)
	context.response.redirect('/books')
})

router.get('/manageusers', async context => {
	let books = await allStudents()
	console.log(books)
	const authorised = context.cookies.get('authorised')
	if (authorised === undefined) context.response.redirect('/')
	const data = { authorised }
	// let u = await data.authorized
	// if(!u.librarian) context.response.redirect('/')
	const body = await handle.renderView('manageusers', { data, books })
	context.response.body = body
})

router.get('/manageusers/:user', async context => {
	let { user } = getQuery(context, { mergeParams: true })
	let student = await studentDetails(user)
	const body = await handle.renderView('student', { student })
	context.response.body = body
})



export default router
