import z from 'zod';
export declare const signupInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
    name?: string | undefined;
}, {
    email: string;
    password: string;
    name?: string | undefined;
}>;
export declare const loginInput: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    email: string;
    password: string;
}, {
    email: string;
    password: string;
}>;
export declare const enterMetrics: z.ZodObject<{
    revenue: z.ZodNumber;
    users: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    revenue: number;
    users: number;
}, {
    revenue: number;
    users: number;
}>;
export type signupInput = z.infer<typeof signupInput>;
export type loginInput = z.infer<typeof loginInput>;
export type enterMetrics = z.infer<typeof enterMetrics>;
