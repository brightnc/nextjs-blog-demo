"use client";
import { Button, buttonVariants } from "@/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeClosed } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  username: z
    .string()
    .min(2, {
      message: "Username must be at least 2 characters.",
    })
    .max(50, {
      message: "Username must be max 50 characters.",
    }),
  password: z
    .string()
    .min(6, {
      message: "Password must be at least 6 characters.",
    })
    .max(15, {
      message: "Password must be max 15 characters.",
    }),
});

export default function Signin() {
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const { push } = useRouter();

  const handleShowPassword = () => {
    setPasswordVisibility((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8080/auth/signin", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const responseData = await res.json();
      if (!res.ok) {
        throw new Error(responseData.message || "Sign in failed. Try again.");
      }
      localStorage.setItem("accessToken", responseData.accessToken);
      localStorage.setItem("isLoggedIn", "true");
      toast.success("Successfully log in");
      form.reset();
      push("/");
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === "Failed to fetch") {
          error.message = "An unknown error occurred. Please try again.";
        }
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  }
  return (
    <section className="w-full h-screen flex flex-col items-center justify-center ">
      <h1 className="mb-5 text-xl">SignIn</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 w-72">
          {/************************************
           * Username
           ************************************/}
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/************************************
           * Password
           ************************************/}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="flex relative">
                    <Input
                      placeholder="Enter your password"
                      type={passwordVisibility ? "text" : "password"}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute end-0"
                      onClick={handleShowPassword}
                    >
                      {passwordVisibility ? <Eye /> : <EyeClosed />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/************************************
           * Submit Button
           ************************************/}
          <div className="w-full flex justify-center">
            <Button
              type="submit"
              disabled={loading}
              className={buttonVariants({ size: "lg" })}
            >
              {loading ? "Submitting" : "Submit"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}
