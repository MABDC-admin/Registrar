interface Task {
  id: string;
  title: string;
  count: number;
  icon: string;
}

interface TasksWidgetProps {
  tasks: Task[];
  delay?: number;
}

export default function TasksWidget({ tasks, delay = 0 }: TasksWidgetProps) {
  return (
    <div 
      className="stats-card widget-enter p-4"
      style={{ animationDelay: `${delay * 0.1}s`, opacity: 0 }}
    >
      <h3 className="text-lg font-semibold text-foreground mb-3">Tasks Today</h3>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="flex items-center justify-between p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{task.icon}</span>
              <span className="text-sm font-medium text-foreground">{task.title}</span>
            </div>
            <span className="badge-notification">{task.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
