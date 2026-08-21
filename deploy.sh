#!/bin/bash
# iCloud 원본 → 배포 폴더 복사 후 GitHub에 푸시
# 사용법: ~/brandique-site/deploy.sh  ("수정 내용" 을 인자로 줄 수 있음)
set -e
SRC="/Users/fa/Library/Mobile Documents/com~apple~CloudDocs/Autoworker_Dilly/brandique"
DST="$HOME/brandique-site"
# admin.html 은 내부 도구라 배포하지 않습니다
cp "$SRC/index.html" "$SRC/survey.html" "$SRC/legal.html" "$SRC/works.html" "$SRC/works.js" "$SRC/works-data.js" "$SRC/board-data.js" "$DST/"
cp "$SRC/robots.txt" "$SRC/sitemap.xml" "$DST/"
cp "$SRC/setup/apps-script.gs" "$SRC/setup/README.md" "$DST/setup/"
# assets 는 원본과 똑같이 맞춘다 (지운 파일이 배포본에 남지 않도록)
mkdir -p "$DST/assets"
rsync -a --delete --exclude "_raw" "$SRC/assets/" "$DST/assets/"
cd "$DST"
git add -A
git commit -m "${1:-사이트 업데이트}" || { echo "변경 사항 없음"; exit 0; }
git push
echo "✅ 배포 완료 — 반영까지 1~2분 걸립니다: https://brandique.co.kr"
