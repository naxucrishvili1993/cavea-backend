import {
	createInventory,
	deleteInventory,
	getAllInventories,
	getInventoryById,
	updateInventory,
} from "../controllers/inventory.controller";
import express from "express";

export const router = express.Router();

/**
 * @swagger
 * /inventories:
 *   get:
 *     summary: Get all inventories
 *     tags: [Inventories]
 *     responses:
 *       200:
 *         description: List of all inventories
 *   post:
 *     summary: Create a new inventory
 *     tags: [Inventories]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               locationId:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Inventory created successfully
 */
router.route("/").get(getAllInventories).post(createInventory);

/**
 * @swagger
 * /inventories/{id}:
 *   get:
 *     summary: Get an inventory by ID
 *     tags: [Inventories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventory details
 *       404:
 *         description: Inventory not found
 *   patch:
 *     summary: Update a inventory
 *     tags: [Inventories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               locationId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 *   delete:
 *     summary: Delete an inventory
 *     tags: [Inventories]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Inventory deleted successfully
 */
router
	.route("/:id")
	.get(getInventoryById)
	.patch(updateInventory)
	.delete(deleteInventory);

export default router;
