# CodeBuild

**빌드·테스트** 전용 관리형 서비스입니다. **buildspec**으로 단계를 정의하고, CodePipeline 액션으로 호출해 소스 가져오기·빌드·테스트·아티팩트 생성을 수행합니다.

---

## 1. 특징

- **buildspec.yml**: **phases**(install, pre_build, build, post_build), **artifacts**, **reports**(테스트 리포트), **env** 등 정의. 빌드·테스트 명령을 여기에 기술.
- **테스트 리포트**: **reports** 섹션으로 JUnit 등 형식의 테스트 결과를 CodeBuild 콘솔에 연동. 테스트 실패 시 빌드 실패로 처리 가능.
- **환경 변수**: **Parameter Store·Secrets Manager** 참조 가능. 대량 변수는 문자 수 제한 있으므로 Parameter Store 등 사용 권장.
- **캐시**: **로컬 캐시**로 의존성 다운로드 감소 → 빌드 시간 단축. 캐시 경로를 buildspec에 지정.
- **소스**: CodePipeline에서 전달된 소스 아티팩트 또는 직접 연결(CodeCommit, S3 등).

---

## 2. 시나리오

| 조건 | 선택 |
|------|------|
| **단위 테스트** 자동 실행·리포트 | CodeBuild buildspec에 **test** 단계·**reports** 설정; 파이프라인에서 빌드 스테이지 **전**에 배치 |
| **빌드 느림** | **캐시** 활성화(로컬 캐시·경로 지정); CodeArtifact 등 의존성 캐시 |
| **환경 변수 과다·제한** | AWS Systems Manager **Parameter Store**에 저장 후 buildspec·프로젝트에서 참조 |
| **DB credentials·시크릿** | Parameter Store **SecureString** 또는 **Secrets Manager**; 빌드 역할에 권한 부여 |
| **CI/CD에 테스트 포함** | 파이프라인에 CodeBuild 스테이지 추가, **소스 아티팩트**를 입력으로 지정 |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 단위 테스트 자동 실행·테스트 리포트 | CodeBuild **buildspec**에 test 단계·**reports** 설정; 배포 스테이지 **전**에 CodeBuild 스테이지. |
| 환경 변수 과다·문자 수 제한 | **Parameter Store**에 저장 후 buildspec·프로젝트에서 참조. |
| DB·시크릿 credentials | **Parameter Store SecureString** 또는 **Secrets Manager**; 빌드 역할에 권한 부여. |
| 빌드 느림 | **로컬 캐시** 활성화; buildspec에 캐시 경로 지정. |

---

## 요약

| 항목 | 설명 |
|------|------|
| CodeBuild | buildspec 기반 빌드·테스트, Pay-per-use |
| 테스트 | buildspec phases + reports로 테스트·리포트 연동 |
| 조건 | "테스트 자동화" → CodeBuild buildspec / "대량 변수" → Parameter Store |
