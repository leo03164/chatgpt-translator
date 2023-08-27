# 使用官方的 Node.js 作為基礎映像檔
FROM node:18.13.0

# 建立應用程式資料夾
RUN mkdir -p /root/develop

# 複製應用程式到工作目錄
ADD app /root/develop

# 切換到應用程式工作目錄
WORKDIR /root/develop

# 安裝應用程式相依套件
RUN npm install

# 對外暴露服務的埠號
EXPOSE 32003

# 啟動命令
CMD ["npm","run", "dev"]
