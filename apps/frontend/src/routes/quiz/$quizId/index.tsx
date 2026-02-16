import { createFileRoute } from "@tanstack/react-router";
import { QuizQuestion } from "./-components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { QuizAnswer } from "./-components/QuizAnswer";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  api_getProblemDetail,
  api_giveUpProblem,
  api_submitProblem,
} from "@/apis/problems";
import type { ProblemId } from "@/types/problems";
import { useState } from "react";
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

export const Route = createFileRoute("/quiz/$quizId/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { quizId: quizIdFromParams } = Route.useParams();
  const navigate = Route.useNavigate();

  const quizId = quizIdFromParams as ProblemId;

  const { data: problem } = useSuspenseQuery({
    ...api_getProblemDetail.queryOptions({ id: quizId }),
  });

  const [answerNumber, setAnswerNumber] = useState<number | undefined>(
    undefined,
  );

  const giveUpMutation = api_giveUpProblem.useMutation({
    onSuccess: () => {
      navigate({ to: "/quiz/list", replace: true });
    },
  });

  const submitMutation = api_submitProblem.useMutation({
    onSuccess: () => {
      navigate({ to: "/quiz/list", replace: true });
    },
  });

  return (
    <div className="py-8 flex flex-col">
      <div className="flex flex-col items-center justify-center relative">
        <img src="/quiz-header.jpg" className="w-48" />
        <div className="flex justify-center items-center size-12 border rounded-md absolute backdrop-blur-xs">
          <h1 className="text-xl font-semibold">{problem.number}</h1>
        </div>
      </div>
      <div className="z-20 sticky top-0 p-4 bg-background/50 border-b backdrop-blur-xs">
        <h2 className="text-lg font-semibold">
          {problem.number}. {problem.title}
        </h2>
      </div>
      <div className="flex flex-col gap-4 px-4 mt-4">
        <QuizQuestion blocks={problem.content} />
      </div>
      <div className="px-4 mt-12">
        <QuizAnswer
          answers={problem.answer.options}
          answerNumber={answerNumber}
          onAnswerChange={setAnswerNumber}
        />
      </div>
      <div className="mt-12 px-4 self-end flex flex-row items-center gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">포기</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {problem.number}번 문제를 포기하시겠습니까?
              </AlertDialogTitle>
              <AlertDialogDescription>
                한 번 포기하면 다시 도전할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">취소</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <AsyncButton
                  onClick={async () => {
                    await giveUpMutation.mutateAsync({
                      id: quizId,
                    });
                  }}
                >
                  포기
                </AsyncButton>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button disabled={answerNumber === undefined}>제출</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                정답을 {answerNumber}번으로 제출하시겠습니까?
              </AlertDialogTitle>
              <AlertDialogDescription>
                한 번 제출하면 다시 도전할 수 없습니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline">취소</Button>
              </AlertDialogCancel>
              <AlertDialogAction asChild>
                <AsyncButton
                  onClick={async () => {
                    if (answerNumber === undefined) return;
                    await submitMutation.mutateAsync({
                      id: quizId,
                      choice: answerNumber,
                    });
                  }}
                >
                  제출
                </AsyncButton>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
