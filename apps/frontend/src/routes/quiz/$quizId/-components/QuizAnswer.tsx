import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type {
  QuizBlock,
  QuizBlockAudio,
  QuizBlockImage,
  QuizBlockText,
  QuizBlockYoutube,
} from "@pokemon-quiz/interface";

interface QuizAnswerProps {
  answers: {
    number: number;
    blocks: QuizBlock[];
  }[];
  answerNumber?: number;
  onAnswerChange?: (answerNumber: number) => void;
}

const QuizAnswerTextBlock = ({ block }: { block: QuizBlockText }) => {
  return (
    <pre className="text-base whitespace-pre-wrap break-all">
      {block.content}
    </pre>
  );
};

const QuizAnswerImageBlock = ({ block }: { block: QuizBlockImage }) => {
  return <img src={block.imageUrl} className="w-full" />;
};

const QuizAnswerYoutubeBlock = ({ block }: { block: QuizBlockYoutube }) => {
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

const QuizAnswerAudioBlock = ({ block }: { block: QuizBlockAudio }) => {
  return <audio src={block.audioUrl} controls></audio>;
};

const QuizAnswer = ({
  answers,
  answerNumber,
  onAnswerChange,
}: QuizAnswerProps) => {
  return (
    <RadioGroup
      value={answerNumber?.toString() ?? ""}
      onValueChange={(newValue) => {
        onAnswerChange?.(Number(newValue));
      }}
    >
      <div className="flex flex-col gap-4">
        {answers.map((answer) => (
          <div key={answer.number} className="flex flex-row items-center gap-2">
            <div className="relative flex justify-center items-center">
              <RadioGroupItem
                value={answer.number.toString()}
                id={answer.number.toString()}
                className="border-foreground size-5 [&_svg]:size-3"
              />
              <span className="absolute text-sm">{answer.number}</span>
            </div>
            <Label
              htmlFor={answer.number.toString()}
              className="font-normal text-base flex flex-col items-start"
            >
              {answer.blocks.map((block, blockIndex) => {
                switch (block.type) {
                  case "text":
                    return (
                      <QuizAnswerTextBlock key={blockIndex} block={block} />
                    );
                  case "image":
                    return (
                      <QuizAnswerImageBlock key={blockIndex} block={block} />
                    );
                  case "youtube":
                    return (
                      <QuizAnswerYoutubeBlock key={blockIndex} block={block} />
                    );
                  case "audio":
                    return (
                      <QuizAnswerAudioBlock key={blockIndex} block={block} />
                    );
                  default:
                    return null;
                }
              })}
            </Label>
          </div>
        ))}
      </div>
    </RadioGroup>
  );
};

export { QuizAnswer };
