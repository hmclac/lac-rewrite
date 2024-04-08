'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  username: z
    .string()
    .email()
    .min(2, 'Username must be at least 2 characters.'),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
});

type LoginFormInputs = z.infer<typeof formSchema>;

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const session = useSession();
  const [errorMessage, setErrorMessage] = useState(
    searchParams.get('error') || ''
  );
  const [successMessage, setSuccessMessage] = useState('');
  // if (session && session.data) router.push('/employee');

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormInputs) => {
    if (session && session.data) {
      setSuccessMessage('Already signed in!');
      router.push('/employee');
    }
    try {
      const user = await signIn('credentials', {
        username: data.username,
        password: data.password,
        redirect: false,
      });
      if (!user || !user.ok) {
        setErrorMessage('Invalid credentials');
        setSuccessMessage('');
        return;
      }
      setSuccessMessage('Successfully signed in!');
      setErrorMessage('');

      router.push('/employee');
    } catch (error) {
      console.log(error);
      setErrorMessage((error as any).message || 'Failed to sign in');
      setSuccessMessage('');
      return;
    }
  };

  return (
    <div className='flex justify-center items-center'>
      <div className='w-full max-w-md p-8 space-y-3 rounded-xl shadow-lg'>
        {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}

        {successMessage && (
          <div style={{ color: 'green' }}>{successMessage}</div>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className='my-2'>
              <FormField
                control={form.control}
                name='username'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder='name@hmc.edu' {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                    {/* <FormDescription></FormDescription> */}
                  </FormItem>
                )}
              />
            </div>
            <div className='my-2'>
              <FormField
                control={form.control}
                name='password'
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' {...field} />
                    </FormControl>
                    {fieldState.error && (
                      <FormMessage>{fieldState.error.message}</FormMessage>
                    )}
                  </FormItem>
                )}
              />
            </div>
            <Button className='w-auto mt-1' variant='outline' type='submit'>
              Sign In
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Login;
