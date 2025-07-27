export function validateRequest(schema) {

    function validateMiddleware(req, res, next) {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            return res.status(400).json({ errors: result.error.flatten() });
        }

        req.body = result.data;
        next();
    }

    return validateMiddleware;
}

export default validateRequest;