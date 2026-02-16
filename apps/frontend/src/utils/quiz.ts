import type { QuizBlock } from "@pokemon-quiz/interface";

export const getInitialBlock = (
  type: "text" | "image" | "youtube" | "audio",
): QuizBlock => {
  switch (type) {
    case "text":
      return {
        type: "text",
        content: "",
      };
    case "image":
      return {
        type: "image",
        imageUrl: "",
      };
    case "youtube":
      return {
        type: "youtube",
        embedUrl: "",
      };
    case "audio":
      return {
        type: "audio",
        audioUrl: "",
      };
  }
};
