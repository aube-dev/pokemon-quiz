import type {
  QuizQuestionBlock,
  QuizQuestionBlockAudio,
  QuizQuestionBlockImage,
  QuizQuestionBlockText,
  QuizQuestionBlockYoutube,
} from "@/types/quiz";

interface QuizQuestionProps {
  questionBlocks: QuizQuestionBlock[];
}

const QuizQuestionTextBlock = ({ block }: { block: QuizQuestionBlockText }) => {
  return <span className="text-base break-all">{block.content}</span>;
};

const QuizQuestionImageBlock = ({
  block,
}: {
  block: QuizQuestionBlockImage;
}) => {
  return <img src={block.imageUrl} />;
};

const QuizQuestionYoutubeBlock = ({
  block,
}: {
  block: QuizQuestionBlockYoutube;
}) => {
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

const QuizQuestionAudioBlock = ({
  block,
}: {
  block: QuizQuestionBlockAudio;
}) => {
  return <audio src={block.audioUrl} controls></audio>;
};

const QuizQuestion = ({ questionBlocks }: QuizQuestionProps) => {
  return (
    <div className="flex flex-col gap-4">
      {questionBlocks.map((block) => {
        switch (block.type) {
          case "text":
            return <QuizQuestionTextBlock key={block.id} block={block} />;
          case "image":
            return <QuizQuestionImageBlock key={block.id} block={block} />;
          case "youtube":
            return <QuizQuestionYoutubeBlock key={block.id} block={block} />;
          case "audio":
            return <QuizQuestionAudioBlock key={block.id} block={block} />;
          default:
            return null;
        }
      })}
    </div>
  );
};

export { QuizQuestion };
