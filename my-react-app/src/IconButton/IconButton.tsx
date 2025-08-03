import './IconButton.css';

const IconButton = ({icon, label = null, onClick}: {icon: React.ReactNode, label: string | null, onClick: () => void}) => (
    <button className="icon-button" onClick={onClick} justify-content="right">
        {icon}
        {label && <div className="icon-button-label">{label}</div>}
    </button>
);

export default IconButton;