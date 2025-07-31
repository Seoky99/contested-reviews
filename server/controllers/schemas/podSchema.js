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