export interface Dienst {
  id?: number;
  bezeichnung: string;
  beschreibung: string;
  intervall: string;
  wochentage: string;
  icon: string;
  isDeleted?: boolean;
}
