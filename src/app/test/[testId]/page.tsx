import { use } from 'react';
import { Metadata, Viewport } from 'next';
import TestPageClient from './TestPageClient';

interface Props {
  params: Promise<{
    testId: string;
  }>;
}

export const metadata: Metadata = {
  title: 'Прохождение теста',
  description: 'Страница прохождения теста',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function TestPage({ params }: Props) {
  const resolvedParams = use(params);
  const testId = parseInt(resolvedParams.testId);

  return <TestPageClient testId={testId} />;
} 