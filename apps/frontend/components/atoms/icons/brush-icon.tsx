interface IconProps {
  className?: string;
}

export default function BrushIcon({ className = 'w-6 h-6' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={2}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.53 16.122l9.47-9.47m0 0l1.414 1.414m-1.414-1.414L17.112 8.536M4.5 18.75h15"
      />
    </svg>
  );
}
