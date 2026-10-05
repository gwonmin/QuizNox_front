import { KeyTable } from "./KeyTable";

interface ModelReference {
  name: string;
  url: string;
  use: string;
}

/**
 * 모델 이름·가격·컨텍스트 크기는 자주 바뀌므로 핸드북 본문에 적지 않고 이 링크로 보낸다.
 * 링크가 바뀌면 여기 한 곳만 고친다.
 */
const MODEL_REFERENCES: ModelReference[] = [
  {
    name: "OpenAI 모델 목록",
    url: "https://developers.openai.com/api/docs/models",
    use: "현재 모델, 컨텍스트 크기, 가격, 지원 기능",
  },
  {
    name: "Anthropic Claude 모델 개요",
    url: "https://platform.claude.com/docs/en/about-claude/models/overview",
    use: "현재 모델 비교, 컨텍스트 크기, 가격, 지원 플랫폼",
  },
  {
    name: "Google Gemini 모델 목록",
    url: "https://ai.google.dev/gemini-api/docs/models",
    use: "현재 모델, 입력 형식, 토큰 한도",
  },
  {
    name: "Amazon Bedrock 지원 모델",
    url: "https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html",
    use: "AWS에서 쓸 수 있는 모델과 리전",
  },
  {
    name: "LMArena 리더보드",
    url: "https://lmarena.ai/leaderboard",
    use: "사람의 블라인드 선호 투표 기반 순위",
  },
  {
    name: "Artificial Analysis",
    url: "https://artificialanalysis.ai/",
    use: "벤치마크 점수와 속도·지연·가격을 함께 비교",
  },
];

export function ModelReferenceLinks() {
  return (
    <KeyTable
      columns={["어디서", "무엇을 확인하나"]}
      rows={MODEL_REFERENCES.map((ref) => [
        <a
          key={ref.url}
          href={ref.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline underline-offset-2 hover:opacity-80"
        >
          {ref.name}
        </a>,
        ref.use,
      ])}
    />
  );
}
