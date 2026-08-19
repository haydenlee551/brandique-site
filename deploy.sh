#!/bin/bash
# iCloud 원본 → 배포 폴더 복사 후 GitHub에 푸시
# 사용법: ~/brandique-site/deploy.sh  ("수정 내용" 을 인자로 줄 수 있음)
set -e
SRC="/Users/fa/Library/Mobile Documents/com~apple~CloudDocs/Autoworker_Dilly/brandique"
DST="$HOME/brandique-site"
cp "$SRC/index.html" "$SRC/survey.html" "$SRC/legal.html" "$DST/"
cp "$SRC/setup/apps-script.gs" "$SRC/setup/README.md" "$DST/setup/"
cd "$DST"
git add -A
git commit -m "${1:-사이트 업데이트}" || { echo "변경 사항 없음"; exit 0; }
git push
echo "✅ 배포 완료 — 반영까지 1~2분 걸립니다: https://brandique.co.kr"
