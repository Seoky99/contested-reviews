export function validateRequest({bodySchema, paramsSchema}) {

    function validateMiddleware(req, res, next) {

        if (bodySchema) {

            console.log("body parsing!");

            const result = bodySchema.safeParse(req.body);

            if (!result.success) {
                return res.status(400).json({source: "body", errors: result.error.flatten()});
            }

            req.body = result.data;
        }

        if (paramsSchema) {

            console.log("params parsing!");

            const result = paramsSchema.safeParse(req.params);
            if (!result.success) {
                return res.status(400).json({ source: "params", errors: result.error.flatten() });
            }

            req.params = result.data;
        }

        next();
    }

    return validateMiddleware;
}

export default validateRequest;