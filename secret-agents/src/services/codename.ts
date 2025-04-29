import { User } from '../models/user';

const CODENAME_PREFIXES = [
  'Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo',
  'Foxtrot', 'Golf', 'Hotel', 'India', 'Juliet',
  'Kilo', 'Lima', 'Mike', 'November', 'Oscar',
  'Papa', 'Quebec', 'Romeo', 'Sierra', 'Tango',
  'Uniform', 'Victor', 'Whiskey', 'X-Ray', 'Yankee', 'Zulu'
];

const CODENAME_SUFFIXES = [
  'One', 'Two', 'Three', 'Four', 'Five',
  'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eagle', 'Hawk', 'Falcon', 'Wolf', 'Bear',
  'Lion', 'Tiger', 'Panther', 'Cobra', 'Viper'
];

export async function generateCodename(): Promise<string> {
  let attempts = 0;
  const maxAttempts = 100; // Prevenir bucle infinito

  while (attempts < maxAttempts) {
    // Generar nombre en clave aleatorio
    const prefix = CODENAME_PREFIXES[Math.floor(Math.random() * CODENAME_PREFIXES.length)];
    const suffix = CODENAME_SUFFIXES[Math.floor(Math.random() * CODENAME_SUFFIXES.length)];
    const codename = `${prefix}-${suffix}`;

    // Verificar si ya existe
    const existingUser = await User.findOne({ codename });
    if (!existingUser) {
      return codename;
    }

    attempts++;
  }

  // Si no se encuentra un nombre único después de maxAttempts
  throw new Error('Could not generate unique codename');
}