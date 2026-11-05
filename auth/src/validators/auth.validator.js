import { body } from "express-validator";
import { validate } from "./validate.js";

export const registerValidator = [
  body("username")
    .trim()
    .isLength({ min: 3, max: 20 })
    .withMessage("Username must be between 3 and 20 characters"),

  body("email").trim().isEmail().normalizeEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()

    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .bail()

    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .bail()

    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .bail()

    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain a special character")
    .bail(),
  validate,
];

export const loginValidator = [
  body("email").trim().isEmail().normalizeEmail().withMessage("Invalid email"),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()

    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .bail()

    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .bail()

    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .bail()

    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain a special character")
    .bail(),
  validate,
];

export const resetPasswordValidator = [
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()

    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .bail()

    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .bail()

    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .bail()

    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain a special character")
    .bail(),
  validate,
];
export const chnagePasswordValidator = [
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()

    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .bail()

    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .bail()

    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .bail()

    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain a special character")
    .bail(),
  body("oldPassword")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters")
    .bail()

    .matches(/[A-Z]/)
    .withMessage("Password must contain an uppercase letter")
    .bail()

    .matches(/[a-z]/)
    .withMessage("Password must contain a lowercase letter")
    .bail()

    .matches(/[0-9]/)
    .withMessage("Password must contain a number")
    .bail()

    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain a special character")
    .bail(),
  validate,
];
