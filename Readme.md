# Yêu cầu
Máy cần cài: 
* Nodejs (v12 trở lên) (hiện tại sử dụng v12.13.1)
* npm (v6 trở lên) (hiện tại sử dụng v6.12.1)

Một database MySQL
# Hướng dẫn chạy hệ thống:

## Chạy backend:
Bước 1: Mở thư mục backend ```cd backend```   
Bước 2: Chạy lệnh ```npm install``` để tải node_modules   
Bước 3: Chạy lệnh ```npm start``` để chạy backend
## Chạy frontend:
Chú ý: Cần mở 1 terminal khác terminal chạy backend


Có thể chạy theo 2 cách: Chạy thử nghiệm(development) hoặc build and run

### Chạy thử nghiệm(development) 
Bước 1: Mở thư mục frontend ```cd frontend```   
Bước 2: Chạy lệnh ```npm install``` để tải node_modules   
Bước 3: Chạy lệnh ```npm start``` để chạy frontend

### Build and run
Bước 1: Mở thư mục frontend ```cd frontend```   
Bước 2: Chạy lệnh ```npm install``` để tải node_modules   
Bước 3: Chạy lệnh ```npm run build``` để build frontend         
Bước 4: Chạy lệnh ```serve -s build -l 3000``` để chạy frontend, nếu không được hãy thử ```npm install serve -g``` và thử lại hoặc ```npx serve -s build -l 3000```
