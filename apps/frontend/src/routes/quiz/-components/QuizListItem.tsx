import { api_challengeProblem } from "@/apis/problems";
import { AsyncButton } from "@/components/AsyncButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { UserProblemStatus } from "@/constants/userProblems";
import { cn } from "@/lib/utils";
import type { ProblemNumber } from "@/types/problems";
import { useNavigate } from "@tanstack/react-router";
import { Reorder } from "motion/react";

interface QuizListItemProps {
  number: ProblemNumber;
  tags: string[];
  questionPreview: string;
  score: number;
  status?: UserProblemStatus;
  earnedScore?: number;
}

const QuizListItem = ({
  number,
  tags,
  questionPreview,
  score,
  status,
  earnedScore,
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
          <span className="text-sm break-all line-clamp-2">
            {questionPreview}
          </span>
        </div>
        <span className="text-sm">
          현재 배점 <strong>{score}</strong>점
        </span>
      </div>
      {status ? (
        <Button
          className={cn(
            status === UserProblemStatus.CORRECT
              ? "bg-emerald-700"
              : status === UserProblemStatus.WRONG
                ? "bg-destructive"
                : status === UserProblemStatus.GIVEN_UP
                  ? "bg-muted text-foreground"
                  : undefined,
          )}
          disabled
        >
          {status === UserProblemStatus.CORRECT
            ? `${earnedScore}점`
            : status === UserProblemStatus.WRONG
              ? "오답"
              : status === UserProblemStatus.GIVEN_UP
                ? "포기"
                : "도전 중"}
        </Button>
      ) : (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button>도전</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {number}번 문제에 도전하시겠습니까?
              </AlertDialogTitle>
              <AlertDialogDescription>
                포기하거나 제출한 뒤에는 다시 도전할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">닫기</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <AsyncButton
                  onClick={async () => {
                    await challengeMutation.mutateAsync({ number });
                  }}
                >
                  도전
                </AsyncButton>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </Reorder.Item>
  );
};

export { QuizListItem };
