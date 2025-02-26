<VirtualHost *:80>
    ServerName api.pupify.ca
    ServerAlias www.api.pupify.ca
    ServerAdmin Connie6792@gmail.com

    ProxyPreserveHost On

    # WebSocket traffic
    <IfModule mod_proxy_wstunnel.c>
        ProxyPass /socket.io/ ws://127.0.0.1:5000/socket.io/
        ProxyPassReverse /socket.io/ ws://127.0.0.1:5000/socket.io/
    </IfModule>

    # Regular HTTP traffic
    ProxyPass / http://127.0.0.1:5000/
    ProxyPassReverse / http://127.0.0.1:5000/

    # Rewrite Engine for transport=polling
    RewriteEngine on
    RewriteCond %{QUERY_STRING} transport=polling
    RewriteRule ^/(.*)$ http://127.0.0.1:5000/$1 [P,L]

    <Directory "/var/www/classifiedapplication">
        AllowOverride All
    </Directory>
RewriteCond %{SERVER_NAME} =api.pupify.ca [OR]
RewriteCond %{SERVER_NAME} =www.api.pupify.ca
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>

<VirtualHost *:80>
        ServerName api.pupify.ca
        ServerAlias www.api.pupify.ca
        ServerAdmin Connie6792@gmail.com
        ProxyPreserveHost On
        ProxyPass / http://127.0.0.1:5000/
        ProxyPassReverse / http://127.0.0.1:5000/
        <Directory "/var/www/classifiedapplication">
                AllowOverride All
        </Directory>
RewriteEngine on
RewriteCond %{SERVER_NAME} =www.api.pupify.ca [OR]
RewriteCond %{SERVER_NAME} =api.pupify.ca
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>


<VirtualHost *:80>
        ServerName adminpanel.pupify.ca
        ServerAlias adminpanel.pupify.ca
        ServerAdmin Connie6792@gmail.com
        ProxyPreserveHost On
        ProxyPass / http://127.0.0.1:3000/
        ProxyPassReverse / http://127.0.0.1:3000/
        <Directory "/var/www/classifiedadminpanel">
                AllowOverride All
        </Directory>
RewriteEngine on
RewriteCond %{SERVER_NAME} =adminpanel.pupify.ca
RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [END,NE,R=permanent]
</VirtualHost>