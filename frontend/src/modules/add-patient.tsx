import { API_BASE_URL } from '../config';
import { getJwtToken } from '../context/auth.context';
import { useAsyncState } from '../hooks/use-async-state';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { z } from 'zod';
import type { User } from '../models/user';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { PlusCircle } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import React from 'react';

const createPatientSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  dateOfBirth: z
    .string({
      message: 'Date of birth is required',
    })
    .refine(
      (val) => {
        const date = new Date(val);
        return !isNaN(date.getTime());
      },
      {
        message: 'Date of birth is required',
      },
    ),
  phoneNumber: z.string().min(1, 'Phone number is required'),
  userId: z.string().min(1, 'User ID is required'),
});

export default function AddPatientDialog(props: { onSuccess: () => void }) {
  const [open, setOpen] = React.useState(false);

  const { data } = useAsyncState(async () => {
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getJwtToken()}`,
      },
    });

    if (res.ok) {
      const { data } = await res.json();
      return data as User[];
    }

    throw new Error('Failed to fetch users');
  });

  const form = useForm<z.infer<typeof createPatientSchema>>({
    resolver: zodResolver(createPatientSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      phoneNumber: '',
      userId: '',
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    const res = await fetch(`${API_BASE_URL}/patients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getJwtToken()}`,
      },
      body: JSON.stringify({
        ...data,
        dateOfBirth: new Date(data.dateOfBirth).getTime(),
      }),
    });

    if (res.ok) {
      form.reset();
      props.onSuccess?.();
      setOpen(false);
      toast.success('Patient added successfully');
    } else {
      toast.error('Failed to add patient');
    }
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <span>Add Patient</span> <PlusCircle />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add patient</DialogTitle>
          <DialogDescription>
            Fill in the details of the new patient to add them to the system.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone number</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a user" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {data?.map((user) => (
                        <SelectItem value={user._id} key={user._id}>
                          {user.email}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="ml-auto block">
              Add Patient
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
