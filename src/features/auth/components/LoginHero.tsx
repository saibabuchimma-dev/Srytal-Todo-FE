import { ThemeIcon, Title, Text } from '@mantine/core';
import { HiOutlineCheckCircle, HiOutlineUserGroup, HiOutlineChartBar } from 'react-icons/hi2';
import LoginIllustration from '@/assets/images/img.png';

const features = [
  {
    icon: HiOutlineUserGroup,
    title: 'Manage Employees',
    description: 'Organize employees in one place.',
  },
  {
    icon: HiOutlineCheckCircle,
    title: 'Assign Tasks',
    description: 'Track every task efficiently.',
  },
  {
    icon: HiOutlineChartBar,
    title: 'Analytics',
    description: 'View employee productivity.',
  },
];

export default function LoginHero() {
  return (
    <div className="relative flex h-full flex-col justify-between overflow-hidden rounded-r-[80px] bg-gradient-to-br from-blue-700 via-indigo-700 to-violet-700 p-14 text-white">
      <div>
        <Title order={1} className="!text-5xl font-extrabold">
          SRYTAL
        </Title>

        <Text mt={10} className="text-lg opacity-80">
          Employee Task Management System
        </Text>

        <Title mt={80} className="!text-6xl leading-tight">
          Manage Work.
          <br />
          Boost Productivity.
        </Title>

        <Text mt={25} className="max-w-lg text-lg leading-8 opacity-75">
          Organize employees, assign tasks and improve your company's productivity with one modern
          dashboard.
        </Text>
      </div>

      <img src={LoginIllustration} alt="illustration" className="mx-auto w-[430px] animate-float" />

      <div className="space-y-5">
        {features.map((feature) => (
          <div key={feature.title} className="flex items-center gap-4">
            <ThemeIcon radius="xl" size={50} variant="light">
              <feature.icon size={24} />
            </ThemeIcon>

            <div>
              <Text fw={700}>{feature.title}</Text>

              <Text size="sm" className="opacity-75">
                {feature.description}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
