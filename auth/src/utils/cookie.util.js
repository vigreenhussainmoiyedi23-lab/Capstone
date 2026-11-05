// utils/cookie.js


const BASE_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" ,
}
/**
 * Sends a cookie with standardized security settings.
 * @param {import('express').Response} res - The Express response object
 * @param {string} name - Name of the cookie
 * @param {string} value - Cookie payload/token
 * @param {number} maxAgeInMs - Expiration time in milliseconds
 */

export const sendSecureCookie = (res, name, value, maxAgeInMs) => {
  res.cookie(name, value, {
    ...BASE_COOKIE_OPTIONS,
    maxAge: maxAgeInMs,
  });
};

/**
 * Clears a cookie with matching security settings.
 */
export const clearSecureCookie = (res, name) => {
  res.clearCookie(name, BASE_COOKIE_OPTIONS);
};

export default { sendSecureCookie, clearSecureCookie };
