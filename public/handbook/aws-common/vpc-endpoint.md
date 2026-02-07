# VPC Endpoint

**VPC 안에서** 퍼블릭 인터넷을 거치지 않고 **AWS 서비스**에 접근하게 하는 구성입니다.

## 유형

- **Gateway Endpoint**: S3, DynamoDB 등. 라우팅 테이블에 경로 추가.
- **Interface Endpoint**: 그 외 대부분 서비스(EC2 API, SQS, SNS 등). ENI 형태, PrivateLink.

## 효과

- 퍼블릭 인터넷·NAT를 타지 않아 **지연·비용·보안** 측면에서 유리
- VPC 내부 트래픽만 사용

## 요약

- Gateway Endpoint: S3/DynamoDB, 라우팅 기반
- Interface Endpoint: ENI 기반, PrivateLink
