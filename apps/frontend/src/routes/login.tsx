import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFileRoute } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/login")({
  component: RouteComponent,
});

function RouteComponent() {
  const [info, setInfo] = useState<{
    roomNumber: string;
    roomSeatSide?: "left" | "right";
    roomSeatNumber: string;
    nickname: string;
    sn: string;
  }>({
    roomNumber: "",
    roomSeatSide: undefined,
    roomSeatNumber: "",
    nickname: "",
    sn: "",
  });

  return (
    <div className="p-4 flex flex-col items-center gap-12">
      <img src="/logo.png" className="size-48 rounded-full" />
      <div className="flex flex-col gap-4">
        <div className="flex flex-row items-center gap-4">
          <div className="flex flex-row items-center gap-1">
            <Input
              type="number"
              placeholder="생활관 번호"
              className="text-sm"
              value={info.roomNumber}
              onChange={(e) => {
                setInfo((prev) => ({ ...prev, roomNumber: e.target.value }));
              }}
            />
            <Label className="shrink-0">생활관</Label>
          </div>
          <div className="flex flex-row items-center gap-1">
            <Select
              value={info.roomSeatSide}
              onValueChange={(newValue) => {
                setInfo((prev) => ({
                  ...prev,
                  roomSeatSide: newValue as "left" | "right",
                }));
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="좌/우" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">좌</SelectItem>
                <SelectItem value="right">우</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="생활관 자리"
              className="text-sm"
              value={info.roomSeatNumber}
              onChange={(e) => {
                setInfo((prev) => ({
                  ...prev,
                  roomSeatNumber: e.target.value,
                }));
              }}
            />
            <Label className="shrink-0">도</Label>
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
        <Button
          disabled={
            !info.roomNumber ||
            !info.roomSeatSide ||
            !info.roomSeatNumber ||
            !info.nickname ||
            !info.sn
          }
        >
          <LogIn /> 로그인
        </Button>
      </div>
    </div>
  );
}
