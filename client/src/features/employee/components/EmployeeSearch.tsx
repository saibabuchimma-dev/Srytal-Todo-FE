import { TextInput } from '@mantine/core';
import { HiOutlineMagnifyingGlass } from 'react-icons/hi2';

export default function EmployeeSearch() {
  return (
    <TextInput
      placeholder="Search employee..."
      leftSection={<HiOutlineMagnifyingGlass size={18} />}
      radius="lg"
      size="md"
    />
  );
}
