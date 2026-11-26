import { z } from 'zod';

// Reject line breaks in single-line fields: they are the vector for email header injection
const singleLine = (min: number, max: number) =>
	z
		.string()
		.trim()
		.min(min)
		.max(max)
		.refine((v) => !/[\r\n]/.test(v), { message: 'No line breaks allowed' });

export const contactSchema = z.object({
	name: singleLine(2, 100),
	email: z.string().trim().email().max(254),
	subject: singleLine(3, 150),
	message: z.string().trim().min(10).max(5000)
});

export type ContactInput = z.infer<typeof contactSchema>;
