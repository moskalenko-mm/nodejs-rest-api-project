export const handleSaveError = (err, data, next) => {
  err.status = 400;
  next();
};

export const handleUpdateValidate = function (next) {
  this.options.runValidators = true;
  next();
};
