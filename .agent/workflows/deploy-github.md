---
description: GitHub 저장소에 현재 프로젝트 업로드 및 업데이트
---

이 워크플로우는 현재 개발된 코드를 사용자의 GitHub 저장소(`https://github.com/gimong70/polymarket.git`)에 업로드하기 위한 최적의 단계를 안내합니다.

### 1단계: Git 초기화 및 파일 추가
아직 로컬 저장소가 설정되지 않은 경우 아래 명령어를 순서대로 실행하세요.

// turbo
```bash
git init
git add .
git commit -m "Initial commit: Futuristic Portfolio for @2ndNLife"
```

### 2단계: 브랜드(Branch) 설정 및 원격 저장소 연결
기존 마스터 브랜치를 `main`으로 변경하고 GitHub 저장소를 연결합니다.

// turbo
```bash
git branch -M main
git remote add origin https://github.com/gimong70/polymarket.git
```

### 3단계: 최종 업로드 (Push)
코드를 GitHub 서버로 전송합니다.

// turbo
```bash
git push -u origin main
```

> [!NOTE]
> 만약 깃허브 계정 로그인이 되어있지 않다면, 명령 실행 중 로그인 창이 뜰 수 있습니다.
