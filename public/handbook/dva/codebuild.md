# CodeBuild

**빌드** 전용 관리형 서비스입니다.

## 동작

- 소스 가져와 **buildspec**에 따라 빌드·테스트·아티팩트 생성.
- Pay-per-use, 서버 관리 없음.

## 연동

- CodePipeline 액션, GitHub 등 소스. S3·ECR 등 아티팩트 출력.

## 요약

- CodeBuild = 관리형 빌드. buildspec으로 단계 정의, 파이프라인에서 호출.
