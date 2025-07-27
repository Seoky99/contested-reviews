import z from "zod";

export const setReviewSchema = 
    z.object({
        sr_name: z.string().trim().min(1).max(50).regex(/^[a-zA-Z0-9 _-]+$/, "Only letters, numbers, spaces, dashes, and underscores are allowed"),
        setid: z.uuid(),
        defaultApplied: z.boolean().optional().default(false),
        bonusAdded: z.boolean().optional().default(false),
        makeShard: z.boolean().optional().default(false),
    });
