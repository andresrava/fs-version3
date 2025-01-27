'use client'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { formSchema, signInFormSchema } from '@/lib/auth-schema'
import { authClient } from '@/lib/auth-client'
import { toast } from '@/hooks/use-toast'
 
export default function SignIn() {
    // 1. Define your form.
  const form = useForm<z.infer<typeof signInFormSchema>>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof signInFormSchema>) {
    const { email, password } = values;
    const { data, error } = await authClient.signIn.email({
      email,
      password,
      callbackURL: "/dashboard",
    }, { 
      onRequest: () => {         
        toast({
        title: "Plase wait...",
      })
      }, 
      onSuccess: () => { 
        form.reset();
      }, 
      onError: (ctx) => { 
        alert(ctx.error.message); 
      }, 
    });
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }
  return (
    <div>
<Card className='w-full max-w-md mx-auto'>
  <CardHeader>
    <CardTitle>Sign In</CardTitle>
    <CardDescription>Welcome back! Please sign in to continue.</CardDescription>
  </CardHeader>
  <CardContent>
  <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
         <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="juan@mail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type='password' placeholder="Enter your password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className='w-full' type="submit">Submit</Button>
      </form>
    </Form>
  </CardContent>
  <CardFooter className='flex justify-center'>
        <p className='text-sm text-muted-foreground'>
          Don&apos;t have an account yet?{' '}
          <Link href='/sign-up' className='text-primary hover:underline'>
            Sign up
          </Link>
        </p>
      </CardFooter>
</Card>

    </div>
  )
}