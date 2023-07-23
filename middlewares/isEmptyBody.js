import { HttpError } from "../helpers/index.js";

const isEmptyBody = (req, res, next) => {
  const { length } = Object.keys(req.body);
  if (!length) {
    switch (req.method) {
      case "PATCH":
        next(HttpError(400, "missing field favorite"));
        break;

      default:
        next(HttpError(400, "missing fields"));
        break;
    }
  }
  next();
};

export default isEmptyBody;
