import { api_getLeaderboard } from "@/apis/leaderboards";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { LeaderboardItem } from "./-components/LeaderboardItem";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { Reorder } from "motion/react";

export const Route = createFileRoute("/quiz/leaderboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const {
    data: leaderboard,
    isFetching,
    refetch,
  } = useSuspenseQuery({
    ...api_getLeaderboard.queryOptions(null),
    refetchInterval: 1000 * 5,
  });

  const leaderboardWithRanking = (() => {
    const newLeaderboard: ((typeof leaderboard)[number] & {
      ranking: number;
    })[] = [];
    [...leaderboard]
      .sort((a, b) => b.totalScore - a.totalScore)
      .forEach((user, index) => {
        if (
          index > 0 &&
          user.totalScore === newLeaderboard[index - 1].totalScore
        ) {
          newLeaderboard.push({
            ...user,
            ranking: newLeaderboard[index - 1].ranking,
          });
        } else {
          newLeaderboard.push({
            ...user,
            ranking: index + 1,
          });
        }
      });
    return newLeaderboard;
  })();

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col items-center justify-center relative">
        <img
          src="/leaderboard-header.png"
          className="w-60 self-center opacity-80"
        />
        <div className="flex justify-center items-center px-4 py-2 border rounded-md absolute backdrop-blur-xs">
          <h1 className="text-xl font-semibold">리더보드</h1>
        </div>
      </div>
      <Reorder.Group
        as="div"
        values={leaderboard.map((user) => user.id)}
        onReorder={() => {}}
        className="flex flex-col gap-2 p-4 -translate-y-30"
      >
        {leaderboardWithRanking.map((user) => (
          <LeaderboardItem
            key={user.id}
            id={user.id}
            nickname={user.username ?? ""}
            totalScore={user.totalScore}
            ranking={user.ranking}
          />
        ))}
      </Reorder.Group>
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 right-4 bg-transparent backdrop-blur-xs"
        onClick={() => {
          refetch();
        }}
      >
        <RefreshCcw className={cn(isFetching ? "animate-spin" : undefined)} />
      </Button>
    </div>
  );
}
