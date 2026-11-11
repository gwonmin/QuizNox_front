import { MermaidDiagram } from "@/components/handbook/MermaidDiagram";

export default function AwsCommonLayerDiagram() {
  return (
    <>
      <p>노드를 클릭하면 해당 개념 문서로 이동합니다. AWS 공통 레이어는 시험·실무에서 자주 쓰는 기초 서비스를 한눈에 정리합니다.</p>

      <hr />

      <h2>1. Networking (VPC · 서브넷 · 보안)</h2>

      <p><strong>왜 배우나요?</strong> VPC·서브넷·라우팅·보안 그룹·NACL을 구분해야 트래픽 경로와 접근 제어를 설계할 수 있습니다. 퍼블릭/프라이빗 구분과 IGW·NAT·VPC Endpoint 선택이 기반이 됩니다.</p>

      <p>서브넷·라우팅 → IGW/NAT · EIP → 보안(SG·NACL) · VPC Endpoint</p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph net [VPC · 서브넷 · 보안]
          SUB([Public / Private subnet])
          RT([Route Table])
          GW([IGW vs NAT])
          EIP([Elastic IP])
          SG([Security Group])
          NL([NACL])
          EP([VPC Endpoint])
        end`}
      />

      <hr />

      <h2>2. Identity & Access (IAM)</h2>

      <p><strong>왜 배우나요?</strong> 누가 어떤 리소스에 접근할 수 있는지 정하려면 User/Role, 정책 평가 순서, Identity/Resource 정책, Explicit Deny·STS·Cross-account를 구분해야 합니다.</p>

      <p>주체(User/Role) → 정책 평가 · 정책 유형 → Explicit Deny · STS · Cross-account · MFA</p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph iam [IAM]
          UR([User vs Role])
          P([Policy Evaluation])
          I([Identity-based vs Resource-based])
          E([Explicit Deny])
          S([STS / AssumeRole])
          C([Cross-account])
          M([MFA])
        end`}
      />

      <hr />

      <h2>3. Storage & Data (S3 · EBS · EFS · RDS · DynamoDB · ElastiCache)</h2>

      <p><strong>왜 배우나요?</strong> 객체·블록·파일·관계형·NoSQL·캐시 등 저장소 유형별로 S3·EBS·EFS·RDS·DynamoDB·ElastiCache를 선택할 수 있어야 아키텍처에 맞는 저장소를 고를 수 있습니다.</p>

      <p>객체(S3) · 블록(EBS) · 파일(EFS) → 관계형(RDS) · NoSQL(DynamoDB) · 캐시(ElastiCache)</p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph stor [Storage & Data]
          S3([S3])
          EBS([EBS 기본])
          EFS([EFS 기본])
          RDS([RDS 기본])
          DDB([DynamoDB])
          EC([ElastiCache])
        end`}
      />

      <hr />

      <h2>4. Compute & Scaling (EC2 · Lambda · ECS · EKS · ELB · ASG)</h2>

      <p><strong>왜 배우나요?</strong> VM·서버리스·컨테이너 중 무엇을 쓸지, 트래픽 분산(ELB)·헬스체크·스케일(ASG)을 어떻게 붙일지 알아야 컴퓨트 레이어를 설계할 수 있습니다.</p>

      <p>컴퓨트(EC2·Lambda·ECS·EKS) → 로드밸런서(ALB/NLB) · Target Group · Health Check · Sticky Session → ASG · Scaling Policy</p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph comp [Compute & Scaling]
          EC2([EC2 개요])
          LB([Lambda])
          ECS([ECS 기본])
          EKS([EKS 기본])
          ELB([ALB vs NLB])
          TG([Target Group])
          HC([Health Check])
          ST([Sticky Session])
          ASG([ASG 기본])
          SC([Scaling Policy])
        end`}
      />

      <hr />

      <h2>5. Monitoring & Logging (CloudWatch · 감사)</h2>

      <p><strong>왜 배우나요?</strong> 메트릭·로그·대시보드·알람으로 상태를 보고, CloudTrail·Config로 감사와 규정 준수를 채우려면 각 서비스 역할을 구분해야 합니다.</p>

      <p>메트릭·로그 수집 → 대시보드 · 알람 → 감사(CloudTrail vs Config)</p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph mon [CloudWatch · 감사]
          CW([CloudWatch Metrics / Logs])
          DB([Dashboard])
          AL([Alarm])
          CT([CloudTrail vs Config])
        end`}
      />

      <hr />

      <h2>6. Security & Secrets (KMS · Secrets Manager · Parameter Store)</h2>

      <p><strong>왜 배우나요?</strong> 데이터 암호화(KMS)와 시크릿/구성값 관리(Secrets Manager · Parameter Store)를 이해해야, S3·RDS·DynamoDB·Lambda 등 전반에 일관된 보안 기준을 적용할 수 있습니다.</p>

      <p>KMS → 데이터 키(Envelope Encryption) → 저장소 암호화(S3·EBS·RDS·DynamoDB) Secrets Manager → 고가치 시크릿 저장·회전(DB PW, JWT 시크릿 등) Parameter Store → 환경별 구성값·가벼운 시크릿 관리(String / SecureString)</p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph sec [Security & Secrets]
          KMS([KMS])
          SM([Secrets Manager])
          PS([SSM Parameter Store])
        end`}
      />

      <hr />

      <h2>7. AI & Bedrock</h2>

      <p><strong>왜 배우나요?</strong> 관리형 FM API·Agent·AgentCore를 구분해야 GenAI 앱의 호출·오케스트레이션·호스팅을 고를 수 있습니다.</p>

      <p>개요 → APIs → Agent → AgentCore</p>

      <MermaidDiagram
        code={`flowchart LR
        subgraph ai [AI and Bedrock]
          OV([Bedrock Overview])
          APIs([Bedrock APIs])
          AG([Bedrock Agent])
          AC([Bedrock AgentCore])
          OV --> APIs --> AG --> AC
        end`}
      />

      <hr />

      <p>세부 설명은 각 노드를 클릭해 개념 문서에서 이어서 읽을 수 있습니다.</p>
    </>
  );
}
