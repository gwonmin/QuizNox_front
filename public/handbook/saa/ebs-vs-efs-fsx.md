# EBS vs EFS vs FSx

**스토리지 유형**별 차이입니다. 단일 인스턴스 블록이면 EBS, 다중 인스턴스 공유 파일이면 EFS, Windows·Lustre 등 특수 요구면 FSx를 선택합니다.

---

## 특징

| 구분 | EBS | EFS | FSx |
|------|-----|-----|-----|
| **형태** | 블록 스토리지 | 파일 스토리지(NFS) | 파일(Windows/Lustre 등) |
| **공유** | 단일 인스턴스에만 연결 | 다중 인스턴스 동시 마운트 | 용도별(Windows 공유·HPC 등) |
| **가용성** | 단일 AZ(스냅샷으로 복제) | 다중 AZ | 구성에 따름 |
| **용도** | EC2 루트·데이터 볼륨 | 리눅스 공유 파일 시스템 | Windows 파일 서버·Lustre |

---

## 시나리오

| 조건 | 선택 |
|------|------|
| EC2 한 대 전용 디스크 | EBS |
| 여러 EC2가 같은 파일 시스템 공유(리눅스) | EFS |
| Windows 파일 서버·AD 연동 | FSx for Windows |
| HPC·대용량 처리 | FSx for Lustre |
| 프로덕션→테스트 복제 시간 최소·고IOPS 유지 | EBS 스냅샷 + Fast Snapshot Restore |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 여러 EC2가 같은 파일 공유(리눅스) | **EFS**로 이전; ALB 뒤 인스턴스 간 일관된 파일. |
| 대용량 일회 이전·네트워크 최소 | **Snowball / Snowball Edge** → S3 적재. |
| 온프레미스 NFS/SMB + S3 라이프사이클 | **S3 File Gateway** + S3 Lifecycle. |
| EBS 프로덕션→테스트 복제·즉시 고성능 | **EBS Fast Snapshot Restore(FSR)**. |
| Windows 온프레미스·AWS 공존 | **FSx for Windows** + **FSx File Gateway**. |

---

## 요약

| 항목 | 설명 |
|------|------|
| EBS | 블록, 단일 인스턴스 |
| EFS | 파일(NFS), 다중 인스턴스 공유 |
| FSx | Windows·Lustre 등 특수 시나리오 |
| 조건 | "공유 파일(리눅스)" → EFS / "Windows·HPC" → FSx |
