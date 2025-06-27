import { z } from 'zod';
import type { Patient } from '../models/patient';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { API_BASE_URL } from '../config';
import { getJwtToken } from '../context/auth.context';
import { toast } from 'sonner';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';

console.log('Trigger deployment');

const editPatientSchema = z.object({
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
});

export default function EditPatientDialog(props: {
  patient: Patient | null;
  onSuccess: () => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const form = useForm<z.infer<typeof editPatientSchema>>({
    resolver: zodResolver(editPatientSchema),
    defaultValues: {
      firstName: props.patient?.firstName,
      lastName: props.patient?.lastName,
      dateOfBirth: props.patient
        ? new Date(props.patient.dateOfBirth).toISOString().split('T')[0]
        : '',
      phoneNumber: props.patient?.phoneNumber.toString(),
    },
  });

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!props.patient) return;

    const res = await fetch(`${API_BASE_URL}/patients/${props.patient._id}`, {
      method: 'PATCH',
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
      props.onSuccess?.();
      toast.success('Patient updated successfully');
    } else {
      toast.error('Failed to update patient');
    }
  });

  const handleDelete = async () => {
    if (!props.patient) return;

    const res = await fetch(`${API_BASE_URL}/patients/${props.patient._id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getJwtToken()}`,
      },
    });

    if (res.ok) {
      props.onSuccess?.();
      toast.success('Patient deleted successfully');
    } else {
      toast.error('Failed to delete patient');
    }
  };

  return (
    <Dialog open={props.open} onOpenChange={props.onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit patient</DialogTitle>
          <DialogDescription>
            Edit the details of the selected patient.
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

            <div className="flex items-center justify-end space-x-2 mt-4">
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
              >
                Delete Patient
              </Button>
              <Button type="submit">Save Patient</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
