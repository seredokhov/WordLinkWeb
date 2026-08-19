export interface UserData {
  id?: string;
  name: string;
  login: string;
  lastTestDate?: string,
  createdAt?: string;
  wordsCount?: number,
  password?: number
}

export interface LoginResponse {
  success: boolean,
  token: string
}

export interface WordData {
  id?: string,
  word: string,
  translate: string,
  ownerLogin: string,
  progress?: number,
  isFavorite: boolean,
  isLearned: boolean,
  lastUpdate: string
}

export interface DictionaryData {
  id?: string,
  title: string,
  wordsCount?: number,
  createdAt?: string
}

export interface DictionaryWordData {
  id?: string,
  dictionaryId?: string,
  word: string,
  translate: string,
  createdAt?: string
}

export interface ConfirmationPopupData {
  title: string,
  message: string,
  onConfirm: () => void,
}
