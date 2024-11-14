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
import { CalendarIcon, Eye, EyeClosed } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(50, {
        message: "Username must be max 50 characters.",
      }),
    email: z.string().email("Please enter a valid email address."),
    password: z
      .string()
      .min(6, {
        message: "Password must be at least 6 characters.",
      })
      .max(15, {
        message: "Password must be max 15 characters.",
      }),
    confirmPassword: z.string(),
    dateOfBirth: z.date({
      required_error: "A date of birth is required.",
    }),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function SingUp() {
  const [loading, setLoading] = useState<boolean>(false);
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [confirmPasswordVisibility, setConfirmPasswordVisibility] =
    useState<boolean>(false);
  const { push } = useRouter();

  const handleShowPassword = () => {
    setPasswordVisibility((prev) => !prev);
  };

  const handleShowConfirmPassword = () => {
    setConfirmPasswordVisibility((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      dateOfBirth: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    const formattedDateOfBirth = format(values.dateOfBirth, "yyyy-MM-dd");

    const data = {
      ...values,
      dateOfBirth: formattedDateOfBirth,
    };
    try {
      const res = await fetch("http://localhost:8080/auth/signup", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const responseData = await res.json();
      console.log(responseData);
      if (!res.ok) {
        throw new Error(responseData.message || "Sign up failed. Try again.");
      }
      toast.success("Successfully created account");
      form.reset();
      push("/auth/signin");
    } catch (error) {
      console.error("Error during registration:", error);
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
      <h1 className="mb-5 text-xl">SignUp</h1>
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
           * Email
           ************************************/}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your email" {...field} />
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
                {/* <FormDescription>Enter your password .</FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />
          {/************************************
           * Confirm Password
           ************************************/}
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="flex relative">
                    <Input
                      placeholder="Enter your Confirm password"
                      type={confirmPasswordVisibility ? "text" : "password"}
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute end-0"
                      onClick={handleShowConfirmPassword}
                    >
                      {confirmPasswordVisibility ? <Eye /> : <EyeClosed />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/************************************
           * Date of Birth
           ************************************/}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date of birth</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
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
