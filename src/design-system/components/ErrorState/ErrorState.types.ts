import type { ReactNode } from 'react';

export type HeadingLevel = 2 | 3 | 4;

export interface ErrorStateProps {
  title: string;
  description?: string;
  action?: ReactNode;
  headingLevel?: HeadingLevel;
}
