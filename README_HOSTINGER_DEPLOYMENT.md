# Hostinger Node.js Deployment Guide — Sampan Lake View Cafe

This package contains everything needed to deploy and run **Sampan Lake View Cafe** on **Hostinger Node.js Hosting** (via hPanel / cPanel).

---

## 📦 Package Contents

* `dist/` — Optimized production frontend build (HTML, CSS, JS, images, fonts).
* `server/` — Backend API router (`server/backend.js`), persistent database engine (`server/db.js`), and database store (`server/data/store.json`).
* `server.js` — Main production entry point for Hostinger Node.js.
* `package.json` — Pre-configured production manifest (`"main": "server.js"`, `"scripts": { "start": "node server.js" }`).
* `.htaccess` — Optional reverse-proxy rewrite rules for Hostinger / LiteSpeed servers.

---

## 🚀 Step-by-Step Deployment Instructions on Hostinger

### Step 1: Log in to Hostinger hPanel
1. Go to [https://hpanel.hostinger.com](https://hpanel.hostinger.com) and log in.
2. Under **Websites**, select your domain and click **Manage**.

---

### Step 2: Set up Node.js in Hostinger
1. In the sidebar search bar, type **Node.js** (or go to **Advanced → Node.js**).
2. Click **Create Application** (or Edit your existing Node.js app):
   * **Node.js Version**: Select `Node.js 18.x` or `Node.js 20.x` (Recommended: `20.x`).
   * **Application Mode**: `Production`.
   * **Application Root**: `public_html` (or your subdomain folder, e.g. `public_html/sampan`).
   * **Application Startup File**: `server.js`.
3. Click **Create** or **Save**.

---

### Step 3: Upload the Zip File
1. Go to **Files → File Manager** in Hostinger hPanel.
2. Navigate to your application root (e.g. `public_html`).
3. Click **Upload** (top right) and upload `sampan-lakeview-hostinger-deploy.zip`.
4. Right-click the uploaded zip file and select **Extract**.
5. Ensure that `server.js`, `package.json`, `server/`, and `dist/` are located in your application root folder.

---

### Step 4: Install Dependencies & Start the App
1. Go back to **Advanced → Node.js** in Hostinger hPanel.
2. Click **Run NPM Install** (or open the Terminal in hPanel and run `npm install`).
3. Click **Restart** or **Start Application**.
4. Visit your website domain in the browser (e.g. `https://yourdomain.com`).

---

## 🔐 Administrator Access

* **Public Customer Website**: `https://yourdomain.com/`
* **Isolated Admin Panel**: `https://yourdomain.com/admin`
* **Default Admin User ID**: `admin@sampan.com` (or `admin`)
* **Default Admin Password**: `Admin@Sampan2026!`

*(You can change your Admin credentials and create database backups anytime inside **Settings & Security** in the Admin panel).*
