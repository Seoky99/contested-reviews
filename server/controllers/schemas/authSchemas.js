import { z } from "zod"; 

export const registerSchema = z.object({
                                        username: z.string()
                                                .min(3, {message: "Username must be at least 3 characters"})
                                                .max(25, {message: "Username must be at most 25 characters"})
                                                .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
                                        email: z.email(), 
                                        password: z.string()
                                                .min(8, {message: "Password must be at least 8 characters"})
                                                .max(25, {message: "Password must be at most 25 characters"}),
                                    });


export const loginSchema = z.object({
                                        username: z.string().min(1, {message: "Username is required"}),
                                        password: z.string().min(1, {message: "Password is required"}),
                                    });