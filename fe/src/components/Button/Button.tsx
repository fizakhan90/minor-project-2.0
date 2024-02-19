import React, { CSSProperties } from 'react';
import styles from './styles.module.scss';
import cn from 'classnames';

interface ButtonProps {
    readonly Icon?: React.FC<any>;
    readonly onClick: React.MouseEventHandler<HTMLButtonElement>;
    readonly className?: string;
    readonly text?: string;
    readonly style?: CSSProperties;
}

export const Button = ({ Icon, onClick, className, text, style }: ButtonProps) => (
    <button onClick={onClick} className={cn(styles.Button, className)} style={style}>
        {Icon && <Icon />}
        <span>{text}</span>
    </button>
);
