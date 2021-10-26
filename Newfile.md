# Todolist 待辦清單
* 登入
![](https://i.imgur.com/x6eFtVY.png)
* 註冊
![](https://i.imgur.com/2ZwxMC6.png)
* 作業區
![](https://i.imgur.com/rpyCpew.png)

# 遇到的問題

## 1. 路徑
* 就...路徑
```javascript=
app.delete('/user/del') =>  app.delete('/user/:user')
app.put('/user/put')    =>  app.put('/user/:user')
app.post('/user/post')  =>  app.post('/user/:user')
app.get('/user')        =>  app.get('/user/:user')
```
## 2. 命名
* 駝峰式大小寫
```javascript=
GivemeId => giveMeId
get_old_elm =>getOldElm
```
* 資料庫命名
```json=
    date_id = 1634751215749 => timestamp = 1634751215749
    
    status = "未完成" => list-status = "未完成"
```
## 3. 資料呼叫
* 保持距離
* 前端資料處理層與視圖邏輯層分離
```javascript=
整頁式刷新 => 部分刷新 => 特定刷新
```
## 4. Format
* 讓code有更好的可讀性
* 尋找規律或是重複出現的東西