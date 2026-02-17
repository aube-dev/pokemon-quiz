import type {
  QuizBlock,
  QuizBlockAudio,
  QuizBlockImage,
  QuizBlockText,
  QuizBlockYoutube,
} from "@pokemon-quiz/interface";

interface QuizQuestionProps {
  blocks: QuizBlock[];
}

const QuizQuestionTextBlock = ({ block }: { block: QuizBlockText }) => {
  return (
    <pre className="text-base whitespace-pre-wrap break-all">
      {block.content}
    </pre>
  );
};

const QuizQuestionImageBlock = ({ block }: { block: QuizBlockImage }) => {
  return <img src={block.imageUrl} className="w-full" />;
};

const QuizQuestionYoutubeBlock = ({ block }: { block: QuizBlockYoutube }) => {
  return (
    <iframe
      width="560"
      height="315"
      src={block.embedUrl}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
};

const QuizQuestionAudioBlock = ({ block }: { block: QuizBlockAudio }) => {
  return <audio src={block.audioUrl} controls></audio>;
};

const QuizQuestion = ({ blocks }: QuizQuestionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((block, blockIndex) => {
        switch (block.type) {
          case "text":
            return <QuizQuestionTextBlock key={blockIndex} block={block} />;
          case "image":
            return <QuizQuestionImageBlock key={blockIndex} block={block} />;
          case "youtube":
            return <QuizQuestionYoutubeBlock key={blockIndex} block={block} />;
          case "audio":
            return <QuizQuestionAudioBlock key={blockIndex} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export { QuizQuestion };
