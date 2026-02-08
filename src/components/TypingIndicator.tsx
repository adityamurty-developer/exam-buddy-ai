export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-4 py-3">
      <span className="w-2 h-2 rounded-full bg-primary typing-dot" />
      <span className="w-2 h-2 rounded-full bg-primary typing-dot" />
      <span className="w-2 h-2 rounded-full bg-primary typing-dot" />
      <span className="ml-2 text-sm text-muted-foreground">Generating answer...</span>
    </div>
  );
}
