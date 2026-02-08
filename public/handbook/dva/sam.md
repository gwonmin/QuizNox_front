# SAM (Serverless Application Model)

**Lambda·API Gateway** 등 서버리스 리소스를 **YAML/JSON 템플릿**으로 정의하는 프레임워크입니다. CloudFormation 기반이며 **sam CLI**로 빌드·배포·로컬 테스트를 합니다.

---

## 1. 특징

- **템플릿**: **AWS::Serverless::** 리소스(Function, Api, SimpleTable 등)로 Lambda·API·DynamoDB 등을 선언. CloudFormation **Transform: AWS::Serverless-2016-10-31** 사용.
- **CLI**: **sam build** → **sam package** → **sam deploy** 또는 **sam deploy --guided**. **sam sync --watch**로 변경된 Lambda만 빠르게 반영(개발 시).
- **로컬 테스트**: **sam local invoke**, **sam local start-api**로 API Gateway·Lambda 로컬 실행. **sam local generate-event**로 S3·SQS 등 이벤트 페이로드 생성.
- **Lambda@Edge**: Lambda@Edge 함수는 **us-east-1** 리전에만 배포 가능. eu-west-1 등 다른 리전에서 SAM 배포 시 Lambda@Edge 때문에 실패할 수 있음.
- **다중 환경**: **samconfig.toml** 또는 **--config-env**로 환경별 파라미터 그룹 지정 후 **sam deploy --config-env xxx**.

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| **서버리스 리소스** YAML로 정의·배포 | SAM 템플릿(Transform 포함) + sam build / sam deploy |
| **Lambda만 자주 수정**·전체 배포 최소화 | **sam sync --watch**로 변경분만 동기화 |
| **로컬에서 Lambda·API 테스트** | sam local invoke(이벤트 파일), sam local start-api(API 전체) |
| **테스트 이벤트** 구조 맞추기 | **sam local generate-event** s3 put 등으로 샘플 이벤트 생성 |
| **eu-west-1 등에서 배포 실패**(Lambda@Edge 포함 시) | Lambda@Edge는 **us-east-1**에서만 생성; 리전 분리 또는 템플릿 분리 |
| **Canary·트래픽 비율 배포** | SAM에서 **DeploymentPreference**(Canary10Percent10Minutes 등) 설정 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 서버리스 리소스 YAML로 정의·배포 | **SAM** 템플릿(Transform: AWS::Serverless-2016-10-31) + **sam build** / **sam deploy**. |
| Lambda만 자주 수정·전체 배포 최소화 | **sam sync --watch**로 변경분만 동기화. |
| 로컬에서 Lambda·API 테스트 | **sam local invoke**(이벤트 파일), **sam local start-api**(API 전체). |
| 테스트 이벤트 구조(S3 put 등) | **sam local generate-event** s3 put 등으로 샘플 이벤트 생성. |
| Lambda@Edge 포함 시 eu-west-1 등 배포 실패 | Lambda@Edge는 **us-east-1**에서만 생성; 리전 분리 또는 템플릿 분리. |
| RDS·DB 실수 삭제 방지 | **DeletionPolicy: Retain**; 스택 정책으로 DB 리소스 업데이트 차단. |

---

## 요약

| 항목 | 설명 |
|------|------|
| SAM | 서버리스 리소스 템플릿 + sam CLI(빌드·배포·로컬) |
| 배포 | sam build → sam deploy; 개발 시 sam sync --watch |
| 조건 | "서버리스 IaC" → SAM / "로컬 테스트" → sam local / "Lambda@Edge" → us-east-1 |
