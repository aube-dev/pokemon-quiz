import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { QuizListItem } from "./-components/QuizListItem";

export const Route = createFileRoute("/quiz/list")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="px-4 py-8 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">퀴즈 리스트</h1>
      <Tabs defaultValue="default">
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
