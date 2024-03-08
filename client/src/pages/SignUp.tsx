import React from "react";
import { Command, Loader2 } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setErrors("Email and password are required");
      return;
    }
    setIsLoading(true);
    setErrors("");

    await axios
      .post(`${import.meta.env.VITE_SERVER_API_URL}/api/auth/signup`, {
        name,
        email,
        password,
      })
      .then(() => {
        setIsLoading(false);
        navigate("/login");
      })
      .catch((err) => {
        setErrors(err.response.data.error);
        setIsLoading(false);
      });
  };
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px] mt-10 lg:mt-20">
      <div className="flex flex-col space-y-2 text-center">
        <Command className="mx-auto h-6 w-6" />
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign Up for Uplyze
        </h1>
        <p className="text-muted-foreground">
          Get started with Uplyze and start monitoring your websites
        </p>
      </div>
      <div className="grid gap-6">
        <form onSubmit={handleSubmit}>
          <div className="grid gap-2">
            <div className="grid gap-2">
              <label className="sr-only" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                placeholder="Name"
                type="text"
                autoCapitalize="none"
                autoComplete="name"
                autoCorrect="off"
                onChange={(e) => setName(e.target.value)}
                value={name}
                disabled={isLoading}
              />
              <label className="sr-only" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                disabled={isLoading}
              />
              <label className="sr-only" htmlFor="password">
                Password
              </label>

              <Input
                id="password"
                placeholder="Password"
                type="password"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                disabled={isLoading}
              />

              {errors && <p className="px-1 text-xs text-red-600">{errors}</p>}
            </div>
            <button className={cn(buttonVariants())} disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign Up
            </button>
          </div>
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
        <button
          type="button"
          className={cn(buttonVariants({ variant: "outline" }))}
          disabled={true}
        >
          <svg
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="github"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 496 512"
            className="mr-2 h-4 w-4"
          >
            <path
              fill="currentColor"
              d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
            ></path>
          </svg>
          Github
        </button>
      </div>
      <p className="text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          to="/login"
          className="hover:text-brand underline underline-offset-4"
        >
          Log In
        </Link>
      </p>
    </div>
  );
};

export default SignUp;
