import { TextInput } from '@mantine/core';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

interface EmployeeSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function EmployeeSearch({ value, onChange }: EmployeeSearchProps) {
  return (
    <TextInput
      placeholder="Search employee..."
      leftSection={<HiOutlineMagnifyingGlass size={18} />}
      radius="lg"
      size="md"
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}
