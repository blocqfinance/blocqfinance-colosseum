'use client';
import React, { useEffect, useState } from 'react';
import { WalletButton } from '@/solana/solana-provider';

export default function SafeWalletButton() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <WalletButton />;
}
