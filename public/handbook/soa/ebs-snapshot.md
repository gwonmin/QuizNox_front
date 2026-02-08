# EBS 스냅샷

**EBS 볼륨**의 특정 시점 **증분 백업**입니다. 볼륨 복원·AMI·크로스 리전 복사에 사용됩니다.

---

## 특징

- **증분**: 최초 스냅샷 이후 **변경된 블록만** 저장. 여러 스냅샷이 있어도 중복 블록은 한 번만 과금.
- **복원**: 새 볼륨 생성 또는 기존 볼륨 교체. **Fast Snapshot Restore(FSR)** 사용 시 해당 AZ에서 즉시 최대 성능.
- **암호화**: 스냅샷 복사 시 **Encrypted=true**, KMS 키 지정 가능. 크로스 리전 백업 시 DLM 등으로 암호화 복사.
- **삭제 보호**: **Recycle Bin** 보존 규칙으로 삭제 후 일정 기간 복구 가능.
- **CloudFormation**: RDS·EC2 등 리소스 삭제 시 스냅샷만 남기려면 **DeletionPolicy: Snapshot**(RDS), **Retain**(EC2).

---

## 시나리오

| 시나리오 | 접근 |
|----------|------|
| 백업 3회분 저장 용량 계산 | 증분이므로 “전체 용량×횟수”가 아님. 변경분 누적. |
| 스냅샷 복원 후 즉시 최대 IOPS 필요 | **EBS Fast Snapshot Restore(FSR)**를 해당 AZ에 활성화 후 복원. |
| 실수로 스냅샷 삭제 후 복구 | **Recycle Bin** 보존 규칙으로 스냅샷 삭제 후 N일간 복구 가능. |
| 스택 삭제 시 RDS 데이터만 유지 | RDS 리소스에 **DeletionPolicy: Snapshot**. |
| 여러 리전 EBS 볼륨 암호화 백업 | **AWS Backup** 또는 **DLM**으로 크로스 리전 복사 + KMS 암호화. |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| 스냅샷 여러 개 저장 용량(증분) | “전체×횟수” 아님. **변경된 블록만** 누적. 10+4+2 GiB 변경이면 16 GiB 등. |
| 복원 후 즉시 최대 IOPS 필요 | **EBS Fast Snapshot Restore(FSR)**를 해당 AZ에 활성화 후 복원. |
| 실수로 스냅샷 삭제 후 복구 | **Recycle Bin** 보존 규칙으로 N일간 복구. |
| 스택 삭제 시 RDS/EC2 데이터만 유지 | RDS **DeletionPolicy: Snapshot**. EC2 **Retain**. |
| 크로스 리전·암호화 백업 | **DLM** 또는 **AWS Backup**으로 복사 시 Encrypted=true, KMS 지정. |

---

## 요약

| 항목 | 내용 |
|------|------|
| 저장 | 증분 백업. 여러 스냅샷도 중복 블록 1회 과금. |
| 즉시 성능 | FSR 사용 시 해당 AZ에서 복원 볼륨이 즉시 최대 성능. |
| 기출 포인트 | 증분 용량, FSR, Recycle Bin, DeletionPolicy Snapshot/Retain, DLM 암호화 복사. |
