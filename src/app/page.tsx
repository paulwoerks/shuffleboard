"use client";
import { useRouter } from 'next/navigation';
import WelcomeScreen from '@/components/WelcomeScreen';

export default function LandingPage() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/explore');
  };

  return (
    <main className="h-screen w-screen bg-black overflow-hidden">
      <WelcomeScreen onStart={handleStart} />
    </main>
  );
}