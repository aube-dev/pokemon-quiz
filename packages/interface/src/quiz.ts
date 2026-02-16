
export interface QuizBlockText {
  type: "text";
  content: string;
}

export interface QuizBlockImage {
  type: "image";
  imageUrl: string;
}

export interface QuizBlockYoutube {
  type: "youtube";
  embedUrl: string;
}

export interface QuizBlockAudio {
  type: "audio";
  audioUrl: string;
}

export type QuizBlock =
  | QuizBlockText
  | QuizBlockImage
  | QuizBlockYoutube
  | QuizBlockAudio;

export interface QuizAnswer {
  options: {
    number: number;
    blocks: QuizBlock[];
  }[];
  correct: number;
}

export interface CreateProblemDto {
  number?: number;
  title: string;
  category: string;
  score: number;
  content: QuizBlock[];
  answer: QuizAnswer;
}
export interface SubmitAnswerDto {
  choice: number;
}

export interface UserLoginDto {
  sn: string;
  username?: string;
}
