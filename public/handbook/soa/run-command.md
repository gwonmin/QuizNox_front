# Systems Manager - Run Command

**여러 EC2 인스턴스**에 **동시에 명령**을 보내 실행하고 결과를 확인·저장하는 AWS Systems Manager 기능입니다.

---

## 특징

- **SSM Agent**가 있는 인스턴스가 대상. **대상 선택**은 인스턴스 ID, 태그, 리소스 그룹 등으로 지정.
- **문서**: AWS-RunShellScript, AWS-RunPowerShellScript, AWS-ConfigureAWSPackage 등. 커스텀 문서 가능.
- 출력을 **S3·CloudWatch Logs**에 저장 가능. **Parameter Store**에 저장된 설정(예: CloudWatch 에이전트 설정)을 참조해 실행 가능.
- Session Manager와 동일하게 **IAM Instance Profile**(SSM 권한) 필요.

---

## 시나리오

| 시나리오 | 접근 |
|----------|------|
| 50대 인스턴스에 CloudWatch 에이전트 설정 추가 적용 | 추가 설정 파일을 **Parameter Store**에 저장. **Run Command**로 AWS-ApplyCloudWatchAgentConfiguration(또는 유사) 실행, **append-config**로 기존 설정에 추가. |
| 제로데이 대응 스크립트를 모든 관련 인스턴스에 실행 | **Run Command**로 AWS-RunShellScript/AWS-RunPowerShellScript 실행. **Targets**를 OS 태그로 지정. 실행 이력으로 완료 증명. |
| Windows 인스턴스에 동일한 CloudWatch 에이전트 설정 적용 | 설정을 **Parameter Store**에 두고, **State Manager**로 AmazonCloudWatch-ManageAgent 문서 주기 실행. Optional config source = SSM. |
| 패치가 아닌 일회성 명령만 필요할 때 | Patch Manager 대신 **Run Command**로 스크립트 실행. |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 여러 EC2에 CloudWatch 에이전트 설정 추가 | 설정을 **Parameter Store**에 저장. **Run Command**로 AWS-ApplyCloudWatchAgentConfiguration, **append-config**로 기존 설정에 추가. |
| 제로데이 스크립트를 관련 인스턴스 전부에 실행 | **Run Command** AWS-RunShellScript/AWS-RunPowerShellScript. **Targets**를 태그로 지정. 실행 이력으로 증명. |
| 동일 설정을 인스턴스마다 주기 적용 | **Parameter Store** + **State Manager** 연동(AmazonCloudWatch-ManageAgent 등). |
| “가장 운영 효율적인” 일괄 명령 실행 | Run Command로 코드/배포 없이 SSM 문서 실행. |

---

## 요약

| 항목 | 내용 |
|------|------|
| 용도 | 일괄 설정 변경, 로그 수집, 긴급 스크립트·설정 배포. |
| 출력 | 콘솔, S3, CloudWatch Logs. |
| 기출 포인트 | CloudWatch 에이전트 append-config via Run Command, 제로데이 스크립트 일괄 실행, Parameter Store + State Manager. |
