import logger from "../config/logger";
import {
	createLocation as createLocationService,
	updateLocation as updateLocationService,
	deleteLocation as deleteLocationService,
	findAllLocations,
	findLocationById,
} from "../services/location.service";
import { formatValidationError } from "../utils/format";
import { createLocationSchema, updateLocationSchema } from "../validations";
import { Request, Response } from "express";

export async function createLocation(req: Request, res: Response) {
	try {
		const validationResult = createLocationSchema.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({
				error: "Validation failed",
				details: formatValidationError(validationResult.error),
			});
		}

		const { address } = validationResult.data;

		const location = await createLocationService({ address });

		res.status(201).json({
			message: "Location created successfully",
			location: {
				id: location.id,
				address: location.address,
			},
		});
	} catch (e) {
		logger.error("Error in createLocation controller", e);
		res
			.status(500)
			.json({ message: "Could not create location - " + (e as Error).message });
	}
}

export async function getAllLocations(req: Request, res: Response) {
	try {
		const locations = await findAllLocations();
		res.status(200).json({
			message: "Locations retrieved successfully",
			locations: locations.map((loc: { id: number; address: string }) => ({
				id: loc.id,
				address: loc.address,
			})),
		});
	} catch (e) {
		logger.error("Error in getAllLocations controller", e);
		res.status(500).json({ message: "Could not retrieve locations" });
	}
}

export async function getLocationById(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Location ID is required" });
		}

		const location = await findLocationById(Number(id));

		if (!location) {
			return res.status(404).json({ message: "Location not found" });
		}

		res.status(200).json({
			message: "Location retrieved successfully",
			location: { id: location.id, address: location.address },
		});
	} catch (e) {
		logger.error("Error in getLocationById controller", e);
		res.status(500).json({ message: "Could not retrieve location" });
	}
}

export async function updateLocation(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Location ID is required" });
		}

		const validationResult = updateLocationSchema.safeParse(req.body);

		if (!validationResult.success) {
			return res.status(400).json({
				error: "Validation failed",
				details: formatValidationError(validationResult.error),
			});
		}

		const { address } = validationResult.data;

		const updatedLocation = await updateLocationService(Number(id), {
			address,
		});

		res.status(200).json({
			message: "Location updated successfully",
			location: {
				id: updatedLocation.id,
				address: updatedLocation.address,
			},
		});
	} catch (e) {
		logger.error("Error in updateLocation controller", e);
		res.status(500).json({ message: "Could not update location" });
	}
}

export async function deleteLocation(req: Request, res: Response) {
	try {
		const { id } = req.params;

		if (!id) {
			return res.status(400).json({ message: "Location ID is required" });
		}

		await deleteLocationService(Number(id));

		res.status(200).json({ message: "Location deleted successfully" });
	} catch (e) {
		logger.error("Error in deleteLocation controller", e);
		res.status(500).json({ message: "Could not delete location" });
	}
}
