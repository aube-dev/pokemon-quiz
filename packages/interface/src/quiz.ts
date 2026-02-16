interface QuizBlockBase {
  id: string;
}

export interface QuizBlockText extends QuizBlockBase {
  type: "text";
  content: string;
}

export interface QuizBlockImage extends QuizBlockBase {
  type: "image";
  imageUrl: string;
}

export interface QuizBlockYoutube extends QuizBlockBase {
  type: "youtube";
  embedUrl: string;
}

export interface QuizBlockAudio extends QuizBlockBase {
  type: "audio";
  audioUrl: string;
}

export type QuizBlock =
  | QuizBlockText
  | QuizBlockImage
  | QuizBlockYoutube
  | QuizBlockAudio;

export interface CreateProblemDto {
  number?: number;
  title: string;
  category: string;
  score: number;
  content: QuizBlock[];
  answer: number;
}

export interface SubmitAnswerDto {
  choice: number;
}

export interface UserLoginDto {
  sn: string;
  username?: string;
}
