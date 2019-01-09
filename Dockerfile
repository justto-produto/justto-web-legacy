FROM nginx:1.13.12-alpine
MAINTAINER lucas@justto.com.br
ADD dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
