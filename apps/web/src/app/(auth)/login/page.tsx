"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Loader2, Lock, Mail } from "lucide-react";
import { AuthCard } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login, LoginFormState } from "../../../lib/actions/auth";

const initialState: LoginFormState = {};

export default function LoginPage() {

	const [state, formAction, isPending] = useActionState(login, initialState);

	return (
		<AuthCard
			title="Welcome back"
			description="Sign in to your Pulse workspace"
			footer={
				<>
					Don&apos;t have an account?{" "}
					<Link href="/register" className="font-medium text-foreground hover:underline">
						Sign up
					</Link>
				</>
			}
		>

			<div className="flex flex-col gap-5">

				{/* <SocialButtons />

				<div className="flex items-center gap-3">
					<Separator className="flex-1" />
					<span className="text-xs text-muted-foreground">or continue with email</span>
					<Separator className="flex-1" />
				</div> */}

				<form action={formAction} className="flex flex-col gap-4">

					<div className="flex flex-col gap-1.5">

						<Label htmlFor="email">Email address</Label>

						<div className="relative">

							<Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

							<Input
								id="email"
								name="email"
								type="email"
								required
								className="pl-9"
							/>

							{state?.fieldErrors?.email && (
								<p className="text-red-500 text-xs mt-1">{state.fieldErrors.email[0]}</p>
							)}

						</div>

					</div>

					<div className="flex flex-col gap-1.5">

						<div className="flex items-center justify-between">
							
							<Label htmlFor="password">Password</Label>
							
							<Link href="#" className="text-xs text-muted-foreground hover:text-foreground">
								Forgot password?
							</Link>

						</div>

						<div className="relative">

							
							<Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
							
							<Input
								id="password"
								name="password"
								type="password"
								required
								className="pl-9"
							/>

							{state?.fieldErrors?.password && (
								<p className="text-red-500 text-xs mt-1">{state.fieldErrors.password[0]}</p>
							)}

						</div>

						{state.error && (
							<p className="text-xs text-destructive">
								{state.error}
							</p>
						)}

					</div>

					<Button type="submit" variant="gradient" disabled={isPending} className="mt-1">
						{isPending && <Loader2 className="size-4 animate-spin" />}
						{isPending ? "Signing in…" : "Sign in"}
					</Button>

				</form>

			</div>

		</AuthCard>

	);

};
