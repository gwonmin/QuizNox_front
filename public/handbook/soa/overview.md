# 5. SOA (Operations) · 개요

운영·모니터링·자동화를 한눈에 볼 수 있습니다.  
노드를 클릭하면 해당 개념 문서로 이동합니다.

---

## CloudWatch 고급

```mermaid
flowchart TB
  subgraph cw [CloudWatch 고급]
    MF([Metric Filter])
    CA([Composite Alarm])
    LI([Logs Insights])
  end
  MF --> CA --> LI
```

---

## Systems Manager

```mermaid
flowchart TB
  subgraph ss [Systems Manager]
    SM([Session Manager])
    PM([Patch Manager])
    RC([Run Command])
  end
  SM --> PM --> RC
```

---

## EC2 운영

```mermaid
flowchart TB
  subgraph ec2 [EC2 운영]
    LT([Launch Template])
    AM([AMI 관리])
    ES([EBS 스냅샷])
  end
  LT --> AM --> ES
```

---

## 트러블슈팅

```mermaid
flowchart TB
  subgraph ts [트러블슈팅]
    FL([Flow Logs])
    DN([DNS 이슈])
    SG([SG/NACL 분석])
  end
  FL --> DN --> SG
```

---

## 거버넌스

```mermaid
flowchart TB
  subgraph gov [거버넌스]
    CF([AWS Config])
    GD([GuardDuty])
    CO([Cost Explorer / Budgets])
  end
  CF --> GD --> CO
```

---

세부 설명은 각 개념 문서에서 이어서 읽을 수 있습니다.
