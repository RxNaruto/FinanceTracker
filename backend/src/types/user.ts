import {z} from 'zod';

export const SignupTypes=z.object({
    name: z.string(),
    email: z.email(),
    password: z.string().min(8)
})

export const loginTypes = z.object({
    email: z.email(),
    password: z.string().min(6)
})