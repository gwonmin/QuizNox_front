import { SectionSummary } from "@/components/handbook/SectionSummary";
import { KeyTable } from "@/components/handbook/KeyTable";
import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";
import { DocLink } from "@/components/handbook/DocLink";

export default function AifInferenceParams() {
  return (
    <>
      <SectionSummary
        lead="추론 파라미터는 모델을 바꾸지 않고 출력의 무작위성·길이(텍스트)와 프롬프트 충실도(이미지)를 조절한다. 텍스트는 Temperature·Top K·Top P, 이미지는 Diffusion의 Generation steps·Prompt strength(CFG)·Seed로 방향을 잡는다."
        bullets={[
          "일관성·정확성·환각 감소 → Temperature 낮춤. 다양성·창의성 → 높임.",
          "Top K는 후보 개수, Top P는 누적 확률. 둘 다 낮추면 보수적.",
          "이미지: Diffusion은 Seed로 만든 노이즈에서 시작해 Generation steps만큼 제거하며, Prompt strength로 프롬프트를 따른다.",
          "Seed는 품질을 올리는 값이 아니라 시작 노이즈를 고정·교체한다. 재현·비교는 고정, 다양한 후보는 시드를 바꾼다.",
          "길이·형식·어조는 파라미터가 아니라 프롬프트로 조정한다.",
        ]}
      />

      <h2>파라미터</h2>

      <KeyTable
        columns={["파라미터", "조절하는 것", "낮추면", "올리면"]}
        rows={[
          ["Temperature", "확률 분포의 뾰족함", "결정적·일관·사실 중심. 0이면 거의 항상 같은 답", "다양·창의·무작위. 환각 가능성 ↑"],
          ["Top K", "다음 토큰 후보를 상위 K개로 제한", "보수적", "다양"],
          ["Top P (nucleus)", "누적 확률 P까지의 후보만 사용", "보수적", "다양"],
          ["Max tokens (응답 길이)", "출력 최대 토큰", "짧게, 비용 ↓", "길게"],
          ["Stop sequences", "이 문자열이 나오면 생성 중단", "형식 제어", "-"],
        ]}
      />

      <h2>상황별 설정</h2>

      <KeyTable
        columns={["목표", "설정"]}
        rows={[
          ["감성 분석, 분류, 추출처럼 정답이 있는 작업", "Temperature 낮게 (0~0.3)"],
          ["마케팅 문구, 스토리처럼 창의성 필요", "Temperature·Top P 높게"],
          ["환각 줄이기", "Temperature ↓ + RAG로 근거 제공"],
          ["비용 줄이기", "Max tokens ↓, 프롬프트 토큰 ↓ (예시 수 줄이기)"],
          ["출력이 짧고 특정 어조여야 함", "프롬프트에 지시. 파라미터로는 어조 제어 불가"],
        ]}
      />

      <h2>Diffusion 알고리즘</h2>

      <p>
        Nova Canvas·Stable Diffusion 같은 이미지 FM은{" "}
        <strong>text-conditioned diffusion</strong>이다. 학습 때는 깨끗한 이미지에
        노이즈를 점점 더하는 <strong>forward</strong> 과정을, 추론(생성) 때는 그 반대인{" "}
        <strong>reverse(denoising)</strong>로 순수 노이즈에서 이미지를 복원한다. 자세한
        모델 분류는{" "}
        <DocLink layer="aif" slug="learning-types">
          학습 유형
        </DocLink>
        ·{" "}
        <DocLink layer="aif" slug="genai-concepts">
          생성형 AI 개념
        </DocLink>
        을 본다.
      </p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph train [학습 forward]
          IMG["깨끗한 이미지"] --> N1["노이즈 추가"] --> NOISE["거의 순수 노이즈"]
        end
        subgraph infer [추론 reverse]
          SEED["Seed 기반 노이즈"] --> D1["1 step 노이즈 제거"] --> D2["2 step"] --> DN["N step"] --> OUT["최종 이미지"]
        end
        PROMPT["텍스트 프롬프트"] -.->|"매 step 조건"| D1
          PROMPT -.-> D2
          PROMPT -.-> DN
        CFG["Prompt strength CFG"] -.->|"충실도"| D1
          CFG -.-> D2
          CFG -.-> DN`}
      />

      <KeyTable
        columns={["단계", "하는 일", "비유"]}
        rows={[
          ["1. 시작", "Seed로 난수 노이즈(또는 저해상도 잠재 표현)를 만든다", "캔버스에 모래를 뿌린 상태"],
          ["2. Denoising loop", "Generation steps만큼 반복하며 노이즈를 조금씩 제거한다", "모래를 걷어 형태가 드러남"],
          ["3. 조건 부여", "매 step에서 텍스트 임베딩으로 방향을 잡는다", "설명문을 보며 형태를 맞춤"],
          ["4. Guidance", "Prompt strength(CFG)로 조건 없는 예측과 조건 있는 예측의 차이를 키운다", "설명문을 얼마나 세게 따를지"],
          ["5. 출력", "최종 잠재 표현을 고해상도 이미지로 복원한다", "완성된 그림"],
        ]}
      />

      <h2>이미지 생성 파라미터</h2>

      <p>
        텍스트→이미지에서는 <strong>Generation steps</strong>,{" "}
        <strong>Prompt strength</strong>, <strong>Seed</strong>가 핵심이다. Nova
        Canvas·Bedrock의 prompt strength와 API의 <code>cfgScale</code>(CFG scale)은
        같은 축이고, <code>seed</code>는 정수로 초기 노이즈를 고른다.
      </p>

      <KeyTable
        columns={["파라미터", "역할", "낮추면 · 바꾸면", "올리면 · 고정하면"]}
        rows={[
          [
            "Generation steps (Steps)",
            "Diffusion reverse의 노이즈 제거 반복 횟수. step마다 프롬프트 조건으로 조금씩 선명해진다",
            "빠르지만 디테일·일관성 ↓. 덜 정제된 결과",
            "품질·디테일 ↑. 지연·비용 ↑. 어느 시점 이후 체감 이득은 줄어듦",
          ],
          [
            "Prompt strength (CFG scale · cfgScale)",
            "각 denoising step에서 프롬프트를 얼마나 세게 따를지. classifier-free guidance",
            "모델 재량 ↑. 프롬프트와 어긋나기 쉬움",
            "프롬프트 충실도 ↑. 과도하면 부자연·과적합 느낌",
          ],
          [
            "Negative prompt",
            "제외할 요소를 조건으로 넣어 해당 방향을 억제",
            "-",
            "원치 않는 요소를 더 강하게 억제",
          ],
          [
            "Seed",
            "초기 노이즈(시작점)를 고르는 난수 시드. 품질·충실도 노브가 아님",
            "시드를 바꾸면 구도·세부만 다른 후보가 나온다 (다양성)",
            "같은 seed + 같은 프롬프트·Steps·CFG면 결과 재현",
          ],
        ]}
      />

      <KeyTable
        columns={["Seed로 하는 것", "Seed로 안 되는 것"]}
        rows={[
          ["같은 설정을 다시 돌려 이미지 재현", "해상도·선명도·디테일 품질 향상 (그건 Steps)"],
          ["Steps·CFG 효과를 공정 비교하려고 시작점 고정", "프롬프트 설명과의 일치도 향상 (그건 Prompt strength)"],
          ["여러 후보를 뽑을 때 시드만 바꿔 변형 생성", "원치 않는 요소 제거 (그건 Negative prompt)"],
        ]}
      />

      <KeyTable
        columns={["이름", "어디에 나오나", "메모"]}
        rows={[
          ["Generation steps · Steps", "Stable Diffusion 등. 일부 UI는 sampling steps", "Diffusion reverse 루프 길이"],
          ["Prompt strength", "Nova Canvas · Bedrock 개념 설명", "프롬프트 충실도. CFG와 동일 축"],
          ["CFG scale / cfgScale", "Stable Diffusion · Nova Canvas API", "Prompt strength와 동일. 설명과 안 맞으면 올린다"],
          ["Seed / seed", "Nova Canvas imageGenerationConfig 등", "정수. 미지정·랜덤이면 호출마다 다른 시작 노이즈"],
        ]}
      />

      <KeyTable
        columns={["함께 조절", "왜"]}
        rows={[
          ["Steps ↑ + Prompt strength 적정", "반복을 늘려 디테일을 살리고, CFG로 설명을 맞춘다"],
          ["Steps만 올리고 CFG가 너무 낮음", "매끄럽지만 프롬프트와 어긋난 이미지가 나올 수 있다"],
          ["CFG만 매우 높고 Steps 부족", "설명에만 집착하다 덜 정제된·부자연한 결과가 나오기 쉽다"],
          ["Seed 고정 후 Steps·CFG만 변경", "같은 시작점에서 품질·충실도 차이를 비교할 수 있다"],
          ["프롬프트·Steps·CFG 고정 후 Seed만 변경", "같은 지시로 다른 구도·디테일 후보를 뽑는다"],
        ]}
      />

      <h2>기출빈출</h2>

      <KeyTable
        columns={["시나리오", "정답"]}
        rows={[
          ["감성 분석에서 같은 입력에 더 일관된 응답", "Temperature 낮춤"],
          ["LLM이 환각을 보임", "Temperature 낮춤"],
          ["더 다양하고 창의적인 출력", "Temperature 높임"],
          ["출력을 짧고 특정 스타일로", "프롬프트 조정 (파라미터 아님)"],
          ["few-shot 예시 10개를 매일 호출, 비용 절감", "프롬프트 토큰 수 감소"],
          ["이미지 FM이 노이즈에서 이미지를 만드는 방식", "Diffusion (denoising reverse)"],
          ["생성 품질을 높이되 같은 프롬프트를 유지", "Generation steps 증가"],
          ["생성 이미지가 프롬프트 설명과 안 맞음", "Prompt strength (CFG scale) 증가"],
          ["Stable Diffusion 이미지가 설명과 안 맞음", "CFG scale 증가"],
          ["Nova Canvas 생성 이미지에서 특정 요소 제외", "Negative prompt"],
          ["이전에 마음에 든 이미지를 같은 설정으로 다시 생성", "Seed 고정 (프롬프트·Steps·CFG도 동일)"],
          ["같은 프롬프트로 여러 변형 후보가 필요", "Seed를 바꿔 여러 번 생성"],
          ["이미지가 흐릿하거나 품질이 낮아 Seed를 올리고 싶음", "Seed가 아님 → Generation steps 증가"],
        ]}
      />

      <h2>요약</h2>

      <KeyTable
        columns={["키워드", "답"]}
        rows={[
          ["일관, 정확, 환각 ↓", "Temperature ↓"],
          ["창의, 다양", "Temperature ↑"],
          ["후보 개수", "Top K"],
          ["누적 확률", "Top P"],
          ["이미지 생성 알고리즘", "Diffusion: Seed 노이즈 → step마다 denoising → 이미지"],
          ["Generation steps", "denoising 반복 횟수. 품질 ↔ 지연"],
          ["프롬프트 충실도(이미지)", "Prompt strength = CFG scale (cfgScale)"],
          ["제외(이미지)", "Negative prompt"],
          ["재현(이미지)", "Seed 고정 + 나머지 설정 동일"],
          ["변형 후보(이미지)", "Seed만 변경"],
          ["Seed ≠ 품질", "품질은 Steps, 충실도는 CFG"],
        ]}
      />
    </>
  );
}
