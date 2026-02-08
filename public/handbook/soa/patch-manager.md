# Systems Manager - Patch Manager

**OS·소프트웨어 패치**를 베이스라인·대상·일정에 따라 자동화하는 AWS Systems Manager 기능입니다.

---

## 특징

- **패치 베이스라인**: 승인할 패치 유형·심각도·자동 승인 지연(일) 설정. Dev/Prod별로 서로 다른 베이스라인 가능.
- **대상**: 태그 기반으로 인스턴스 그룹 지정. Patch Manager가 SSM에 등록된 인스턴스만 대상.
- **유지 보수 윈도우**: 패치 실행 시간대·기간 제한. 하나의 윈도우에 여러 태그 그룹 포함 가능.
- 인스턴스에 **IAM Instance Profile**(SSM 접근 권한) 필수. 패치만 할 때도 동일.
- **State Manager**로 AWS-ConfigureAWSPackage 등으로 앱 패치·에이전트 배포.

---

## 시나리오

| 시나리오 | 접근 |
|----------|------|
| Dev는 2일, Prod는 5일 후 자동 승인 패치 | **패치 베이스라인**을 두 개 만들어 각각 auto-approval delay 설정. **패치 그룹** 태그로 Dev/Prod 구분. 단일 **유지 보수 윈도우**에서 둘 다 실행. |
| Patch Manager 대상 인스턴스가 안 보임 | 인스턴스에 **IAM Instance Profile**(SSM 권한) 연결. 보안 그룹·VPC 엔드포인트(또는 NAT) 확인. |
| 월 1회 이상 OS 패치 + 보고 | **유지 보수 윈도우** + **Patch Manager** 태스크 등록. 리소스 그룹별 윈도우로 실행 → Run Command/자동화 runbook을 윈도우 태스크로 등록. |
| 서드파티 .msi 자동 배포·업데이트 | **Distributor** 패키지 생성 + **State Manager**에서 AWS-ConfigureAWSPackage 문서로 주기 실행. |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| Patch Manager 대상 인스턴스가 안 보임 | 인스턴스에 **IAM Instance Profile**(SSM 권한) 연결. SG·VPC 엔드포인트 확인. |
| Dev 2일, Prod 5일 후 자동 승인 패치 | **패치 베이스라인** 두 개(각각 auto-approval delay). **패치 그룹** 태그로 구분. 단일 **유지 보수 윈도우**. |
| 유지 보수 윈도우 + runbook 자동화 | **유지 보수 윈도우**에 Run Command·자동화 runbook을 태스크로 등록. |
| 서드파티 에이전트 주기 배포·업데이트 | **Distributor** 패키지 + **State Manager** AWS-ConfigureAWSPackage, 태그 타깃·일정 지정. |

---

## 요약

| 항목 | 내용 |
|------|------|
| 구성 요소 | 패치 베이스라인, 패치 그룹(태그), 유지 보수 윈도우, IAM Instance Profile. |
| 기출 포인트 | IAM instance profile 필수, Dev/Prod 별 베이스라인·단일 윈도우, 리소스 그룹·유지보수 윈도우·runbook, Distributor+State Manager. |
