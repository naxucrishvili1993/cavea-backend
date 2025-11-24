export const formatValidationError = (errors: {
	issues: { message: string }[];
}) => {
	if (!errors || !errors.issues) return "Validation failed";

	if (Array.isArray(errors.issues)) {
		return errors.issues
			.map((issue: { message: string }) => issue.message)
			.join(", ");
	}

	return JSON.stringify(errors);
};
