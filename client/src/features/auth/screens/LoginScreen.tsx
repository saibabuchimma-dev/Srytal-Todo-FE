import { Paper } from '@mantine/core';
import LoginForm from '../components/LoginForm';
import LoginVideo from '@/assets/images/vdo.mp4';

export default function LoginScreen() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={LoginVideo} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center">
        {/* Login Form */}
        <div className="ml-8 w-full max-w-md md:ml-16 lg:ml-24">
          <Paper
            radius="xl"
            shadow="xl"
            className="w-full max-w-md rounded-3xl border border-white/20 bg-white/90 p-12 backdrop-blur-xl"
          >
            <LoginForm />
          </Paper>
        </div>
      </div>
    </div>
  );
}
