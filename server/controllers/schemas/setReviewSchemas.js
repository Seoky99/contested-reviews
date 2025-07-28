import { z } from "zod";

export const setReviewSchema = 
    z.object({
        setReviewName: z.string().trim().min(1, {message: "Set review name must not be empty"})
                  .max(50, {message: "Set review name must be at most 50 characters"})
                  .regex(/^[a-zA-Z0-9 _-]+$/, "Only letters, numbers, spaces, dashes, and underscores are allowed"),
        setId: z.uuid(),
        defaultApplied: z.boolean().optional().default(false),
        bonusAdded: z.boolean().optional().default(false),
        makeShard: z.boolean().optional().default(false),
    });

export const userSetIdSchema = 
    z.object({
        userSetId: z.preprocess(val => Number(val), z.number().int({message: "Id must be integer"}).positive({message: "Id must be positive"}))
    });