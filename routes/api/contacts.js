import express from "express";
import { contactsController } from "../../controllers/index.js";
import { validateBody } from "../../decorators/index.js";
import {
  isEmptyBody,
  isValidId,
  authenticate,
} from "../../middlewares/index.js";
import contactsSchemas from "../../schemas/contacts-schemas.js";

const contactsRouter = express.Router();

contactsRouter.use(authenticate);

contactsRouter.get("/", contactsController.getAll);

contactsRouter.get("/:contactId", isValidId, contactsController.getByID);

contactsRouter.post(
  "/",

  isEmptyBody,
  validateBody(contactsSchemas.contactAddSchema),
  contactsController.add
);

contactsRouter.delete(
  "/:contactId",

  isValidId,
  contactsController.deleteById
);

contactsRouter.put(
  "/:contactId",

  isValidId,
  isEmptyBody,
  validateBody(contactsSchemas.contactAddSchema),
  contactsController.updateById
);

contactsRouter.patch(
  "/:contactId/favorite",

  isValidId,
  isEmptyBody,
  validateBody(contactsSchemas.contactUpdateFavoriteSchema),
  contactsController.updateStatusContact
);

export default contactsRouter;
