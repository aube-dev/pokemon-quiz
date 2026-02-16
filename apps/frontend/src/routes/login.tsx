import { api_login } from "@/apis/users";
import { AsyncButton } from "@/components/AsyncButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createFileRoute } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = Route.useNavigate();

  const [info, setInfo] = useState<{
    roomNumber: string;
    nickname: string;
    sn: string;
  }>({
    roomNumber: "",
    nickname: "",
    sn: "",
  });

  const loginMutation = api_login.useMutation({
    onSuccess: () => {
      navigate({ to: "/quiz/list", replace: true });
    },
  });

  return (
    <div className="flex flex-col items-center gap-8 px-8 py-4">
      <div className="flex flex-col items-center justify-center relative gap-2">
        <img src="/login-header.jpg" />
        {/* <div className="flex justify-center items-center px-4 py-2 border rounded-md absolute backdrop-blur-xs">
          <h1 className="text-xl font-semibold">POKEMON QUIZ</h1>
        </div> */}
      </div>
      <div className="self-stretch flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <Label className="shrink-0">생활관</Label>
          <Input
            placeholder="생활관"
            className="text-sm"
            value={info.roomNumber}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, roomNumber: e.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label className="shrink-0">군번</Label>
          <Input
            placeholder="군번"
            className="text-sm"
            value={info.sn}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, sn: e.target.value }));
            }}
          />
          <span className="text-xs text-muted-foreground">
            군번은 가점 지급 대상자 식별 외 다른 용도로 사용되지 않으며, 가점
            지급 명단 확정 직후 폐기됩니다.
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="shrink-0">닉네임</Label>
          <Input
            placeholder="닉네임"
            className="text-sm"
            value={info.nickname}
            onChange={(e) => {
              setInfo((prev) => ({ ...prev, nickname: e.target.value }));
            }}
          />
        </div>
        <AsyncButton
          disabled={!info.roomNumber || !info.nickname || !info.sn}
          onClick={async () => {
            await loginMutation.mutateAsync({
              sn: info.sn,
              username: info.nickname,
            });
          }}
        >
          <LogIn /> 퀴즈 시작
        </AsyncButton>
      </div>
    </div>
  );
}
