export type Note = {
  id: number;
  title: string | null;
  desc: string | null;
  content: string | null;
  date: Date;
};

export type SaveNoteProps = {
  id: number | null;
  title: string | null;
  content: string | null;
  desc: string | null;
};
