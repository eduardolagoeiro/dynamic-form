// import { auth } from '$lib/firebase/admin'
import type { Handle } from '@sveltejs/kit'

export const handle: Handle = async ({ event, resolve }) => {
	// const token = event.cookies.get('token')
	// const decodedToken = token
	// 	? await auth.verifyIdToken(token).catch((error) => {
	// 			console.error(error)
	// 			return null
	// 	  })
	// 	: null
	// event.locals.decodedToken = decodedToken

	const response = await resolve(event)
	return response
}
