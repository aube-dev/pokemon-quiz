import type { UserId } from "@/types/users";
import { Reorder } from "motion/react";

interface LeaderboardItemProps {
  id: UserId;
  nickname: string;
  totalScore: number;
  ranking: number;
}

const LeaderboardItem = ({
  id,
  nickname,
  totalScore,
  ranking,
}: LeaderboardItemProps) => {
  return (
    <Reorder.Item
      as="div"
      value={id}
      dragListener={false}
      className="flex flex-row items-center justify-between px-4 h-12 rounded-sm border backdrop-blur-xs"
    >
      <div className="flex flex-row gap-4">
        <span className="font-semibold">{ranking}</span>
        <span className="font-semibold">{nickname}</span>
      </div>
      <span className="text-sm">{totalScore}점</span>
    </Reorder.Item>
  );
};

export { LeaderboardItem };
