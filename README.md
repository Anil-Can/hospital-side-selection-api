# Hospital-Side-Selection-API

Bu cbs projesinde yapılan ve elde edilen data ve analizlerin web üzerinde göstermesini sağlayan Bu uyguluma [hospital-side-selection](https://github.com/Anil-Can/hospital-side-selection) backend uygulamasıdır.


### Uygulama Gereksinimleri

[Node-JS](https://nodejs.org/en/)
[Docker](https://www.docker.com/)

### Kurulumu

Uygulmanın kurulması için 2 uygulamada aynı klasörde olmak zorundadır.

```
project/
  hospital-side-selection
  hospital-side-selection-api
```
Gerekli docker image ve containerları oluşturmak için apide ```docker-compose up -d``` komudu çalıştırılır.Bu işlem birkaç dakika sürecektir.

## VeriTabanı Ayarı
- .env.example adında bir dosya bulunmaktadır.
- Bu dosya ismini .env olarak değiştirip veritabanı bilgileri ile uygulumanın çalışacağı portu dolurmanız gereklidir.
- Db host ksımına posstresql servisi ismi yazılmaldıır.Eğer yml dosyasında değişklik yapmadıysanız db olarak girin
- <b>postgresql_db</b>  docker containerinde içersinde tüm tabloların olduğu bir backup dosyası bulunmaktadır.
- Öncelikle bu backup dosyasını restore etmelisiniz.
- Bu containerin terminalı açılıp ```pg -restore -U |dbuser| -h |serviceName| -d |dbname| dc/hospital.backup``` komudu çalışıtırılır.
- Örnek Komut ```pg -restore -U postgres -h db postgres /dc/hospital.backup```

## NGINX

- Bu uygulma tüm port yönlendirmeleri [Nginx](https://www.nginx.com/) üzerinden yapıldı.
- Yönlendirmeleri değiştirmek için ***nginx/conf.d/default.conf*** dosyasında değiştirebilirsiniz
