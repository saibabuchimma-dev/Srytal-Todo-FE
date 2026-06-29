import { Card, Text, Title } from '@mantine/core';

export default function DashboardScreen() {
  return (
    <Card shadow="sm" radius="lg" withBorder>
      <Title order={3}>Welcome 👋</Title>

      <Text mt="sm">Select an employee from the sidebar to view tasks.</Text>
    </Card>
  );
}
