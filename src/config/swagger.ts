import swaggerJsdoc from "swagger-jsdoc";

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Cavea Backend API",
			version: "1.0.0",
			description: "REST API for managing inventories and locations",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Development server",
			},
		],
	},
	apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
