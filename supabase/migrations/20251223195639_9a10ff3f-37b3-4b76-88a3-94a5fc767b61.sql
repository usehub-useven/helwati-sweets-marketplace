-- Enable realtime for notifications table
ALTER TABLE public.notifications REPLICA IDENTITY FULL;

-- Add to realtime publication (if not already added)
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;