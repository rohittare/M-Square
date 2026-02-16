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
    Store,
    Tag,
    Leaf,
} from "lucide-react";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import api from "@/lib/api";
import axios from "axios";

const registerSchema = z.object({
    name: z.string().trim().min(2, "Shop name is required").max(120),
    email: z.string().trim().email("Please enter a valid email address").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(72),
    phoneNumber: z
        .string()
        .trim()
        .regex(/^\d{10}$/, "Phone must be 10 digits"),
    description: z
        .string()
        .trim()
        .min(10, "Description must be at least 10 characters")
        .max(500, "Description must be at most 500 characters"),
    tags: z.string().trim().min(2, "Please add at least one tag").max(200),
    pureVeg: z.boolean(),
});

type FieldErrors = {
    name?: string;
    email?: string;
    password?: string;
    phoneNumber?: string;
    description?: string;
    tags?: string;
};

type ShopRegisterResponse = {
    token?: string;
    tokenType?: string;
    accessToken?: string;
    shopId: string;
    email: string;
    role: string;
};

export default function ShopRegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState("");
    const [pureVeg, setPureVeg] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setFieldErrors({});

        const parsed = registerSchema.safeParse({
            name,
            email,
            password,
            phoneNumber,
            description,
            tags,
            pureVeg,
        });
        if (!parsed.success) {
            const fieldErrorMap: FieldErrors = {};
            const { fieldErrors: zodFieldErrors } = parsed.error.flatten();
            if (zodFieldErrors.name?.[0]) fieldErrorMap.name = zodFieldErrors.name[0];
            if (zodFieldErrors.email?.[0]) fieldErrorMap.email = zodFieldErrors.email[0];
            if (zodFieldErrors.password?.[0]) fieldErrorMap.password = zodFieldErrors.password[0];
            if (zodFieldErrors.phoneNumber?.[0]) fieldErrorMap.phoneNumber = zodFieldErrors.phoneNumber[0];
            if (zodFieldErrors.description?.[0]) fieldErrorMap.description = zodFieldErrors.description[0];
            if (zodFieldErrors.tags?.[0]) fieldErrorMap.tags = zodFieldErrors.tags[0];
            setFieldErrors(fieldErrorMap);
            return;
        }

        setLoading(true);
        try {
            const response = await api.post<ShopRegisterResponse>(
                "/auth/shop/register",
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
                sessionStorage.setItem("shop_id", responseData.shopId);
                sessionStorage.setItem("user_email", responseData.email);
                sessionStorage.setItem("user_role", responseData.role);
            }

            if (responseData?.role) {
                document.cookie = `auth_role=${responseData.role}; path=/; max-age=300`;
            }

            router.replace("/owner/dashboard");
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
            <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border)/0.3)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/0.3)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="relative w-full max-w-3xl">
                <div className="bg-card border border-border rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-swiggy-orange to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                                <Store className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">Register your shop</h1>
                                <p className="text-sm text-muted-foreground">
                                    Tell us a bit about your place and start selling
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Leaf className="w-4 h-4 text-emerald-500" />
                            Mark if you are 100% vegetarian
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label>Shop Name</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="pl-10 h-12 rounded-xl"
                                        placeholder="Masala Junction"
                                        autoComplete="organization"
                                        aria-invalid={Boolean(fieldErrors.name)}
                                        aria-describedby={fieldErrors.name ? "name-error" : undefined}
                                        disabled={loading}
                                    />
                                </div>
                                {fieldErrors.name && (
                                    <p id="name-error" className="text-xs text-destructive mt-1">
                                        {fieldErrors.name}
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
                                        placeholder="contact@yourshop.in"
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
                                <Label>Phone Number</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input
                                        inputMode="numeric"
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                                        className="pl-10 h-12 rounded-xl"
                                        placeholder="9012345678"
                                        autoComplete="tel"
                                        aria-invalid={Boolean(fieldErrors.phoneNumber)}
                                        aria-describedby={fieldErrors.phoneNumber ? "phone-error" : undefined}
                                        disabled={loading}
                                    />
                                </div>
                                {fieldErrors.phoneNumber && (
                                    <p id="phone-error" className="text-xs text-destructive mt-1">
                                        {fieldErrors.phoneNumber}
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
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-2">
                                <Label>Description</Label>
                                <Textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="min-h-28 rounded-xl"
                                    placeholder="A cozy neighborhood restaurant known for flavorful Indian curries..."
                                    aria-invalid={Boolean(fieldErrors.description)}
                                    aria-describedby={fieldErrors.description ? "description-error" : undefined}
                                    disabled={loading}
                                />
                                {fieldErrors.description && (
                                    <p id="description-error" className="text-xs text-destructive mt-1">
                                        {fieldErrors.description}
                                    </p>
                                )}
                            </div>

                            <div className="space-y-4">
                                <div>
                                    <Label>Tags</Label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Input
                                            value={tags}
                                            onChange={(e) => setTags(e.target.value)}
                                            className="pl-10 h-12 rounded-xl"
                                            placeholder="Indian, Fast Food, Curries"
                                            aria-invalid={Boolean(fieldErrors.tags)}
                                            aria-describedby={fieldErrors.tags ? "tags-error" : undefined}
                                            disabled={loading}
                                        />
                                    </div>
                                    {fieldErrors.tags && (
                                        <p id="tags-error" className="text-xs text-destructive mt-1">
                                            {fieldErrors.tags}
                                        </p>
                                    )}
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Separate tags with commas
                                    </p>
                                </div>

                                <div className="flex items-center justify-between rounded-xl border border-border px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium">Pure Veg</p>
                                        <p className="text-xs text-muted-foreground">
                                            Only vegetarian food
                                        </p>
                                    </div>
                                    <Switch
                                        checked={pureVeg}
                                        onCheckedChange={setPureVeg}
                                        disabled={loading}
                                        aria-label="Pure vegetarian"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            disabled={loading}
                            className="w-full h-12 bg-swiggy-orange text-white rounded-xl"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" /> Creating shop...
                                </>
                            ) : (
                                "Create Shop Account"
                            )}
                        </Button>
                    </form>

                    <p className="text-center text-sm text-muted-foreground">
                        Already have a shop account?{" "}
                        <Link href="/shop/login" className="text-swiggy-orange font-medium">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
