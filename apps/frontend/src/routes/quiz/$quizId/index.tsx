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
    <div className="px-4 py-8 flex flex-col gap-12 relative">
      <div className="flex flex-col items-center justify-center relative">
        <img src="/quiz-header.jpg" className="w-48" />
        <div className="flex justify-center items-center size-12 border rounded-md absolute backdrop-blur-xs">
          <h1 className="text-xl font-semibold">27</h1>
        </div>
      </div>
      <QuizQuestion blocks={problem.content} />
      <QuizAnswer
        answers={[
          {
            number: 1,
            blocks: [
              {
                type: "text",
                content: "다음 음악은 한 도로의 BGM이다.",
              },
              {
                type: "audio",
                audioUrl:
                  "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-game-boy-pok-mon-sound-complete-set-play-cd/sgalcfte/1-01.%20Opening.mp3",
              },
              {
                type: "text",
                content: "이 도로에 대한 설명으로 적절하지 않은 것은?",
              },
              {
                type: "image",
                imageUrl:
                  "https://mblogthumb-phinf.pstatic.net/20120111_238/fennel9_1326269493089Tt3aJ_JPEG/d3.jpg?type=w420",
              },
            ],
          },
        ]}
        answerNumber={answerNumber}
        onAnswerChange={setAnswerNumber}
      />
      <div className="self-end flex flex-row items-center gap-2">
        <AsyncButton
          variant="destructive"
          onClick={async () => {
            await giveUpMutation.mutateAsync({
              id: quizId,
            });
          }}
        >
          포기
        </AsyncButton>
        <AsyncButton
          disabled={answerNumber === undefined}
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
      </div>
    </div>
  );
}
