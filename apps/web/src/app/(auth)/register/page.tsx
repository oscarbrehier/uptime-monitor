"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signup, SignUpFormState } from "../../../lib/actions/auth";

const initialState: SignUpFormState = {};

export default function RegisterPage() {

	const [state, formAction, isPending] = useActionState(signup, initialState);

	return (
		<AuthCard
			title="Create your account"
			description="Start monitoring in under a minute"
			footer={
				<>
					Already have an account?{" "}
					<Link href="/login" className="font-medium text-foreground hover:underline">
						Sign in
					</Link>
				</>
			}
		>
			<div className="flex flex-col gap-5">

				<form action={formAction} className="flex flex-col gap-4">

					<div className="flex flex-col gap-1.5">

						<Label htmlFor="email">Email address</Label>

						<div className="relative">

							<Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

							<Input
								id="email"
								name="email"
								type="email"
								placeholder="you@company.com"
								autoComplete="email"
								required
								className="pl-9"
							/>

							{state?.fieldErrors?.email && (
								<p className="text-red-500 text-xs mt-1">{state.fieldErrors.email[0]}</p>
							)}

						</div>
					</div>

					<div className="flex flex-col gap-1.5">

						<Label htmlFor="password">Password</Label>

						<div className="relative">

							<Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

							<Input
								id="password"
								name="password"
								type="password"
								placeholder="At least 10 characters"
								required
								className="pl-9"
							/>

							{state?.fieldErrors?.password && (
								<p className="text-red-500 text-xs mt-1">{state.fieldErrors.password[0]}</p>
							)}

						</div>

					</div>

					<div className="flex flex-col gap-1.5">

						<Label htmlFor="password">Confirm Password</Label>

						<div className="relative">

							<Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

							<Input
								id="confirmPassword"
								name="confirmPassword"
								type="password"
								placeholder="At least 10 characters"
								required
								className="pl-9"
							/>

							{state?.fieldErrors?.confirmPassword && (
								<p className="text-red-500 text-xs mt-1">{state.fieldErrors.confirmPassword[0]}</p>
							)}

						</div>

					</div>

					<Button type="submit" variant="gradient" disabled={isPending} className="mt-1">
						{isPending && <Loader2 className="size-4 animate-spin" />}
						{isPending ? "Creating account…" : "Create account"}
					</Button>

					<p className="text-center text-xs text-muted-foreground">
						By signing up you agree to our{" "}
						<Link href="#" className="underline underline-offset-2 hover:text-foreground">
							Terms
						</Link>{" "}
						and{" "}
						<Link href="#" className="underline underline-offset-2 hover:text-foreground">
							Privacy Policy
						</Link>
						.
					</p>

				</form>

			</div>

		</AuthCard>


	);

};
