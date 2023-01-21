import monk from 'monk'
import { MONGODB_URL } from '$env/static/private'

export const db = monk(MONGODB_URL)
