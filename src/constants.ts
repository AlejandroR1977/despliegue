export const PORT = process.env.PORT ?? 3000
export const JWT_SECRET = process.env.JWT_SECRET ?? 'jwtSecret'


//AuthConstants

export const SESSION_DURATION = 2000 //Seconds
export const COOKIES_AUTH_TOKEN_KEY = 'auth_token'

//Guestorders key
export const GUEST_TOKEN_KEY = 'guest_token'


//Order constants
export const ORDERS_AMOUNT_LIMIT_FOR_NON_ADMINS = 2000
