import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";
import { Location } from "./location.model";

export class Inventory extends Model {
	declare id: number;
	declare name: string;
	declare description: string;
	declare price: number;
	declare locationId: number;
	declare createdAt: Date;
	declare updatedAt: Date;
	// Association
	declare location?: Location;
}

Inventory.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		name: { type: DataTypes.STRING, allowNull: false, unique: true },
		description: { type: DataTypes.TEXT, allowNull: false },
		price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
		locationId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: Location,
				key: "id",
			},
		},
		createdAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		updatedAt: {
			type: DataTypes.DATE,
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		sequelize,
		modelName: "Inventory",
		tableName: "inventories",
	}
);

Inventory.belongsTo(Location, { foreignKey: "locationId", as: "location" });
Location.hasMany(Inventory, { foreignKey: "locationId", as: "inventories" });
