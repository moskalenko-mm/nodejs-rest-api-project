import express from "express";
import { contactsController } from "../../controllers/index.js";
import { validateBody } from "../../decorators/index.js";
import { isEmptyBody } from "../../middlewares/index.js";
import contactsSchemas from "../../contacts-schemas/contacts-schemas.js";

const router = express.Router();

router.get("/", contactsController.getAll);

router.get("/:contactId", contactsController.getByID);

router.post(
  "/",
  isEmptyBody,
  validateBody(contactsSchemas.contactAddSchema),
  contactsController.add
);

router.delete("/:contactId", contactsController.deleteById);

router.put(
  "/:contactId",
  isEmptyBody,
  validateBody(contactsSchemas.contactAddSchema),
  contactsController.updateById
);

export default router;
