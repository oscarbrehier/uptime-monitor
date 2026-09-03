"use server"

import { createClient } from "@/lib/supabase/server";
import { formatZodErrors } from "@/utils/zod";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const LoginSchema = z.object({
	email: z.email("Enter a valid email address."),
	password: z.string().min(10, "Password must be at least 10 characters")
});

export type LoginFormState = {
	error?: string;
	fieldErrors?: {
		email?: string[];
		password?: string[]
	};
};

const SignUpSchema = z
	.object({
		email: z.email('Please enter a valid email address.'),
		password: z.string().min(10, 'Password must be at least 10 characters long.'),
		confirmPassword: z.string("Please confirm password"),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match.',
		path: ['confirmPassword'],
	});

export type SignUpFormState = {
	error?: string;
	successMessage?: string;
	fieldErrors?: {
		email?: string[];
		password?: string[];
		confirmPassword?: string[];
	};
};

export async function login(prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {

	const validated = LoginSchema.safeParse({
		email: formData.get("email") as string,
		password: formData.get("password") as string
	});

	if (!validated.success) {
		return { fieldErrors: formatZodErrors(validated.error) }
	};

	const { email, password } = validated.data;


	try {

		const supabase = await createClient();
		const { error } = await supabase.auth.signInWithPassword({ email, password });

		if (error) {

			if (error.status === 400) {
				return { error: "Invalid email or password." };
			};

			return { error: error.message || "Authentication failed. Try again." };

		};

	} catch (err) {
		return { error: 'An unexpected network error occurred. Please try again.' }
	};

	redirect('/dashboard');

};

export async function signup(
	prevState: SignUpFormState,
	formData: FormData
): Promise<SignUpFormState> {

	const validated = SignUpSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
		confirmPassword: formData.get('confirmPassword'),
	})

	if (!validated.success) {
		return { fieldErrors: formatZodErrors(validated.error) }
	}

	const { email, password } = validated.data
	const origin = (await headers()).get('origin')
	const supabase = await createClient()


	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			emailRedirectTo: `${origin}/auth/callback`,
		},
	});

	if (error) {
		return { error: error.message || 'Unable to create account. Try again.' }
	};

	return {
		successMessage: 'Account created! Please check your inbox to confirm your email.',
	};

};

export async function signOut() {

	console.log("sign out called")

	const supabase = await createClient();
	await supabase.auth.signOut();

	revalidatePath("/", "layout");
	redirect("/login");

};