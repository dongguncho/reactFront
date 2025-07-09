# Nginx 베이스 이미지
FROM nginx:alpine

# 빌드된 파일을 Nginx로 복사
COPY build/ /usr/share/nginx/html

# Nginx 설정 복사
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 포트 노출
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]