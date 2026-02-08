# VPC Flow Logs

**VPC·서브넷·ENI** 단위의 **네트워크 트래픽** 로그(Accept/Reject, 5튜플 등)입니다.

---

## 특징

- **방향**: 수신(inbound)·송신(outbound). **필터**: All, Accept, Reject 중 선택. **Reject만 보려면** 별도 flow log를 “Reject” 또는 “All”로 두고 분석.
- **대상**: CloudWatch Logs 또는 S3. CloudWatch일 때 **IAM 역할**에 logs:CreateLogGroup 등 필요.
- **형식**: 기본 형식 또는 **커스텀 형식**(필드 선택). **tcp-flags** 등 추가하려면 **새 flow log**를 커스텀 형식으로 생성. 기존 flow log는 형식 수정 불가.
- **범위**: 해당 VPC/서브넷/ENI의 트래픽만. **온프레미스→VPC** 트래픽은 Flow Log에 잡히지 않음.
- 트러블슈팅: NACL·SG 차단, 일시적 포트(ephemeral) 부족 등 확인.

---

## 시나리오

| 시나리오 | 접근 |
|----------|------|
| Reject된 트래픽이 로그에 안 보임 | Flow Log **필터**가 Accept만 되어 있을 수 있음. **All** 또는 **Reject**로 새 flow log 생성. |
| tcp-flags 등 필드 추가하고 싶음 | 기존 flow log는 형식 변경 불가. **새 flow log** 생성 시 **커스텀 로그 형식**에 tcp-flags 포함. |
| Flow Log가 CloudWatch에 안 쌓임 | **IAM 역할**에 CreateLogGroup, CreateLogStream, PutLogEvents 등 권한 확인. |
| NLB 뒤 트래픽이 거절됨 | NACL에서 **아웃바운드 ephemeral 포트**(1024–65535) 허용 여부 확인. Flow Log로 거절 로그 확인. |
| 온프레미스와 비교해 트래픽이 적게 보임 | VPC Flow Logs는 **VPC 내 트래픽**만 기록. 온프레미스→VPC 구간은 미포함. |
| HTTPS(443) 실패 원인 | Flow Log + NACL/SG 확인. NACL이 443 아웃바운드 차단 등. |

---

## 기출빈출

| 시나리오 | 접근 |
|----------|------|
| Reject된 트래픽이 로그에 안 보임 | Flow Log **필터**가 Accept만 있음. **All** 또는 **Reject**로 새 flow log 생성. |
| tcp-flags 등 필드 추가 | 기존 flow log는 형식 수정 불가. **새 flow log**를 **커스텀 형식**으로 생성. |
| Flow Log가 CloudWatch에 안 쌓임 | **IAM 역할**에 CreateLogGroup, CreateLogStream, PutLogEvents 등 필요. |
| NACL ephemeral로 NLB/ALB 응답 차단 | NACL **아웃바운드**에 **ephemeral 포트**(1024–65535) 허용. |
| VPC 내 트래픽만 기록됨 | Flow Logs는 **VPC/서브넷/ENI** 트래픽만. 온프레미스→VPC 구간 미포함. |

---

## 요약

| 항목 | 내용 |
|------|------|
| 용도 | 트러블슈팅(차단 구간), 보안 분석, 트래픽 패턴. |
| 필터/형식 | Accept·Reject·All. 커스텀 형식은 새 flow log로만 가능. |
| 기출 포인트 | Reject 보려면 All/Reject 필터, tcp-flags=커스텀 새 flow log, IAM CreateLogGroup, NACL ephemeral, VPC 내만 기록, 443 차단. |
