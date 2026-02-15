import { createFileRoute } from "@tanstack/react-router";
import { QuizQuestion } from "./-components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { QuizAnswer } from "./-components/QuizAnswer";

export const Route = createFileRoute("/quiz/$quizId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-4 py-8 flex flex-col gap-12">
      <div className="flex justify-center items-center size-12 border rounded-md">
        <h1 className="text-2xl font-semibold">1</h1>
      </div>
      <QuizQuestion
        blocks={[
          {
            id: "block-1",
            type: "text",
            content: "다음 음악은 한 도로의 BGM이다.",
          },
          {
            id: "block-2",
            type: "audio",
            audioUrl:
              "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-game-boy-pok-mon-sound-complete-set-play-cd/sgalcfte/1-01.%20Opening.mp3",
          },
          {
            id: "block-3",
            type: "text",
            content: "이 도로에 대한 설명으로 적절하지 않은 것은?",
          },
          {
            id: "block-4",
            type: "image",
            imageUrl:
              "https://mblogthumb-phinf.pstatic.net/20120111_238/fennel9_1326269493089Tt3aJ_JPEG/d3.jpg?type=w420",
          },
        ]}
      />
      <QuizAnswer
        answers={[
          {
            id: "answer-1",
            blocks: [
              {
                id: "block-5",
                type: "text",
                content: "다음 음악은 한 도로의 BGM이다.",
              },
              {
                id: "block-6",
                type: "audio",
                audioUrl:
                  "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-game-boy-pok-mon-sound-complete-set-play-cd/sgalcfte/1-01.%20Opening.mp3",
              },
              {
                id: "block-7",
                type: "text",
                content: "이 도로에 대한 설명으로 적절하지 않은 것은?",
              },
              {
                id: "block-8",
                type: "image",
                imageUrl:
                  "https://mblogthumb-phinf.pstatic.net/20120111_238/fennel9_1326269493089Tt3aJ_JPEG/d3.jpg?type=w420",
              },
            ],
          },
        ]}
      />
      <div className="self-end flex flex-row items-center gap-2">
        <Button variant="destructive">포기</Button>
        <Button>제출</Button>
      </div>
    </div>
  );
}
