import { z } from "zod"

export const podIdSchema = 
    z.object({
        podId: z.preprocess(val => Number(val), z.number().int({message: "Id must be int"}).positive({message: "Id must be positive"}))
    });

export const podUserSetIdSchema = 
    z.object({
        podId: z.preprocess(val => Number(val), z.number().int({message: "Id must be int"}).positive({message: "Id must be positive"})),
        userSetId: z.preprocess(val => Number(val), z.number().int({message: "Id must be int"}).positive({message: "Id must be positive"}))
    });

export const createPodSchema = 
    z.object({
        podName: z.string().trim().min(1, "Pod name cannot be empty").max(50)
                    .regex(/^[a-zA-Z0-9 _-]+$/, "Only letters, numbers, spaces, dashes, and underscores are allowed"),
        isPrivate: z.boolean().optional().default(false)
    }); 