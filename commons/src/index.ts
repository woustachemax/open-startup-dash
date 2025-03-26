import z from 'zod'

export const signupInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional()
})


export const loginInput = z.object({
    email: z.string().email(),
    password: z.string().min(8),
})


export const enterMetrics = z.object({
    revenue: z.number(),
    users: z.number()
})


export type signupInput = z.infer<typeof signupInput>
export type loginInput = z.infer<typeof loginInput>
export type enterMetrics = z.infer<typeof enterMetrics>
