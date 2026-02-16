import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createFileRoute } from "@tanstack/react-router";
import { QuizListItem } from "./-components/QuizListItem";
import { useQuery } from "@tanstack/react-query";
import { api_getProblems } from "@/apis/problems";
import { Reorder } from "motion/react";
import { useState } from "react";

export const Route = createFileRoute("/quiz/list")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: problems } = useQuery({
    ...api_getProblems.queryOptions(null),
    refetchInterval: 1000 * 5,
  });

  const [tab, setTab] = useState<"default" | "score">("default");

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
      <div className="flex flex-col">
        <Tabs
          className="px-4"
          value={tab}
          onValueChange={(newValue) => {
            setTab(newValue as "default" | "score");
          }}
        >
          <TabsList>
            <TabsTrigger value="default">번호순</TabsTrigger>
            <TabsTrigger value="score">배점순</TabsTrigger>
          </TabsList>
        </Tabs>
        <Reorder.Group
          axis="y"
          as="div"
          values={problems?.map((problem) => problem.number) ?? []}
          onReorder={() => { }}
          className="p-4 flex flex-col gap-2"
        >
          {[...(problems ?? [])]
            .sort((a, b) =>
              tab === "score" ? a.score - b.score : a.number - b.number,
            )
            .map((problem) => (
              <QuizListItem
                key={problem.number}
                number={problem.number}
                tags={[problem.tag]}
                questionPreview="다음 BGM이 흘러나오는 맵으로 적절한 것은?"
                score={problem.score}
              />
            ))}
        </Reorder.Group>
      </div>
    </div>
  );
}
