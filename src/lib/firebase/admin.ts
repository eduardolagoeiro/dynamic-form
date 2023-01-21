import admin from 'firebase-admin'
import { getAuth } from 'firebase-admin/auth'
import { FIREBASE_ADMIN_PRIVATE_KEY, FIREBASE_ADMIN_CLIENT_EMAIL } from '$env/static/private'
import { PUBLIC_FIREBASE_PROJECT_ID } from '$env/static/public'
import { redirect } from '@sveltejs/kit'

function makeApp() {
	if (admin.apps.length > 0 && admin.apps[0]) {
		return admin.apps[0]
	}

	return admin.initializeApp({
		credential: admin.credential.cert({
			privateKey: FIREBASE_ADMIN_PRIVATE_KEY,
			clientEmail: FIREBASE_ADMIN_CLIENT_EMAIL,
			projectId: PUBLIC_FIREBASE_PROJECT_ID
		}),
		databaseURL: `https://${PUBLIC_FIREBASE_PROJECT_ID}.firebaseio.com`
	})
}
export const firebase = makeApp()
export const auth = getAuth(firebase)

export function guard(locals: App.Locals, path: string) {
	if (!locals.decodedToken) {
		throw redirect(303, path)
	}
}
