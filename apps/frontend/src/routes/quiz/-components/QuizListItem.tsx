import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface QuizListItemProps {
  number: number;
  tags: string[];
  questionPreview: string;
  score: number;
}

const QuizListItem = ({
  number,
  tags,
  questionPreview,
  score,
}: QuizListItemProps) => {
  return (
    <div className="py-2 px-3 rounded-sm backdrop-blur-sm border flex flex-row gap-4 items-center justify-between">
      <div className="size-8 rounded-sm border flex justify-center items-center">
        <span className="font-semibold">{number}</span>
      </div>
      <div className="flex flex-col items-start gap-1 flex-1">
        {tags.map((tag) => (
          <Badge key={tag} className="rounded-md" variant="outline">
            {tag}
          </Badge>
        ))}
        <div className="blur">
          <span className="text-sm">{questionPreview}</span>
        </div>
        <span className="text-sm">
          현재 배점 <strong>{score}</strong>점
        </span>
      </div>
      <Button>도전</Button>
    </div>
  );
};

export { QuizListItem };
