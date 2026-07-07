import { TextInput } from '@mantine/core';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

interface TaskSearchProps {
  value: string;
  onChange: (value: string) => void;
}

export default function TaskSearch({ value, onChange }: TaskSearchProps) {
  return (
    <TextInput
      placeholder="Search task..."
      radius="lg"
      size="md"
      leftSection={<HiOutlineMagnifyingGlass size={18} />}
      value={value}
      onChange={(event) => onChange(event.currentTarget.value)}
    />
  );
}
