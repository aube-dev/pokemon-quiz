interface QuizQuestionBlockBase {
  id: string;
}

export interface QuizQuestionBlockText extends QuizQuestionBlockBase {
  type: "text";
  content: string;
}

export interface QuizQuestionBlockImage extends QuizQuestionBlockBase {
  type: "image";
  imageUrl: string;
}

export interface QuizQuestionBlockYoutube extends QuizQuestionBlockBase {
  type: "youtube";
  embedUrl: string;
}

export interface QuizQuestionBlockAudio extends QuizQuestionBlockBase {
  type: "audio";
  audioUrl: string;
}

export type QuizQuestionBlock =
  | QuizQuestionBlockText
  | QuizQuestionBlockImage
  | QuizQuestionBlockYoutube
  | QuizQuestionBlockAudio;
