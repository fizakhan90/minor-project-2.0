import React, { CSSProperties, forwardRef } from 'react';
import styles from './styles.module.scss';
import cn from 'classnames';

interface ButtonProps {
  readonly Icon?: React.FC<{ className?: string }>;
  readonly onClick: React.MouseEventHandler<HTMLButtonElement>;
  readonly className?: string;
  readonly text?: string;
  readonly style?: CSSProperties;
  readonly forwardedRef?: React.Ref<HTMLButtonElement>;
  readonly 'aria-label'?: string;
}

export const Button = ({
  Icon,
  onClick,
  className,
  text,
  style,
  forwardedRef,
  'aria-label': ariaLabel
}: ButtonProps) => (
  <button 
    onClick={onClick} 
    className={cn(styles.Button, className)} 
    style={style}
    ref={forwardedRef}
    aria-label={ariaLabel}
  >
    {Icon && <Icon className={styles.ButtonIcon} />}
    <span>{text}</span>
  </button>
);

// Also create a forwardRef version for components that need it
export const ButtonWithRef = forwardRef<HTMLButtonElement, Omit<ButtonProps, 'forwardedRef'>>(
  (props, ref) => <Button {...props} forwardedRef={ref} />
);