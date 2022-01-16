import * as dotenv from 'dotenv'

dotenv.config({ path: `.env.${process.env.NODE_ENV}` })

export const getEnv = (key: string): string => {
  return process.env[key]
}
export const ENV = process.env.NODE_ENV
export const PORT = process.env.ORDER_PORT
// JWT
export const JWT_SECRET = process.env.JWT_SECRET
export const JWT_EXPIRATION_TIME = process.env.JWT_EXPIRATION_TIME
// Mongo
const MONGO_USERNAME = getEnv('MONGO_USERNAME')
const MONGO_PASSWORD = encodeURIComponent(getEnv('MONGO_PASSWORD'))
const MONGO_PORT = getEnv('MONGO_PORT')
const MONGO_HOST = getEnv('MONGO_HOST')
export const MONGO_DB = getEnv('MONGO_DB')
export const DATABASE_URI = `mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}?authSource=admin`

export const PAYMENT_SERVICE = getEnv('PAYMENT_SERVICE')
