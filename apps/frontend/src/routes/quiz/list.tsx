import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { QuizListItem } from "./-components/QuizListItem";

export const Route = createFileRoute("/quiz/list")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-start relative">
        <img
          src="/quiz-list-header.jpg"
          className="w-48 self-center opacity-80"
        />
        <div className="bottom-8 flex justify-center items-center px-4 py-2 border rounded-md absolute backdrop-blur-xs">
          <h1 className="text-xl font-semibold">퀴즈 리스트</h1>
        </div>
      </div>
      <Tabs defaultValue="default" className="p-4">
        <TabsList>
          <TabsTrigger value="default">번호순</TabsTrigger>
          <TabsTrigger value="score">배점순</TabsTrigger>
        </TabsList>
        <TabsContent value="default" className="flex flex-col gap-2">
          <QuizListItem
            number={1}
            tags={["BGM"]}
            questionPreview="다음 BGM이 흘러나오는 맵으로 적절한 것은?"
            score={4.51}
          />
          <QuizListItem
            number={1}
            tags={["BGM"]}
            questionPreview="다음 BGM이 흘러나오는 맵으로 적절한 것은?"
            score={4.51}
          />
          <QuizListItem
            number={1}
            tags={["BGM"]}
            questionPreview="다음 BGM이 흘러나오는 맵으로 적절한 것은?"
            score={4.51}
          />
          <QuizListItem
            number={1}
            tags={["BGM"]}
            questionPreview="다음 BGM이 흘러나오는 맵으로 적절한 것은?"
            score={4.51}
          />
          <QuizListItem
            number={1}
            tags={["BGM"]}
            questionPreview="다음 BGM이 흘러나오는 맵으로 적절한 것은?"
            score={4.51}
          />
          <QuizListItem
            number={1}
            tags={["BGM"]}
            questionPreview="다음 BGM이 흘러나오는 맵으로 적절한 것은?"
            score={4.51}
          />
        </TabsContent>
        <TabsContent value="score" className="flex flex-col gap-2">
          <QuizListItem
            number={1}
            tags={["BGM"]}
            questionPreview="다음 BGM이 흘러나오는 맵으로 적절한 것은?"
            score={4.51}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
