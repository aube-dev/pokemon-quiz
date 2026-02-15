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
  answers: { id: string; blocks: QuizBlock[] }[];
}

const QuizAnswerTextBlock = ({ block }: { block: QuizBlockText }) => {
  return <span className="text-base break-all">{block.content}</span>;
};

const QuizAnswerImageBlock = ({ block }: { block: QuizBlockImage }) => {
  return <img src={block.imageUrl} />;
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

const QuizAnswer = ({ answers }: QuizAnswerProps) => {
  return (
    <RadioGroup>
      <div className="flex flex-col gap-8">
        {answers.map((answer) => (
          <div key={answer.id} className="flex flex-row items-center gap-2">
            <RadioGroupItem value={answer.id} id={answer.id} />
            <Label
              htmlFor={answer.id}
              className="font-normal text-base flex flex-col items-start"
            >
              {answer.blocks.map((block) => {
                switch (block.type) {
                  case "text":
                    return <QuizAnswerTextBlock key={block.id} block={block} />;
                  case "image":
                    return (
                      <QuizAnswerImageBlock key={block.id} block={block} />
                    );
                  case "youtube":
                    return (
                      <QuizAnswerYoutubeBlock key={block.id} block={block} />
                    );
                  case "audio":
                    return (
                      <QuizAnswerAudioBlock key={block.id} block={block} />
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
