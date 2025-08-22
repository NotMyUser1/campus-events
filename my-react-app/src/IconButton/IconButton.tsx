import './IconButton.css';
import React from 'react';

export default function IconButton({icon, label, onClick}: {icon: React.ReactNode, label: string | null, onClick: () => void}) {
    return (
        <button className="icon-button" onClick={onClick}>
            {icon}
            {label && <div className="icon-button-label">{label}</div>}
        </button>
    );
}