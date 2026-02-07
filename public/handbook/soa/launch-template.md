# Launch Template

**EC2 인스턴스 시작 설정**을 재사용 가능한 템플릿으로 정의합니다.

## 동작

- AMI, 인스턴스 타입, 스토리지, 네트워크, 태그 등 **한 번 정의** 후 재사용.
- ASG·Spot 등에서 Launch Template 지정해 일관된 인스턴스 생성.

## Launch Configuration과 차이

- Launch Template은 **버전** 관리·다양한 조합 가능. Launch Config는 단일 설정.

## 요약

- Launch Template = 인스턴스 시작 설정 템플릿. 버전 관리·재사용.
