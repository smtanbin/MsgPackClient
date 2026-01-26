'use client';

import { useRouter } from 'next/navigation';

export default function DefaultPage() {
  const router = useRouter();
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-primary-50">
      <div className="bg-white/80 rounded-xl shadow-lg p-10 flex flex-col items-center gap-6 border border-black/10">
        <h1 className="text-3xl font-bold text-primary">Welcome to MsgPack Client</h1>
        <p className="text-zinc-700 text-lg">A modern, modular API testing and MsgPack encoder/decoder tool.</p>
        <button
          className="px-8 py-3 rounded-lg bg-primary text-white text-lg font-semibold shadow hover:bg-primary/90 transition-all active:scale-95"
          onClick={() => router.push('/home')}
        >
          Open Client
        </button>
      </div>
    </main>
  );
}
