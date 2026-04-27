// Falls du schon Interfaces für Azubi und Dienst hast, kannst du die hier importieren.
// Ansonsten lassen wir sie erstmal als 'any', damit es keinen Fehler wirft.

export interface Zuweisung {
  id?: number;
  dienstId: number;
  azubiId?: number | null;
  datum: string;
  istFeiertag: boolean;
}
