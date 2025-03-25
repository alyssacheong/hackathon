export function createEventId(): string;
export const INITIAL_EVENTS: Array<{
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
}>; 