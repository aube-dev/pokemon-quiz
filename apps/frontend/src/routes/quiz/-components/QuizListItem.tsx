import { api_challengeProblem } from "@/apis/problems";
import { AsyncButton } from "@/components/AsyncButton";
import { Badge } from "@/components/ui/badge";
import type { ProblemNumber } from "@/types/problems";
import { useNavigate } from "@tanstack/react-router";
import { Reorder } from "motion/react";

interface QuizListItemProps {
  number: ProblemNumber;
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
  const navigate = useNavigate();

  const challengeMutation = api_challengeProblem.useMutation({
    onSuccess: (response) => {
      navigate({ to: "/quiz/$quizId", params: { quizId: response.problemId } });
    },
  });

  return (
    <Reorder.Item
      as="div"
      value={number}
      dragListener={false}
      className="py-2 px-3 rounded-sm backdrop-blur-sm border flex flex-row gap-4 items-center justify-between"
    >
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
      <AsyncButton
        onClick={async () => {
          await challengeMutation.mutateAsync({ number });
        }}
      >
        도전
      </AsyncButton>
    </Reorder.Item>
  );
};

export { QuizListItem };
