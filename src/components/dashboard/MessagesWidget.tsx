interface Message {
  id: string;
  title: string;
  icon: string;
}

interface MessagesWidgetProps {
  messages: Message[];
  delay?: number;
}

export default function MessagesWidget({ messages, delay = 0 }: MessagesWidgetProps) {
  return (
    <div 
      className="stats-card widget-enter p-4"
      style={{ animationDelay: `${delay * 0.1}s`, opacity: 0 }}
    >
      <h3 className="text-lg font-semibold text-foreground mb-3">Messages</h3>
      <div className="space-y-2">
        {messages.map((message) => (
          <div 
            key={message.id}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <span className="text-xl">{message.icon}</span>
            <span className="text-sm text-foreground">{message.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
