import { Note } from './note';

export interface Group {
  id: string;
  name: string;
  notes: Note[];
  userId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}
