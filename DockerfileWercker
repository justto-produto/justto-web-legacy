FROM gcr.io/justto-ml/nginx:1.13.12-alpine
LABEL Author="lucas@justto.com.br"
ADD dist /usr/share/nginx/html
ADD nginx/nginx.conf /etc/nginx/nginx.conf
ADD nginx/proxy_params /etc/nginx/proxy_params
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
