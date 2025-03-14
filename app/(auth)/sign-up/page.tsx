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
import { formSchema } from '@/lib/auth-schema'
import { authClient } from '@/lib/auth-client'
import { toast } from '@/hooks/use-toast'
 

export default function SignUp() {
    // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, email, password } = values;
    const { data, error } = await authClient.signUp.email({
      email,
      password,
      name,
      callbackURL: "/sign-in",
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
        toast({
          title: "Error",
          description: ctx.error.message,
          variant: "destructive",
        });
        form.setError('email', {
          type: 'manual',
          message: ctx.error.message
        })
      }, 
    });
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
  }
  return (
    <div>
<Card className='w-full max-w-md mx-auto'>
  <CardHeader>
    <CardTitle>Sign Up</CardTitle>
    <CardDescription>Create your account to get started.</CardDescription>
  </CardHeader>
  <CardContent>
  <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Juan Perez" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          Already have an account?{' '}
          <Link href='/sign-in' className='text-primary hover:underline'>
            Sign in
          </Link>
        </p>
      </CardFooter>
</Card>

    </div>
  )
}