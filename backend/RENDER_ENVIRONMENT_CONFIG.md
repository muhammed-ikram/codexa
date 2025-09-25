# Render Backend Environment Configuration

## 🔧 Required Environment Variables for Render

Configure these environment variables in your Render dashboard:

### **Database Configuration**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/codexa?retryWrites=true&w=majority
```

### **Frontend Configuration**
```
FRONTEND_ORIGIN=https://codexa-ochre.vercel.app
FRONTEND_URL=https://codexa-ochre.vercel.app
```

### **AI Service Configuration**
```
BEDROCK_API_KEY=your_bedrock_api_key_here
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
```

### **JWT Configuration**
```
JWT_SECRET=your_super_secure_jwt_secret_here
```

### **Email Configuration (if using)**
```
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🚀 Render Deployment Settings

### **Build Command**
```bash
npm install
```

### **Start Command**
```bash
npm start
```

### **Environment**
```
Node
```

### **Node Version**
```
18.x
```

## 🔒 Security Features Enabled

- ✅ CORS configured for Vercel frontend
- ✅ Security headers (XSS protection, content type options)
- ✅ Trust proxy for Render
- ✅ Increased JSON payload limit (50MB)
- ✅ Wildcard support for Vercel preview deployments

## 🌐 CORS Configuration

Your backend now allows requests from:
- `https://codexa-ochre.vercel.app` (your production frontend)
- `https://*.vercel.app` (Vercel preview deployments)
- `https://*.onrender.com` (Render preview deployments)
- `http://localhost:5173` (local development)

## 📝 How to Configure in Render

1. Go to your Render dashboard
2. Select your backend service
3. Go to "Environment" tab
4. Add each environment variable listed above
5. Save and redeploy

## 🧪 Testing the Connection

After deployment, test the connection:

```bash
# Test health endpoint
curl https://codexa-api.onrender.com/healthz

# Test CORS with your frontend
curl -H "Origin: https://codexa-ochre.vercel.app" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://codexa-api.onrender.com/api/auth/profile
```

## 🔍 Troubleshooting

### CORS Issues
- Ensure `FRONTEND_ORIGIN` is set to `https://codexa-ochre.vercel.app`
- Check that your frontend is making requests to the correct backend URL

### Database Connection
- Verify `MONGODB_URI` is correct and accessible
- Check MongoDB Atlas IP whitelist includes Render's IP ranges

### AI Services
- Ensure Bedrock API keys are valid and have proper permissions
- Verify AWS region matches your Bedrock service region
