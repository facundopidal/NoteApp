export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date | string;
  updatedAt: Date | string;
  groupId: string;
  userId: string;
}
