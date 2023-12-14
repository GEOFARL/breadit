'use client';

import { UsernamePayload, UsernameValidator } from '@/lib/validators/username';
import { zodResolver } from '@hookform/resolvers/zod';
import { User } from '@prisma/client';
import { useMutation } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/Button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from './ui/use-toast';
import { useRouter } from 'next/navigation';

interface UserNameFormProps {
  user: Pick<User, 'username' | 'id'>;
}

const UserNameForm: FC<UserNameFormProps> = ({ user }) => {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernamePayload>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || '',
    },
  });

  const { mutate: changeUsername } = useMutation({
    mutationFn: async ({ name }: UsernamePayload) => {
      const payload: UsernamePayload = {
        name,
      };

      const { data } = await axios.patch(`/api/username`, payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          toast({
            title: 'Username already taken.',
            description: 'Please choose a different username.',
            variant: 'destructive',
          });
        }

        toast({
          title: 'There was an error',
          description: 'Could not create subreddit.',
          variant: 'destructive',
        });
      }
    },

    onSuccess: () => {
      toast({
        description: 'Your username has been updated.',
      });
      router.refresh();
    },
  });

  return (
    <form onSubmit={handleSubmit((d) => changeUsername(d))}>
      <Card>
        <CardHeader>
          <CardTitle>Your username</CardTitle>
          <CardDescription>
            Please enter a display name you are comfortable with.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="relative grid gap-1">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>

            <Label className="sr-only" htmlFor="name">
              Name
            </Label>
            <Input
              id="name"
              className="w-[400px] pl-6"
              size={32}
              {...register('name')}
            />

            {errors.name && (
              <p className="px-1 text-red-600 text-xs">{errors.name.message}</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button>Change name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UserNameForm;
