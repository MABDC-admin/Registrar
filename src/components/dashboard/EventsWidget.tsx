interface Event {
  id: string;
  title: string;
  date: string;
  icon: string;
}

interface EventsWidgetProps {
  events: Event[];
  delay?: number;
}

export default function EventsWidget({ events, delay = 0 }: EventsWidgetProps) {
  return (
    <div 
      className="stats-card widget-enter p-4"
      style={{ animationDelay: `${delay * 0.1}s`, opacity: 0 }}
    >
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-semibold text-foreground">Upcoming Events</h3>
        <div className="flex gap-1">
          <span className="w-2 h-2 rounded-full bg-primary" />
          <span className="w-2 h-2 rounded-full bg-primary/50" />
        </div>
      </div>
      <div className="space-y-3">
        {events.map((event) => (
          <div 
            key={event.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <span className="text-2xl">{event.icon}</span>
            <div>
              <p className="text-sm font-medium text-foreground">{event.title}</p>
              <p className="text-xs text-muted-foreground">{event.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
