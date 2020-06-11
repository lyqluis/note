## nginx.conf
```
server{
                listen  80;
                #listen [::]:80 default_server;
                #server_name  rousetime.com; # 替换成自己的域名
                root    /home/git/blog/hexo;
                #root   /usr/share/html/blog; # 博客所在目录

                #Load configuration files for the default server block.
                include /etc/nginx/default.d/*.conf;
                #include hexo.conf; # 引入hexo.conf

                location / {
                        root    /home/git/blog/hexo;
                        #root /usr/share/html/blog; # 博客所在目录
                        index index.html index.htm;
                }

                error_page 404 /404.html;
                location = /40x.html {
                #       root /usr/share/nginx/html/blog; # 博客所在目录
                }
                error_page 500 502 503 504 /50x.html;
                location = /50x.html {
                        #root /usr/share/nginx/html/blog; # 博客所在目录
                }

        }
```
