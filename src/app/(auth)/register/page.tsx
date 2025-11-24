"use client";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import Toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { register } from "./register";
import { signIn } from "next-auth/react";
const Register = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email || !password) {
      Toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(email, password);

      if (result.error) {
        Toast.error(result.error);
      } else if (result.data) {
        Toast.success(result.data.message);
        
        // Auto-login after successful registration
        const signInResult = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (signInResult?.error) {
          Toast.error("Registration successful, but auto-login failed. Please login manually.");
          router.push("/login");
        } else {
          router.push("/dashboard");
          router.refresh();
        }
      }
    } catch (error) {
      Toast.error("An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
    } catch (error) {
      Toast.error("Failed to sign in with Google");
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="container min-h-screen flex items-center justify-center md:justify-around">
      <Image
        src="/svg/register.svg"
        alt="login"
        className="hidden md:block"
        width={500}
        height={500}
      />

      <Card>
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription> Please Register to our platform </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSubmit} className="w-full space-y-4">
            <div>
              <Label htmlFor="email">Your email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>

            <div>
              <Label htmlFor="password">Your Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>


            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Registering..." : "Register"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isGoogleLoading || isLoading}
          >
            {isGoogleLoading ? (
              "Signing in..."
            ) : (
              <>
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </>
            )}
          </Button>
        </CardContent>
        <CardFooter>
          <p className="font-light text-xs text-gray-500">
            You have an account?{" "}
            <Link href="/login" className="text-green-700 underline">
              Login
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;
