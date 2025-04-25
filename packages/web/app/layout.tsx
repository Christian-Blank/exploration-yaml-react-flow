import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Schema-First Knowledge Graph System',
  description: 'A schema-first approach to building knowledge graph systems',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 