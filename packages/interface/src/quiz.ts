export type QuizBlockText = {
  type: "text";
  content: string;
};

export type QuizBlockImage = {
  type: "image";
  imageUrl: string;
};

export type QuizBlockYoutube = {
  type: "youtube";
  embedUrl: string;
};

export type QuizBlockAudio = {
  type: "audio";
  audioUrl: string;
};

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
