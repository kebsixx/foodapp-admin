export type Feedback = {
  id: string;
  created_at: string;
  feedback: string;
  user_id?: string;
  user_email?: string;
  status: 'pending' | 'reviewed' | 'resolved';
};