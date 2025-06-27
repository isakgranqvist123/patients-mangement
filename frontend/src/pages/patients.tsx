import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';
import { API_BASE_URL } from '../config';
import { getJwtToken } from '../context/auth.context';
import { useAsyncState } from '../hooks/use-async-state';
import type { Patient } from '../models/patient';
import EditPatientDialog from '../modules/edit-patient';
import AddPatientDialog from '../modules/add-patient';

function PatientsTable(props: {
  patients: Patient[];
  onEditSuccess: () => void;
}) {
  const [selectedPatient, setSelectedPatient] = React.useState<null | Patient>(
    null,
  );
  const [open, setOpen] = React.useState(false);

  return (
    <React.Fragment>
      <EditPatientDialog
        key={selectedPatient?._id}
        patient={selectedPatient}
        open={open}
        onSuccess={() => {
          props.onEditSuccess();
          setOpen(false);
        }}
        onOpenChange={setOpen}
      />

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>First name</TableHead>
            <TableHead>Last name</TableHead>
            <TableHead>Date of Birth</TableHead>
            <TableHead>Phone Number</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {props.patients.map((patient) => (
            <TableRow
              onClick={() => {
                setSelectedPatient(patient);
                setOpen(true);
              }}
              key={patient._id}
              className="cursor-pointer"
            >
              <TableCell>{patient.firstName}</TableCell>
              <TableCell>{patient.lastName}</TableCell>
              <TableCell>
                {new Date(patient.dateOfBirth).toLocaleDateString()}
              </TableCell>
              <TableCell>{patient.phoneNumber}</TableCell>
              <TableCell>
                {new Date(patient.createdAt).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  );
}

export default function Patients() {
  const { data, loading, run } = useAsyncState<Patient[]>(async () => {
    const res = await fetch(`${API_BASE_URL}/patients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getJwtToken()}`,
      },
    });

    if (res.ok) {
      const { data } = await res.json();
      return data as Patient[];
    }

    throw new Error('Failed to fetch patients');
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1>Patients</h1>
        <AddPatientDialog onSuccess={run} />
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <p>Loading patients...</p>
        </div>
      ) : !data ? (
        <p>No patients found.</p>
      ) : (
        <PatientsTable patients={data} onEditSuccess={run} />
      )}
    </div>
  );
}
