import { type CSSProperties, type ComponentPropsWithoutRef } from 'react';
import { useSelector } from 'react-redux';
import { type RootState } from '../../features/store';
 
type InputProps = {
  maxLength?: number;
  classes?: string;
  styles?: CSSProperties;
} & ComponentPropsWithoutRef<'input'>;
 
export default function Input(props: InputProps) {
  const theme = useSelector((state: RootState) => state.theme);
 
  const length = props.maxLength || 10;
 
  return (
    <input
      {...props}
      className={`input-${theme.name}`}
      style={{ width: `${length}ch`, ...props.styles }}
    />
  );
}