import { z } from "zod"

export const reviewIdSchema = 
    z.object({
            reviewId: z.preprocess(val => Number(val), z.number().int({message: "Id must be integer"}).positive({message: "Id must be positive"}))
    });

const rankSchema = z.enum(["NR", "A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D+", "D", "D-", "F+", "F", "F-"], {
  errorMap: () => ({ message: "Rank must be a valid grade like A+, A, etc." }),
});

const notesSchema = z.string().max(10000, { message: "Notes too long (max 10,000 characters)" });

const selectedTagsSchema = z.array(
  z.preprocess((val) => Number(val), z.number().int({message: "Id must be integer"}).positive({message: "Id must be positive"}))
);

const trophySchema = z.looseObject({
    trophy_id: z.number().int({message: "Id must be integer"}).positive({message: "Id must be positive"}),
    user_set_id: z.number().int({message: "Id must be integer"}).positive({message: "Id must be positive"})
});

const trophiesSchema = z.array(trophySchema);

const userSetIdSchema = z.preprocess(
  (val) => Number(val),
  z.number().int({message: "Id must be integer"}).positive({message: "Id must be positive"})
);

export const pageInformationSchema = z.object({
  rank: rankSchema,
  notes: notesSchema,
  selectedTags: selectedTagsSchema,
  trophies: trophiesSchema,
  userSetId: userSetIdSchema,
});