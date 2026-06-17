// types.ts
export interface BaseComponentProps {
  label?: string;
  name: string;
  error?: string;
  layout?: 'row' | 'col';
  className?: string;
  rows?: number;
}