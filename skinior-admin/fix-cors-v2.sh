#!/bin/bash

# Create updated config without nginx CORS headers (let backend handle CORS)
cat > /tmp/skinior.com.conf << 'NGINX_EOF'
server {
    server_name skinior.com www.skinior.com;

    # API routes - proxy to backend on port 4008 (no CORS headers - backend handles it)
    location /api {
        proxy_pass http://127.0.0.1:4008;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 86400;
    }

    # All other routes - proxy to frontend on port 3007
    location / {
        proxy_pass http://127.0.0.1:3007;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        proxy_buffering off;
        proxy_read_timeout 86400;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;

    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/skinior.com/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/skinior.com/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot
}

server {
    if ($host = www.skinior.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    if ($host = skinior.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot

    listen 80;
    server_name skinior.com www.skinior.com;
    return 404; # managed by Certbot
}
NGINX_EOF

# Copy to sites-available
sudo cp /tmp/skinior.com.conf /etc/nginx/sites-available/skinior.com.conf

# Test nginx config
sudo nginx -t

# If test passes, reload nginx
if [ $? -eq 0 ]; then
    sudo systemctl reload nginx
    echo "✅ Nginx configuration updated - backend handles CORS!"
    echo "🔄 Testing API access..."
    curl -H "Origin: https://admin.skinior.com" -I https://skinior.com/api/products
else
    echo "❌ Nginx configuration test failed."
fi
