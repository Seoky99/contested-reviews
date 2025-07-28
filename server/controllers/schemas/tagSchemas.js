import z from "zod";

export const tagCreationSchema = 
    z.object({
            tagName: z.string().trim().min(1, {message: "Tag name required"})
                      .max(20, {message: "Max 20 characters"})
                      .regex(/^[a-zA-Z0-9 _-]+$/, { message: "Only letters, numbers, spaces, dashes, underscores allowed" }),
            userSetId: z.number().int().positive()
    });

export const tagIdSchema = 
    z.object({
            tagId: z.preprocess(val => Number(val), z.number().int().positive())
    });
    