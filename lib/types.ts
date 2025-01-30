export type Note = {
  id: number;
  title: string | null;
  folderId?:number ;
  desc: string | null;
  content: string | null;
  date: Date;
};
export type Folder = {
  id: number;
  title: string;
};

export type SaveNoteProps = {
  id: number | null;
  title: string | null;
  content: string | null;
  desc: string | null;
};
