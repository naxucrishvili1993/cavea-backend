import { ValidationError } from "sequelize";
import logger from "../config/logger";
import { Location } from "../models/location.model";

export async function createLocation({ address }: { address: string }) {
	try {
		const location = await Location.create({ address });
		return location;
	} catch (e: any) {
		if (e instanceof ValidationError) {
			if (
				e.errors
					.map((err) => err.message)
					.join(", ")
					.includes("must be unique")
			) {
				logger.error("Duplicate address error", e);
				throw new Error("Address must be unique");
			}
		}
		logger.error("Error creating location", e);
		throw new Error(`Could not create location - ${e.message}`);
	}
}

export async function findLocationById(id: number) {
	try {
		const location = await Location.findByPk(id, { include: ["products"] });
		return location;
	} catch (e) {
		logger.error("Error fetching location by ID", e);
		throw new Error("Could not fetch location");
	}
}

export async function findAllLocations() {
	try {
		const locations = await Location.findAll({ include: ["products"] });
		return locations;
	} catch (e) {
		logger.error("Error fetching all locations", e);
		throw new Error("Could not fetch locations");
	}
}

export async function updateLocation(
	id: number,
	updates: Partial<{ address: string }>
) {
	try {
		const location = await Location.findByPk(id);
		if (!location) {
			throw new Error("Location not found");
		}
		await location.update(updates);
		return location;
	} catch (e) {
		logger.error("Error updating location", e);
		throw new Error("Could not update location");
	}
}

export async function deleteLocation(id: number) {
	try {
		const location = await Location.findByPk(id);
		if (!location) {
			throw new Error("Location not found");
		}
		await location.destroy();
		return true;
	} catch (e) {
		logger.error("Error deleting location", e);
		throw new Error("Could not delete location");
	}
}
