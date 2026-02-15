import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [info, setInfo] = useState<{
    roomNumber: string;
    nickname: string;
    sn: string;
  }>({
    roomNumber: "",
    nickname: "",
    sn: "",
  });

  return (
    <div className="flex flex-col items-center gap-12 p-4">
      <div className="flex flex-col items-center gap-4">
        <img src="/main-logo.jpg" className="size-60" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row items-center gap-1">
            <Input
              placeholder="생활관 번호"
              className="text-sm"
              value={info.roomNumber}
              onChange={(e) => {
                setInfo((prev) => ({ ...prev, roomNumber: e.target.value }));
              }}
            />
            <Label className="shrink-0">생활관</Label>
          </div>
        </div>
        <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2">
          <Label>닉네임</Label>
          <Input
            className="text-sm"
            placeholder="닉네임"
            value={info.nickname}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, nickname: e.target.value }));
            }}
          />
          <Label>군번</Label>
          <Input
            className="text-sm"
            placeholder="군번"
            value={info.sn}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, sn: e.target.value }));
            }}
          />
        </div>
        <Button disabled={!info.roomNumber || !info.nickname || !info.sn}>
          <LogIn /> 로그인
        </Button>
      </div>
    </div>
  );
}
