export const handleSaveError = (err, data, next) => {
  const { code, name } = err;
  err.status = code === 11000 && name === "MongoServerError" ? 409 : 400;
  next();
};

export const handleUpdateValidate = function (next) {
  this.options.runValidators = true;
  next();
};
