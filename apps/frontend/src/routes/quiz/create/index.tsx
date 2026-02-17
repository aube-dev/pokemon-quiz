import { api_createProblem } from "@/apis/problems";
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
import type { QuizBlock } from "@pokemon-quiz/interface";
import { createFileRoute } from "@tanstack/react-router";
import { Check, Plus, Trash } from "lucide-react";
import { useState } from "react";
import { QuizBlockInput } from "./-components/QuizBlockInput";
import { getInitialBlock } from "@/utils/quiz";
import { AsyncButton } from "@/components/AsyncButton";

export const Route = createFileRoute("/quiz/create/")({
  component: RouteComponent,
});

function RouteComponent() {
  const createProblemMutation = api_createProblem.useMutation();

  const [content, setContent] = useState<QuizBlock[]>([]);
  const [answer, setAnswer] = useState<{
    options: {
      number: number;
      blocks: QuizBlock[];
    }[];
    correct: number;
  }>({
    options: [
      {
        number: 1,
        blocks: [],
      },
      {
        number: 2,
        blocks: [],
      },
      {
        number: 3,
        blocks: [],
      },
      {
        number: 4,
        blocks: [],
      },
    ],
    correct: 1,
  });
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");

  return (
    <div className="flex flex-col p-4 gap-4">
      <h1 className="text-2xl font-semibold">문제 생성</h1>
      <div className="flex flex-col gap-2">
        <Label htmlFor="title">문제 제목</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
          }}
          placeholder="문제 제목"
          className="text-sm"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Label>분류</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="문제 분류" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="기술">기술</SelectItem>
            <SelectItem value="포켓몬">포켓몬</SelectItem>
            <SelectItem value="BGM">BGM</SelectItem>
            <SelectItem value="캐릭터">캐릭터</SelectItem>
            <SelectItem value="게임">게임</SelectItem>
            <SelectItem value="도구">도구</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">문제</h2>
        {content.map((item, itemIndex) => (
          <div key={itemIndex} className="flex flex-col">
            <QuizBlockInput
              block={item}
              onBlockChange={(newBlock) => {
                setContent((prev) =>
                  prev.map((v, index) => (index === itemIndex ? newBlock : v)),
                );
              }}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                setContent((prev) =>
                  prev.filter((_v, index) => index !== itemIndex),
                );
              }}
            >
              <Trash />
            </Button>
          </div>
        ))}
        <Button
          variant="outline"
          onClick={() => {
            setContent((prev) => [...prev, getInitialBlock("text")]);
          }}
        >
          <Plus /> 블록 추가
        </Button>
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">선택지</h2>
        <Label>정답</Label>
        <Select
          value={answer.correct?.toString() ?? ""}
          onValueChange={(newValue) => {
            setAnswer((prev) => ({ ...prev, correct: Number(newValue) }));
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="정답" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1번</SelectItem>
            <SelectItem value="2">2번</SelectItem>
            <SelectItem value="3">3번</SelectItem>
            <SelectItem value="4">4번</SelectItem>
          </SelectContent>
        </Select>
        {answer.options.map((item) => (
          <div key={item.number} className="flex flex-col gap-2">
            <span>{item.number}번 선택지</span>
            {item.blocks.map((block, blockIndex) => (
              <div className="flex flex-col">
                <QuizBlockInput
                  block={block}
                  onBlockChange={(newBlock) => {
                    setAnswer((prev) => ({
                      ...prev,
                      options: prev.options.map((option) =>
                        option.number === item.number
                          ? {
                              ...option,
                              blocks: option.blocks.map(
                                (_block, _blockIndex) =>
                                  _blockIndex === blockIndex
                                    ? newBlock
                                    : _block,
                              ),
                            }
                          : option,
                      ),
                    }));
                  }}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setAnswer((prev) => ({
                      ...prev,
                      options: prev.options.map((option) =>
                        option.number === item.number
                          ? {
                              ...option,
                              blocks: option.blocks.filter(
                                (_v, _blockIndex) => _blockIndex !== blockIndex,
                              ),
                            }
                          : option,
                      ),
                    }));
                  }}
                >
                  <Trash />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                setAnswer((prev) => ({
                  ...prev,
                  options: prev.options.map((option) =>
                    option.number === item.number
                      ? {
                          ...option,
                          blocks: [...option.blocks, getInitialBlock("text")],
                        }
                      : option,
                  ),
                }));
              }}
            >
              <Plus /> 블록 추가
            </Button>
          </div>
        ))}
      </div>
      <AsyncButton
        onClick={async () => {
          await createProblemMutation.mutateAsync({
            title,
            category,
            content,
            answer,
          });
        }}
      >
        <Check /> 문제 등록
      </AsyncButton>
    </div>
  );
}
