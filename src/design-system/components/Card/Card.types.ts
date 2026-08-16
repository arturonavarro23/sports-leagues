import type { HTMLAttributes, ReactNode } from 'react';

export type CardElement = 'div' | 'article' | 'section';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: CardElement;
  isInteractive?: boolean;
  isSelected?: boolean;
  children: ReactNode;
}
