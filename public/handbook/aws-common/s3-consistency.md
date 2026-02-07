# S3 Consistency 모델

S3의 **읽기 일관성** 동작 방식입니다.

## Strong Read-After-Write (현재)

- **PUT/OVERWRITE/DELETE 직후** 같은 키로 GET하면 최신 결과 보장
- 신규 PUT 후 즉시 읽기 가능(이전에는 eventual이었으나 현재는 strong)

## 멀티파트·버전 등

- 멀티파트 업로드 완료 후 목록 일관성 등은 문서 참고
- 버전링 켜면 이전 버전 읽기 시 일관된 동작

## 요약

- 새 객체 PUT 후 읽기 = strong read-after-write
- 덮어쓰기·삭제 후 읽기도 최신 반영
