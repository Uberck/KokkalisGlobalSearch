# Deployment Guide — Kokkalis Global Search

This guide provides detailed instructions for deploying the Kokkalis Global Search website to various hosting platforms.

---

## Table of Contents

1. [AWS S3 + CloudFront (Professional Setup)](#aws-s3--cloudfront)
2. [GitHub Pages (Easiest & Free)](#github-pages)
3. [Netlify (Recommended for Beginners)](#netlify)
4. [Vercel](#vercel)
5. [AWS Amplify (Auto-Deploy from GitHub)](#aws-amplify)

---

## AWS S3 + CloudFront

**Best for:** Production websites with custom domains and HTTPS  
**Cost:** ~$1-5/month (often free tier eligible)  
**Time:** 20-30 minutes  
**Difficulty:** Intermediate

### Prerequisites

- AWS Account ([Sign up here](https://aws.amazon.com/))
- AWS CLI installed (optional, but helpful)
- Domain name (optional, for custom domain)

### Step 1: Create S3 Bucket

1. **Log into AWS Console** → Navigate to **S3**
2. Click **Create bucket**
3. **Bucket name:** 
   - If using custom domain: `www.kokkalisglobal.com` (must match domain exactly)
   - Otherwise: Any unique name like `kokkalis-recruiting-website`
4. **Region:** Choose closest to your audience (e.g., `us-east-1`)
5. **Block Public Access settings:**
   - **UNCHECK** "Block all public access"
   - Check the acknowledgment box (you need public access for a website)
6. Leave other settings as default
7. Click **Create bucket**

### Step 2: Upload Website Files

1. Click into your newly created bucket
2. Click **Upload**
3. **Add files:**
   - `index.html`
   - `styles.css` (if you separated CSS)
   - `scripts.js` (if you separated JS)
   - Any other assets
4. Click **Upload**
5. Wait for upload to complete

### Step 3: Enable Static Website Hosting

1. In your bucket, go to **Properties** tab
2. Scroll down to **Static website hosting**
3. Click **Edit**
4. Select **Enable**
5. **Index document:** `index.html`
6. **Error document:** `index.html` (optional, redirects 404s to homepage)
7. Click **Save changes**
8. **Copy the Bucket website endpoint URL** (e.g., `http://kokkalis-recruiting-website.s3-website-us-east-1.amazonaws.com`)
   - You'll find this in the Static website hosting section

### Step 4: Set Bucket Policy for Public Read Access

1. Go to **Permissions** tab
2. Scroll to **Bucket policy**
3. Click **Edit**
4. Paste the following policy (replace `YOUR-BUCKET-NAME` with your actual bucket name):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

5. Click **Save changes**

### Step 5: Test Your Website

1. Visit the **S3 website endpoint** URL from Step 3
2. Your website should load successfully
3. If you get Access Denied, double-check:
   - Public access is enabled
   - Bucket policy is correct
   - Files are uploaded

**🎉 Your site is now live on S3!** But it's HTTP only. Continue for HTTPS and custom domain...

---

### Step 6: Set Up CloudFront (HTTPS + CDN)

CloudFront adds:
- HTTPS/SSL encryption
- Global CDN (faster load times worldwide)
- Custom domain support

#### 6.1 Create CloudFront Distribution

1. Go to **CloudFront** in AWS Console
2. Click **Create Distribution**
3. **Origin domain:** 
   - **DO NOT** select the S3 bucket from dropdown
   - Manually enter your **S3 website endpoint** (from Step 3)
   - Example: `kokkalis-recruiting-website.s3-website-us-east-1.amazonaws.com`
   - **Why?** Using the website endpoint (not bucket name) ensures proper redirects
4. **Protocol:** HTTP only (S3 static hosting doesn't support HTTPS origin)
5. **Viewer protocol policy:** Redirect HTTP to HTTPS
6. **Allowed HTTP methods:** GET, HEAD
7. **Cache policy:** CachingOptimized (recommended)
8. **Alternate domain names (CNAMEs):** (Optional, if using custom domain)
   - Add: `kokkalisglobal.com` and `www.kokkalisglobal.com`
9. **Custom SSL certificate:** (If using custom domain)
   - Click **Request certificate** → Opens AWS Certificate Manager
   - Request certificate for `kokkalisglobal.com` and `*.kokkalisglobal.com`
   - Validate via DNS or Email
   - Return to CloudFront and select your certificate
10. **Default root object:** `index.html`
11. Click **Create distribution**

#### 6.2 Wait for Deployment

- Status will show "Deploying" (takes 5-15 minutes)
- Once status is "Enabled", copy the **Distribution domain name**
- Example: `d1a2b3c4d5e6f.cloudfront.net`
- Test: `https://d1a2b3c4d5e6f.cloudfront.net`

**🎉 Your site now has HTTPS!**

---

### Step 7: Configure Custom Domain (Optional)

#### 7.1 Option A: Domain Purchased Through Route 53

1. Go to **Route 53** → **Hosted zones**
2. Click your domain name
3. Click **Create record**
4. **Record name:** Leave blank (for apex domain) or enter `www`
5. **Record type:** A
6. **Alias:** Yes
7. **Route traffic to:** CloudFront distribution
8. Select your CloudFront distribution from dropdown
9. Click **Create records**
10. Repeat for both apex (`kokkalisglobal.com`) and www (`www.kokkalisglobal.com`)

#### 7.2 Option B: Domain from Another Registrar (GoDaddy, Namecheap, etc.)

1. In your domain registrar's DNS settings, add:
   - **CNAME record:**
     - Name: `www`
     - Value: Your CloudFront distribution domain (e.g., `d1a2b3c4d5e6f.cloudfront.net`)
   - **For apex domain (no www):**
     - Some registrars support ALIAS or ANAME records pointing to CloudFront
     - Or use a redirect from apex to www
2. DNS propagation takes 5 minutes to 48 hours

**🎉 Your site is now live with custom domain and HTTPS!**

---

### Updating Your Website

Whenever you make changes:

1. Upload new files to S3 bucket (will overwrite old files)
2. **Invalidate CloudFront cache:**
   - Go to CloudFront → Your distribution → Invalidations
   - Click **Create invalidation**
   - Object paths: `/*` (invalidates everything)
   - Click **Create invalidation**
   - Wait 1-2 minutes for changes to propagate

---

## GitHub Pages

**Best for:** Quick deployment, free hosting  
**Cost:** Free  
**Time:** 2 minutes  
**Difficulty:** Easiest

### Steps

1. **Push your code to GitHub** (already done ✓)
2. Go to your repository on GitHub
3. Click **Settings** → **Pages** (left sidebar)
4. **Source:** Deploy from a branch
5. **Branch:** `main` → `/root` → **Save**
6. Wait 1-2 minutes
7. Your site will be live at: `https://Uberck.github.io/KokkalisGlobalSearch/`

### Custom Domain on GitHub Pages

1. In GitHub Pages settings, enter your custom domain
2. Check "Enforce HTTPS"
3. In your domain registrar, add DNS records:
   - **A records** pointing to GitHub Pages IPs:
     ```
     185.199.108.153
     185.199.109.153
     185.199.110.153
     185.199.111.153
     ```
   - **CNAME record:** `www` → `Uberck.github.io`

**🎉 Done!** GitHub automatically provides SSL.

---

## Netlify

**Best for:** Fastest deployment with auto-updates  
**Cost:** Free  
**Time:** 3 minutes  
**Difficulty:** Very Easy

### Option 1: Drag & Drop (Quickest)

1. Go to [netlify.com](https://www.netlify.com/)
2. Sign up (use GitHub account for easy access)
3. Drag your project folder into the deploy zone
4. Site goes live instantly at `random-name-12345.netlify.app`

### Option 2: GitHub Integration (Recommended)

1. Log in to Netlify
2. Click **Add new site** → **Import an existing project**
3. Choose **GitHub**
4. Authorize Netlify
5. Select your `KokkalisGlobalSearch` repository
6. **Build settings:**
   - Build command: (leave empty, it's static HTML)
   - Publish directory: `/` (or leave empty)
7. Click **Deploy site**
8. Site goes live in ~30 seconds
9. **Auto-deploys:** Every time you push to GitHub, Netlify auto-deploys!

### Custom Domain on Netlify

1. Go to **Site settings** → **Domain management**
2. Click **Add custom domain**
3. Enter your domain (e.g., `kokkalisglobal.com`)
4. Netlify provides DNS instructions
5. Update your domain registrar's DNS:
   - Point your domain to Netlify's nameservers, or
   - Add A record to Netlify's IP
6. Netlify automatically provisions SSL (via Let's Encrypt)

**🎉 Done! Auto-deploys + Free SSL + CDN included!**

---

## Vercel

**Best for:** Similar to Netlify, great performance  
**Cost:** Free  
**Time:** 3 minutes  
**Difficulty:** Very Easy

### Steps

1. Go to [vercel.com](https://vercel.com/)
2. Sign up with GitHub
3. Click **Add New** → **Project**
4. Import your `KokkalisGlobalSearch` repository
5. **Framework Preset:** None (or Other)
6. Click **Deploy**
7. Site goes live at `kokkalis-global-search.vercel.app`
8. Auto-deploys on every GitHub push

### Custom Domain on Vercel

1. Go to **Project Settings** → **Domains**
2. Add your custom domain
3. Follow DNS instructions (similar to Netlify)
4. SSL is automatic

**🎉 Done!**

---

## AWS Amplify

**Best for:** AWS ecosystem integration, auto-deploy from GitHub  
**Cost:** Free tier (5 GB storage, 15 GB bandwidth/month)  
**Time:** 5 minutes  
**Difficulty:** Easy

### Steps

1. Go to **AWS Amplify** in AWS Console
2. Click **Get started** under "Amplify Hosting"
3. Choose **GitHub** as your repository source
4. Authorize AWS Amplify to access GitHub
5. Select your `KokkalisGlobalSearch` repository
6. Select `main` branch
7. **Build settings:** Auto-detected (leave as is)
8. Click **Next** → **Save and deploy**
9. Amplify builds and deploys (takes 2-3 minutes)
10. Site goes live at `https://main.xxxxxx.amplifyapp.com`

### Features

- Auto-deploys on every push to GitHub
- Free SSL certificate
- Global CDN included
- Custom domain support (similar to CloudFront setup)

### Custom Domain

1. In Amplify app, go to **Domain management**
2. Click **Add domain**
3. Enter your domain
4. Follow DNS configuration steps
5. SSL is automatic

**🎉 Done! AWS-managed with GitHub auto-deploy!**

---

## Comparison Table

| Platform | Cost | Speed | Custom Domain | SSL | Auto-Deploy | CDN | Difficulty |
|----------|------|-------|---------------|-----|-------------|-----|------------|
| **S3 + CloudFront** | ~$1-5/mo | Fast | ✅ Manual setup | ✅ Via CloudFront | ❌ Manual | ✅ | Medium |
| **GitHub Pages** | Free | Good | ✅ Easy | ✅ Auto | ✅ Auto | ❌ | Easy |
| **Netlify** | Free | Very Fast | ✅ Very Easy | ✅ Auto | ✅ Auto | ✅ | Very Easy |
| **Vercel** | Free | Very Fast | ✅ Very Easy | ✅ Auto | ✅ Auto | ✅ | Very Easy |
| **AWS Amplify** | Free tier | Fast | ✅ Easy | ✅ Auto | ✅ Auto | ✅ | Easy |

---

## Recommendations

### For Learning AWS: 
**S3 + CloudFront** (this guide covers it in detail)

### For Quick Launch: 
**Netlify** or **Vercel** (literally 2 clicks, auto-deploys)

### For Staying on GitHub: 
**GitHub Pages** (already have the repo there)

### For AWS Ecosystem: 
**AWS Amplify** (easier than S3, still AWS-native)

---

## Troubleshooting

### S3: "Access Denied" Error
- Verify bucket policy is correct (check bucket name matches)
- Ensure "Block all public access" is OFF
- Check file uploaded successfully

### CloudFront: Changes Not Showing
- Create invalidation for `/*`
- Wait 1-2 minutes for cache to clear
- Hard refresh browser (Ctrl+Shift+R)

### Custom Domain Not Working
- Wait for DNS propagation (can take up to 48 hours)
- Use [WhatsMyDNS.net](https://whatsmydns.net) to check propagation
- Verify DNS records are correct

### SSL Certificate Pending
- For AWS Certificate Manager: Check email for validation
- Or add DNS CNAME records for validation (shown in ACM)

---

## Next Steps After Deployment

1. **Set up analytics:** Google Analytics, Plausible, or AWS CloudWatch
2. **Form backend:** Replace `mailto:` with Formspree, Web3Forms, or AWS Lambda
3. **SEO optimization:** Add meta tags, sitemap.xml, robots.txt
4. **Performance monitoring:** Use Lighthouse, WebPageTest
5. **Add CI/CD:** Automate testing and deployment

---

**Questions?** Check AWS documentation or reach out for support.

**Last Updated:** December 6, 2025
