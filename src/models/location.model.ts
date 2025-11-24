import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class Location extends Model {
	declare id: number;
	declare address: string;
	declare createdAt: Date;
	declare updatedAt: Date;
}

Location.init(
	{
		id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
		address: { type: DataTypes.STRING, allowNull: false, unique: true },
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
	{ sequelize, modelName: "Location", tableName: "locations" }
);
