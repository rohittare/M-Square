"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Eye,
    EyeOff,
    Mail,
    Lock,
    AlertCircle,
    Loader2,
    User,
    Phone,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import api from "@/lib/api";
import axios from "axios";

const registerSchema = z.object({
    fullName: z.string().trim().min(2, "Full name is required").max(100),
    email: z.string().trim().email("Please enter a valid email address").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    phone: z
        .string()
        .trim()
        .regex(/^\d{10}$/, "Phone must be 10 digits"),
    role: z.literal("USER"),
});

type FieldErrors = {
    fullName?: string;
    email?: string;
    password?: string;
    phone?: string;
};

type RegisterResponse = {
    token?: string;
    tokenType?: string;
    accessToken?: string;
    userId: string;
    email: string;
    role: string;
};

export default function RegisterPage() {
    const router = useRouter();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const parsed = registerSchema.safeParse({
            fullName,
            email,
            password,
            phone,
            role: "USER",
        });
        if (!parsed.success) {
            const fieldErrorMap: FieldErrors = {};
            const { fieldErrors: zodFieldErrors } = parsed.error.flatten();
            if (zodFieldErrors.fullName?.[0]) fieldErrorMap.fullName = zodFieldErrors.fullName[0];
            if (zodFieldErrors.email?.[0]) fieldErrorMap.email = zodFieldErrors.email[0];
            if (zodFieldErrors.password?.[0]) fieldErrorMap.password = zodFieldErrors.password[0];
            if (zodFieldErrors.phone?.[0]) fieldErrorMap.phone = zodFieldErrors.phone[0];
            setFieldErrors(fieldErrorMap);
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<RegisterResponse>(
                "/auth/register",
                parsed.data,
                { timeout: 10000 }
            );

            const responseData = response.data;
            const authHeader =
                response.headers?.authorization ||
                response.headers?.Authorization ||
                response.headers?.AUTHORIZATION;
            const tokenFromHeader = typeof authHeader === "string"
                ? authHeader.replace(/^Bearer\s+/i, "")
                : undefined;
            const token = responseData.token ?? responseData.accessToken ?? tokenFromHeader;

            if (!token) {
                setError("Registration succeeded but no token was returned.");
                return;
            }

            if (typeof window !== "undefined") {
                sessionStorage.setItem("access_token", token);
                sessionStorage.setItem("token_type", responseData.tokenType ?? "Bearer");
                sessionStorage.setItem("user_id", responseData.userId);
                sessionStorage.setItem("user_email", responseData.email);
                sessionStorage.setItem("user_role", responseData.role);
            }

            if (responseData?.role) {
                document.cookie = `auth_role=${responseData.role}; path=/; max-age=300`;
            }

            router.replace("/");
        } catch (err) {
            if (axios.isAxiosError(err)) {
                if (err.code === "ECONNABORTED") {
                    setError("Registration request timed out. Please try again.");
                    return;
                }
                const message =
                    (err.response?.data as { message?: string } | undefined)?.message ??
                    "Registration failed. Please try again.";
                setError(message);
                return;
            }
            setError("An unexpected error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-4 relative">
            {/* Background grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="relative w-full max-w-md">
                <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-14 h-14 bg-gradient-to-br from-swiggy-orange to-orange-600 rounded-xl flex items-center justify-center mx-auto shadow-lg">
                            <span className="text-2xl font-bold text-white">D</span>
                        </div>
                        <h1 className="text-2xl font-bold">Create your account</h1>
                        <p className="text-sm text-muted-foreground">
                            Join to get started
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <Label>Full Name</Label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="pl-10 h-12 rounded-xl"
                                    placeholder="Your name"
                                    autoComplete="name"
                                    aria-invalid={Boolean(fieldErrors.fullName)}
                                    aria-describedby={fieldErrors.fullName ? "fullname-error" : undefined}
                                    disabled={loading}
                                />
                            </div>
                            {fieldErrors.fullName && (
                                <p id="fullname-error" className="text-xs text-destructive mt-1">
                                    {fieldErrors.fullName}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Email</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-12 rounded-xl"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    aria-invalid={Boolean(fieldErrors.email)}
                                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                                    disabled={loading}
                                />
                            </div>
                            {fieldErrors.email && (
                                <p id="email-error" className="text-xs text-destructive mt-1">
                                    {fieldErrors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Phone</Label>
                            <div className="relative">
                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    inputMode="numeric"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                                    className="pl-10 h-12 rounded-xl"
                                    placeholder="9876543210"
                                    autoComplete="tel"
                                    aria-invalid={Boolean(fieldErrors.phone)}
                                    aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                                    disabled={loading}
                                />
                            </div>
                            {fieldErrors.phone && (
                                <p id="phone-error" className="text-xs text-destructive mt-1">
                                    {fieldErrors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label>Password</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-12 h-12 rounded-xl"
                                    autoComplete="new-password"
                                    aria-invalid={Boolean(fieldErrors.password)}
                                    aria-describedby={fieldErrors.password ? "password-error" : undefined}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    disabled={loading}
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {fieldErrors.password && (
                                <p id="password-error" className="text-xs text-destructive mt-1">
                                    {fieldErrors.password}
                                </p>
                            )}
                        </div>

                        <Button
                            disabled={loading}
                            className="w-full h-12 bg-swiggy-orange text-white rounded-xl"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" /> Creating account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link href="/login" className="text-swiggy-orange font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
