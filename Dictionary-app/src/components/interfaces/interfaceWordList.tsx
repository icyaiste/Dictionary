interface Phonetic {
    text: string;
    audio?: string; // audio is optional
  }
  
  interface Definition {
    definition: string;
    example?: string; // example is optional
    synonyms: string[];
    antonyms: string[];
  }
  
  interface Meaning {
    partOfSpeech: string;
    definitions: Definition[];
  }
  
  interface Word {
    word: string;
    phonetic: string;
    phonetics: Phonetic[];
    origin?: string; // origin is optional
    meanings: Meaning[];
  }
  
    export type { Word, Meaning, Definition, Phonetic };