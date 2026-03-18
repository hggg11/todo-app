import type { Priority } from "../types/todo";
const priorityConfig: Record<Priority, { label: string; className: string }> = {
    HIGH: { label: '高', className: 'bg-red-100 text-red-700' },
    MEDIUM: { label: '中', className: 'bg-yellow-100 text-yellow-700' },
    LOW: { label: '低', className: 'bg-green-100 text-green-700' },
};
export default function PriorityBadge({ priority }: { priority: Priority }) {
    const { label, className } = priorityConfig[priority];
    return (
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${className}`}>
        {label}
        </span>
    );
}