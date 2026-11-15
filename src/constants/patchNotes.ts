export interface PatchNote {
  /** YYYY-MM-DD. 최신 항목의 날짜가 배너 읽음 처리 키가 된다 */
  date: string;
  title: string;
  items?: string[];
}

/** 최신순. 릴리즈 때 맨 앞에 하나 추가한다 */
export const PATCH_NOTES: PatchNote[] = [
  {
    date: "2026-11-15",
    title: "핸드북의 AI 영역이 ML Engineering · LLM Application Engineering · LLM Agent Engineering 세 섹션으로 정리됐어요",
    items: [
      "9. ML Engineering: ML 파이프라인·모델 서빙 문서를 추가하고 MLOps를 이 섹션으로 옮겼어요",
      "10. LLM Application Engineering: LLMOps 문서를 추가하고 Model Strategy / Routing을 이 섹션으로 옮겼어요",
      "11. LLM Agent Engineering: Agent Instructions 문서를 추가하고 문서를 5가지 설계 영역(Prompt·Context·Harness·Loop·Graph)으로 묶었어요",
      "Chrome 번역을 켠 채 다음 문제로 넘어가면 문제 제목이 그대로 남던 문제와 핸드북 다이어그램이 간혹 표시되지 않던 문제를 고쳤어요",
    ],
  },
  {
    date: "2026-11-11",
    title: "AWS Cloud Practitioner(CLF-C02) 기출 710문항이 추가되고 핸드북이 모바일에서도 읽기 편해졌어요",
    items: [
      "기출문제·모의고사에서 CLF-C02 토픽을 선택할 수 있어요",
      "모든 핸드북 문서를 새 형식으로 전환하고 표·목차·다이어그램 모바일 표시를 개선했어요",
      "AIF 추론 파라미터에 Prompt strength·Diffusion·Generation steps·Seed를 보강했어요",
      "Bedrock 제어 영역(bedrock)과 데이터 영역(bedrock-runtime)·Converse API 설명을 정리했어요",
    ],
  },
  {
    date: "2026-10-25",
    title: "AWS AI Practitioner(AIF-C01) 기출 329문항과 핸드북 레이어가 추가됐어요",
    items: [
      "기출문제·모의고사에서 AIF-C01 토픽을 선택할 수 있어요",
      "핸드북 7. AIF: 시험 전략, 5개 도메인, 서비스 치트시트 18편",
    ],
  },
  {
    date: "2026-10-12",
    title: "CKA(Certified Kubernetes Administrator) 핸드북 레이어가 추가됐어요",
    items: ["핸드북 6. CKA: 클러스터 구성, 워크로드, 네트워크, 스토리지, 트러블슈팅"],
  },
  {
    date: "2026-10-11",
    title: "핸드북에서 문서를 찾고 이어서 읽기 쉬워졌어요",
    items: ["문서 제목·요약·소제목 검색", "섹션 안 이전·다음 문서 이동"],
  },
];

export const LATEST_PATCH_NOTE = PATCH_NOTES[0];
