import express from "express";
import { contactsController } from "../../controllers/index.js";
import { validateBody } from "../../decorators/index.js";
import { isEmptyBody } from "../../middlewares/index.js";
import contactsSchemas from "../../contacts-schemas/contacts-schemas.js";
import isValidId from "../../middlewares/isValidId.js";

const router = express.Router();

router.get("/", contactsController.getAll);

router.get("/:contactId", isValidId, contactsController.getByID);

router.post(
  "/",
  isEmptyBody,
  validateBody(contactsSchemas.contactAddSchema),
  contactsController.add
);

router.delete("/:contactId", isValidId, contactsController.deleteById);

router.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  validateBody(contactsSchemas.contactAddSchema),
  contactsController.updateById
);

router.patch(
  "/:contactId/favorite",
  isValidId,
  isEmptyBody,
  validateBody(contactsSchemas.contactUpdateFavoriteSchema),
  contactsController.updateStatusContact
);

export default router;
