import { createFileRoute } from "@tanstack/react-router";
import { QuizQuestion } from "./-components/QuizQuestion";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/quiz/$quizId/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-4 py-8 flex flex-col gap-8">
      <div className="flex justify-center items-center size-12 border rounded-md">
        <h1 className="text-2xl font-semibold">1</h1>
      </div>
      <QuizQuestion
        questionBlocks={[
          {
            id: "1",
            type: "text",
            content: "다음 음악은 한 도로의 BGM이다.",
          },
          {
            id: "2",
            type: "audio",
            audioUrl:
              "https://jetta.vgmtreasurechest.com/soundtracks/pokemon-game-boy-pok-mon-sound-complete-set-play-cd/sgalcfte/1-01.%20Opening.mp3",
          },
          {
            id: "3",
            type: "text",
            content: "이 도로에 대한 설명으로 적절하지 않은 것은?",
          },
          {
            id: "4",
            type: "image",
            imageUrl:
              "https://mblogthumb-phinf.pstatic.net/20120111_238/fennel9_1326269493089Tt3aJ_JPEG/d3.jpg?type=w420",
          },
        ]}
      />
      <div className="flex flex-col">
        <RadioGroup>
          <div className="flex flex-row items-center gap-2">
            <RadioGroupItem value="1" id="1" />
            <Label htmlFor="1" className="font-normal text-base">
              ① 포켓몬스터 DP에 등장한다.
            </Label>
          </div>
          <div className="flex flex-row items-center gap-2">
            <RadioGroupItem value="2" id="2" />
            <Label htmlFor="2" className="font-normal text-base">
              ② 이 도로에는 자전거 없이 올라갈 수 없는 지형이 있다.
            </Label>
          </div>
        </RadioGroup>
      </div>
      <div className="self-end flex flex-row items-center gap-2">
        <Button variant="destructive">포기</Button>
        <Button>제출</Button>
      </div>
    </div>
  );
}
