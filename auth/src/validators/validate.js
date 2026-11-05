
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);

  if (!errors.isEmpty()) {
    res.status(400).json({
      message: errors.array()[0].msg,
    });
    return;
  }

  next();
};
