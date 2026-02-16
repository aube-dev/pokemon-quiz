import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { getInitialBlock } from "@/utils/quiz";
import type {
  QuizBlock,
  QuizBlockAudio,
  QuizBlockImage,
  QuizBlockText,
  QuizBlockYoutube,
} from "@pokemon-quiz/interface";

interface QuizBlockInputProps<T extends QuizBlock> {
  block: T;
  onBlockChange?: (block: T) => void;
}

const QuizBlockInputText = ({
  block,
  onBlockChange,
}: QuizBlockInputProps<QuizBlockText>) => {
  return (
    <Textarea
      value={block.content}
      onChange={(e) => {
        onBlockChange?.({ ...block, content: e.target.value });
      }}
    />
  );
};

const QuizBlockInputImage = ({
  block,
  onBlockChange,
}: QuizBlockInputProps<QuizBlockImage>) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        value={block.imageUrl}
        onChange={(e) => {
          onBlockChange?.({ ...block, imageUrl: e.target.value });
        }}
        placeholder="이미지 주소"
        className="text-sm"
      />
      <img src={block.imageUrl} className="w-full" />
    </div>
  );
};

const QuizBlockInputYoutube = ({
  block,
  onBlockChange,
}: QuizBlockInputProps<QuizBlockYoutube>) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        value={block.embedUrl}
        onChange={(e) => {
          onBlockChange?.({ ...block, embedUrl: e.target.value });
        }}
        placeholder="유튜브 주소 (embed)"
        className="text-sm"
      />
      <span className="text-sm text-destructive">
        Youtube 공유 - 퍼가기를 누르면 나오는 embed 링크를 넣어야 합니다!
      </span>
      <iframe
        width="560"
        height="315"
        src={block.embedUrl}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const QuizBlockInputAudio = ({
  block,
  onBlockChange,
}: QuizBlockInputProps<QuizBlockAudio>) => {
  return (
    <div className="flex flex-col gap-2">
      <Input
        value={block.audioUrl}
        onChange={(e) => {
          onBlockChange?.({ ...block, audioUrl: e.target.value });
        }}
        placeholder="오디오 주소"
        className="text-sm"
      />
      <audio src={block.audioUrl} controls></audio>
    </div>
  );
};

const QuizBlockInput = ({
  block,
  onBlockChange,
}: QuizBlockInputProps<QuizBlock>) => {
  return (
    <div className="flex flex-col gap-4">
      <Select
        value={block.type}
        onValueChange={(newValue) => {
          onBlockChange?.(
            getInitialBlock(newValue as "text" | "image" | "youtube" | "audio"),
          );
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="블록 종류" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="text">텍스트</SelectItem>
          <SelectItem value="image">이미지</SelectItem>
          <SelectItem value="youtube">유튜브</SelectItem>
          <SelectItem value="audio">오디오</SelectItem>
        </SelectContent>
      </Select>
      {(() => {
        switch (block.type) {
          case "text":
            return (
              <QuizBlockInputText block={block} onBlockChange={onBlockChange} />
            );
          case "image":
            return (
              <QuizBlockInputImage
                block={block}
                onBlockChange={onBlockChange}
              />
            );
          case "youtube":
            return (
              <QuizBlockInputYoutube
                block={block}
                onBlockChange={onBlockChange}
              />
            );
          case "audio":
            return (
              <QuizBlockInputAudio
                block={block}
                onBlockChange={onBlockChange}
              />
            );
          default:
            return null;
        }
      })()}
    </div>
  );
};

export { QuizBlockInput };
