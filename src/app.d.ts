// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces

import type { DecodedIdToken } from 'firebase-admin/auth'

declare global {
	// and what to do when importing types
	declare namespace App {
		// interface Error {}
		interface Locals {
			decodedToken: DecodedIdToken | null
		}
		// interface PageData {}
		// interface Platform {}
	}
}

export default undefined
