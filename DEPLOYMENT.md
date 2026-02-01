# CSE Quiz Platform - Deployment Guide

## 🚀 Deployment Options

### Option 1: Docker Deployment (Recommended)

#### Prerequisites
- Docker and Docker Compose installed
- PostgreSQL database (or use the included Docker PostgreSQL service)

#### Steps

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd cse-quiz-platform
```

2. **Configure environment variables**
```bash
# Copy and edit production environment files
cp .env.production.example .env.production
```

Edit `.env.production` with your production credentials:
- `DATABASE_URL`: Your PostgreSQL connection string
- `JWT_SECRET`: Generate a secure random string
- `OPENAI_API_KEY`: Your OpenAI API key
- `CORS_ORIGIN`: Your frontend domain

3. **Build and start services**
```bash
docker-compose up -d
```

4. **Run database migrations**
```bash
docker-compose exec api pnpm prisma migrate deploy
```

5. **Create admin user**
```bash
# Access the running API container
docker-compose exec api sh

# Use Prisma Studio or create via API
npx prisma studio
```

### Option 2: Manual Deployment

#### Backend (NestJS API)

**Deploy to Railway, Render, or Fly.io:**

1. **Build the project**
```bash
pnpm install
pnpm --filter @cse-quiz/shared build
pnpm --filter @cse-quiz/ai build
pnpm --filter @cse-quiz/api build
```

2. **Set environment variables** on your hosting platform

3. **Start the application**
```bash
cd apps/api
pnpm start:prod
```

#### Frontend (Next.js)

**Deploy to Vercel (Recommended):**

1. **Connect your repository to Vercel**

2. **Configure build settings:**
   - Build Command: `cd apps/web && pnpm build`
   - Output Directory: `apps/web/.next`
   - Install Command: `pnpm install`

3. **Set environment variables:**
   - `NEXT_PUBLIC_API_URL`: Your API URL

**Alternative: Deploy to Netlify, Railway, or other platforms**

Similar setup with adjusted build commands.

### Option 3: VPS Deployment (Ubuntu)

#### Prerequisites
- Ubuntu 20.04+ VPS
- Domain name pointed to your VPS

#### Steps

1. **Install Node.js and pnpm**
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
npm install -g pnpm
```

2. **Install PostgreSQL**
```bash
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

3. **Clone and setup project**
```bash
git clone <your-repo-url>
cd cse-quiz-platform
chmod +x setup.sh
./setup.sh
```

4. **Configure Nginx**
```bash
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/cse-quiz
```

Add configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Enable site and setup SSL**
```bash
sudo ln -s /etc/nginx/sites-available/cse-quiz /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# Install Certbot for SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

6. **Setup PM2 for process management**
```bash
npm install -g pm2

# Start backend
cd apps/api
pm2 start npm --name "cse-quiz-api" -- start

# Start frontend
cd ../web
pm2 start npm --name "cse-quiz-web" -- start

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🔐 Security Checklist

- [ ] Change all default passwords
- [ ] Set strong JWT_SECRET
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable firewall (ufw)
- [ ] Regular database backups
- [ ] Update dependencies regularly
- [ ] Monitor error logs

## 📊 Monitoring

### Setup Application Monitoring

1. **Use PM2 monitoring**
```bash
pm2 monit
```

2. **Setup log rotation**
```bash
pm2 install pm2-logrotate
```

3. **Configure external monitoring** (Optional)
   - Sentry for error tracking
   - New Relic or DataDog for performance
   - Uptime monitoring (UptimeRobot, Pingdom)

## 🔄 Updates and Maintenance

### Pull latest changes
```bash
git pull origin main
pnpm install
pnpm build
pm2 restart all
```

### Database migrations
```bash
cd apps/api
pnpm prisma migrate deploy
```

### Backup database
```bash
pg_dump -U postgres cse_quiz > backup_$(date +%Y%m%d).sql
```

## 🆘 Troubleshooting

### Common Issues

1. **Database connection failed**
   - Check DATABASE_URL in .env
   - Verify PostgreSQL is running
   - Check firewall settings

2. **CORS errors**
   - Verify CORS_ORIGIN matches frontend URL
   - Check API is accessible from frontend

3. **OpenAI API errors**
   - Verify OPENAI_API_KEY is valid
   - Check rate limits and billing

4. **Build failures**
   - Clear node_modules and reinstall
   - Check Node.js version (18+)
   - Verify all environment variables

## 📞 Support

For issues and questions:
- GitHub Issues: [your-repo-url]/issues
- Documentation: [your-docs-url]
