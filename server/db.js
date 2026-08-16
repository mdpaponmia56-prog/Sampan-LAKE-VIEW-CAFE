import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const BACKUP_DIR = path.join(DATA_DIR, 'backups');
const DB_FILE = path.join(DATA_DIR, 'store.json');

// Ensure data and backup directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Security: Hash password using SHA-256 + Salt
export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const hash = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return { hash, salt };
}

export function verifyPassword(password, hash, salt) {
  const computed = crypto.createHmac('sha256', salt).update(password).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(computed, 'hex'), Buffer.from(hash, 'hex'));
}

// Token signing for high security sessions
const SECRET_KEY = 'sampan_lake_view_secret_jwt_key_2026_secure_hash';

export function generateToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    username: user.username || user.email,
    role: user.role || 'user',
    fullName: user.fullName || user.name || 'User',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
  };
  const str = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET_KEY).update(str).digest('base64url');
  return `${str}.${sig}`;
}

export function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [str, sig] = parts;
  const expectedSig = crypto.createHmac('sha256', SECRET_KEY).update(str).digest('base64url');
  if (sig !== expectedSig) return null;
  try {
    const payload = JSON.parse(Buffer.from(str, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Date.now()) return null;
    return payload;
  } catch (e) {
    return null;
  }
}

// Initial Seed Data for dishes
const defaultMenuItems = [
  { id: "dish-25", name: "Crispy Chicken Fry 1 Pcs", nameBn: "ক্রিসপি চিকেন ফ্রাই ১ পিস", category: "chickenFry", price: 100, popular: true, chefPick: true, available: true, description: "Our signature crispy chicken", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: "dish-26", name: "Crispy Chicken Fry 2 Pcs", nameBn: "ক্রিসপি চিকেন ফ্রাই ২ পিস", category: "chickenFry", price: 190, popular: true, chefPick: false, available: true, description: "Double the crispy goodness", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: "dish-27", name: "Crispy Chicken Fry 4 Pcs", nameBn: "ক্রিসপি চিকেন ফ্রাই ৪ পিস", category: "chickenFry", price: 360, popular: false, chefPick: false, available: true, description: "Family sized crispy chicken", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: "dish-28", name: "Crispy Chicken Fry 8 Pcs", nameBn: "ক্রিসপি চিকেন ফ্রাই ৮ পিস", category: "chickenFry", price: 650, popular: false, chefPick: false, available: true, description: "Party platter", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: "dish-10", name: "Crispy Cheese Burger", nameBn: "ক্রিসপি চিজ বার্গার", category: "burgers", price: 230, popular: true, chefPick: true, available: true, description: "With French Fry", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: "dish-11", name: "Crispy Burger with French Fry", nameBn: "ক্রিসপি বার্গার", category: "burgers", price: 200, popular: true, chefPick: false, available: true, description: "Crispy chicken burger with fries", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: "dish-12", name: "Chicken Patty Burger", nameBn: "চিকেন প্যাটি বার্গার", category: "burgers", price: 170, popular: false, chefPick: false, available: true, description: "Juicy chicken patty", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: "dish-13", name: "Beef Patty Burger", nameBn: "বিফ প্যাটি বার্গার", category: "burgers", price: 180, popular: false, chefPick: false, available: true, description: "Premium beef patty", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: "dish-14", name: "Chicken Fry Burger", nameBn: "চিকেন ফ্রাই বার্গার", category: "burgers", price: 150, popular: true, chefPick: false, available: true, description: "Crispy fried chicken burger", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: "dish-15", name: "Chicken Sub Burger", nameBn: "চিকেন সাব বার্গার", category: "burgers", price: 170, popular: false, chefPick: false, available: true, description: "Submarine style chicken", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: "dish-16", name: "Sampan Special Burger", nameBn: "সাম্পান স্পেশাল বার্গার", category: "burgers", price: 250, popular: true, chefPick: true, available: true, description: "With French Fry - Our house special", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: "dish-17", name: "Chicken Sandwich", nameBn: "চিকেন স্যান্ডউইচ", category: "burgers", price: 140, popular: false, chefPick: false, available: true, description: "Classic chicken sandwich", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: "dish-18", name: "Single French Fry with Sauce", nameBn: "সিঙ্গেল ফ্রেঞ্চ ফ্রাই", category: "sandwich", price: 120, popular: false, chefPick: false, available: true, description: "Crispy fries with dipping sauce", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-19", name: "Club Sandwich with French Fry & Sauce", nameBn: "ক্লাব স্যান্ডউইচ", category: "sandwich", price: 180, popular: false, chefPick: false, available: true, description: "Triple-decker club sandwich", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-20", name: "Sub Sandwich", nameBn: "সাব স্যান্ডউইচ", category: "sandwich", price: 170, popular: false, chefPick: false, available: true, description: "Foot-long style sub", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-21", name: "Kolkata Role-2 Pcs", nameBn: "কলকাতা রোল-২ পিস", category: "sandwich", price: 300, popular: true, chefPick: false, available: true, description: "Authentic Kolkata style roll", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-22", name: "Regular Fuchka-10 Pcs", nameBn: "রেগুলার ফুচকা-১০ পিস", category: "sandwich", price: 100, popular: true, chefPick: true, available: true, description: "Traditional Bengali pani puri", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/9ba9de1c4_generated_27ecc927.png" },
  { id: "dish-23", name: "Dhai Fuchka-10 Pcs (Signature Item)", nameBn: "দই ফুচকা-১০ পিস", category: "sandwich", price: 170, popular: true, chefPick: true, available: true, description: "Yogurt fuchka — our signature", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/9ba9de1c4_generated_27ecc927.png" },
  { id: "dish-24", name: "Onton-6 Pcs", nameBn: "ওন্টন-৬ পিস", category: "sandwich", price: 160, popular: false, chefPick: false, available: true, description: "Chinese style wonton", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-29", name: "Chili Sauce Pasta", nameBn: "চিলি সস পাস্তা", category: "pasta", price: 280, popular: false, chefPick: false, available: true, description: "Spicy chili sauce pasta", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-30", name: "Naga Pasta", nameBn: "নাগা পাস্তা", category: "pasta", price: 300, popular: true, chefPick: false, available: true, description: "Fiery Naga pepper pasta", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-31", name: "Oven Baked Pasta", nameBn: "ওভেন বেকড পাস্তা", category: "pasta", price: 350, popular: false, chefPick: true, available: true, description: "Cheesy oven-baked pasta", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-32", name: "Beef Paper Oni Pizza", nameBn: "বিফ পেপার ওনি পিৎজা", category: "pizza", price: 550, popular: false, chefPick: false, available: true, description: "8/10/12 inch — ৳550/650/750", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-33", name: "Sausages Loaded Pizza", nameBn: "সোসেজ লোডেড পিৎজা", category: "pizza", price: 500, popular: true, chefPick: false, available: true, description: "8/10/12 inch — ৳500/600/700", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-34", name: "Chicken Cheese Loaded Pizza", nameBn: "চিকেন চিজ লোডেড পিৎজা", category: "pizza", price: 650, popular: true, chefPick: true, available: true, description: "8/10/12 inch — ৳650/750/850", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-35", name: "Chicken New York Pizza", nameBn: "চিকেন নিউ ইয়র্ক পিৎজা", category: "pizza", price: 450, popular: false, chefPick: false, available: true, description: "8/10/12 inch — ৳450/550/650", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-36", name: "SAMPAN Special Pizza", nameBn: "সাম্পান স্পেশাল পিৎজা", category: "pizza", price: 600, popular: true, chefPick: true, available: true, description: "8/10/12 inch — ৳600/790/990", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-40", name: "Thai Soup 1:1", nameBn: "থাই স্যুপ ১:১", category: "soup", price: 150, popular: true, chefPick: false, available: true, description: "Authentic Thai flavors", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-41", name: "Thai Soup 1:2", nameBn: "থাই স্যুপ ১:২", category: "soup", price: 280, popular: false, chefPick: false, available: true, description: "Serves 2", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-42", name: "Thai Soup 1:3", nameBn: "থাই স্যুপ ১:৩", category: "soup", price: 390, popular: false, chefPick: false, available: true, description: "Serves 3", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-43", name: "Corn Soup 1:2", nameBn: "কর্ন স্যুপ ১:২", category: "soup", price: 190, popular: false, chefPick: false, available: true, description: "Sweet corn soup", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-44", name: "Hot & Sour Soup 1:2", nameBn: "হট অ্যান্ড সাওয়ার স্যুপ ১:২", category: "soup", price: 220, popular: true, chefPick: false, available: true, description: "Classic Chinese soup", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-45", name: "Vegetable Soup 1:2", nameBn: "ভেজিটেবল স্যুপ ১:২", category: "soup", price: 180, popular: false, chefPick: false, available: true, description: "Fresh vegetable soup", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-46", name: "Chicken Chowmein 1:1", nameBn: "চিকেন চাওমিন ১:১", category: "noodles", price: 170, popular: true, chefPick: false, available: true, description: "Classic chicken noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-47", name: "Thai Mixed Chowmein 1:2", nameBn: "থাই মিক্সড চাওমিন ১:২", category: "noodles", price: 270, popular: false, chefPick: false, available: true, description: "Thai spiced mixed noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-48", name: "Beef Chowmein 1:2", nameBn: "বিফ চাওমিন ১:২", category: "noodles", price: 380, popular: false, chefPick: false, available: true, description: "Rich beef noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-49", name: "Mixed Chowmein 1:3", nameBn: "মিক্সড চাওমিন ১:৩", category: "noodles", price: 450, popular: false, chefPick: false, available: true, description: "Mixed meat noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-50", name: "SAMPAN Special Chowmein 1:3", nameBn: "সাম্পান স্পেশাল চাওমিন ১:৩", category: "noodles", price: 490, popular: true, chefPick: true, available: true, description: "Our house special noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-51", name: "Green Garden Salad", nameBn: "গ্রিন গার্ডেন সালাদ", category: "salad", price: 180, popular: false, chefPick: false, available: true, description: "Fresh garden vegetables", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-52", name: "Cashew Nut Salad", nameBn: "কাজু বাদাম সালাদ", category: "salad", price: 280, popular: false, chefPick: false, available: true, description: "Crunchy cashew salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-53", name: "Honey Cashew Nut Salad", nameBn: "হানি কাজু বাদাম সালাদ", category: "salad", price: 320, popular: true, chefPick: true, available: true, description: "Sweet honey glazed cashew salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-54", name: "Mixed Cashew Nut Salad", nameBn: "মিক্সড কাজু বাদাম সালাদ", category: "salad", price: 350, popular: false, chefPick: false, available: true, description: "Mixed nuts and vegetables", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-37", name: "BBQ Nachos", nameBn: "বিবিকিউ নাচোস", category: "nachos", price: 200, popular: false, chefPick: false, available: true, description: "Smoky BBQ nachos", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-38", name: "Mexican Nachos", nameBn: "মেক্সিকান নাচোস", category: "nachos", price: 180, popular: false, chefPick: false, available: true, description: "Spicy Mexican style", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-39", name: "Chicken Cheese Nachos", nameBn: "চিকেন চিজ নাচোস", category: "nachos", price: 230, popular: true, chefPick: false, available: true, description: "Cheesy chicken nachos", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-62", name: "Beef Khichuri", nameBn: "বিফ খিচুড়ি", category: "khichuri", price: 260, popular: false, chefPick: false, available: true, description: "Khichuri, Beef Masala Curry, Green Salad, Achar", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-63", name: "Chicken Khichuri", nameBn: "চিকেন খিচুড়ি", category: "khichuri", price: 220, popular: true, chefPick: false, available: true, description: "Chicken Masala Curry, Green Salad, Achar", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-64", name: "BBQ Khichuri", nameBn: "বিবিকিউ খিচুড়ি", category: "khichuri", price: 280, popular: false, chefPick: false, available: true, description: "Khichuri, Tanduri Chicken, Salad, Achar", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-55", name: "Set Menu 1", nameBn: "সেট মেনু ১", category: "setMenu", price: 200, popular: true, chefPick: false, available: true, description: "Fried Rice, Chicken Fry-1 Pcs, Chinese Vegetable, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-56", name: "Set Menu 2", nameBn: "সেট মেনু ২", category: "setMenu", price: 250, popular: false, chefPick: false, available: true, description: "Fried Rice, BBQ Chicken Fry-1 Pcs, Chinese Vegetable, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-57", name: "Set Menu 3", nameBn: "সেট মেনু ৩", category: "setMenu", price: 280, popular: false, chefPick: false, available: true, description: "Fried Rice, Beef Masala Curry, Chinese Vegetable, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-58", name: "Set Menu 4", nameBn: "সেট মেনু ৪", category: "setMenu", price: 240, popular: false, chefPick: false, available: true, description: "Fried Rice, Chicken Curry, Chinese Vegetable, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-59", name: "Set Menu 5", nameBn: "সেট মেনু ৫", category: "setMenu", price: 260, popular: false, chefPick: false, available: true, description: "Fried Rice, Chili Chicken, Chicken Fry-2 Pcs, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-60", name: "Set Menu 6 (SAMPAN Special)", nameBn: "সেট মেনু ৬ (সাম্পান স্পেশাল)", category: "setMenu", price: 300, popular: true, chefPick: true, available: true, description: "Mixed Rice, Chicken Curry, Chicken Fry-1 Pcs, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-61", name: "Set Menu 7 (Family Platter 4 Person)", nameBn: "সেট মেনু ৭ (পারিবারিক প্লেটার ৪ জন)", category: "setMenu", price: 1390, popular: true, chefPick: true, available: true, description: "Fried Rice 1:4, Chicken Masala Curry 1:4, Chinese Vegetable 1:4, Chicken Fry-4 Pcs, Thai Soup 1:4, Onthon-4 Pcs", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: "dish-74", name: "Regular Faluda", nameBn: "রেগুলার ফালুদা", category: "faluda", price: 150, popular: true, chefPick: false, available: true, description: "Classic rose faluda", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-75", name: "Special Faluda", nameBn: "স্পেশাল ফালুদা", category: "faluda", price: 190, popular: true, chefPick: true, available: true, description: "Premium loaded faluda", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-65", name: "Regular Lacchi", nameBn: "রেগুলার লাচ্ছি", category: "lacchi", price: 110, popular: false, chefPick: false, available: true, description: "Classic yogurt drink", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-66", name: "Lemon Lacchi", nameBn: "লেমন লাচ্ছি", category: "lacchi", price: 120, popular: true, chefPick: false, available: true, description: "Refreshing lemon lassi", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-67", name: "Flavor Lacchi", nameBn: "ফ্লেভার লাচ্ছি", category: "lacchi", price: 150, popular: false, chefPick: false, available: true, description: "Choice of flavors", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-68", name: "Orange Juice", nameBn: "অরেঞ্জ জুস", category: "lacchi", price: 180, popular: false, chefPick: false, available: true, description: "Fresh squeezed orange", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-69", name: "Apple Juice", nameBn: "আপেল জুস", category: "lacchi", price: 170, popular: false, chefPick: false, available: true, description: "Fresh apple juice", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-70", name: "Papiya Juice", nameBn: "পেঁপে জুস", category: "lacchi", price: 150, popular: false, chefPick: false, available: true, description: "Fresh papaya juice", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-71", name: "Mango Juice", nameBn: "ম্যাঙ্গো জুস", category: "lacchi", price: 150, popular: true, chefPick: false, available: true, description: "Sweet mango juice", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-72", name: "Dragon Fruit Juice", nameBn: "ড্রাগন ফ্রুট জুস", category: "lacchi", price: 160, popular: false, chefPick: false, available: true, description: "Exotic dragon fruit", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-73", name: "Cold Drinks 1 Glass", nameBn: "কোল্ড ড্রিংকস ১ গ্লাস", category: "lacchi", price: 40, popular: false, chefPick: false, available: true, description: "Chilled soft drink", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-76", name: "Ice Cream (any flavor)", nameBn: "আইসক্রিম (যেকোনো ফ্লেভার)", category: "iceCream", price: 140, popular: true, chefPick: false, available: true, description: "Choose your favorite flavor", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-77", name: "Special Ice Cream", nameBn: "স্পেশাল আইসক্রিম", category: "iceCream", price: 170, popular: false, chefPick: true, available: true, description: "Premium loaded ice cream", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-78", name: "Orio Milkshake", nameBn: "ওরিও মিল্কশেক", category: "milkshake", price: 180, popular: true, chefPick: false, available: true, description: "Creamy Oreo shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-79", name: "Strawberry Milkshake", nameBn: "স্ট্রবেরি মিল্কশেক", category: "milkshake", price: 160, popular: false, chefPick: false, available: true, description: "Fresh strawberry shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-80", name: "Mango Milkshake", nameBn: "ম্যাঙ্গো মিল্কশেক", category: "milkshake", price: 150, popular: true, chefPick: false, available: true, description: "Tropical mango shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-81", name: "Chocolate Milkshake", nameBn: "চকলেট মিল্কশেক", category: "milkshake", price: 150, popular: true, chefPick: true, available: true, description: "Rich dark chocolate shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-82", name: "Banana Milkshake", nameBn: "বানানা মিল্কশেক", category: "milkshake", price: 140, popular: false, chefPick: false, available: true, description: "Creamy banana shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-83", name: "Kaju Nuts Milkshake", nameBn: "কাজু নাটস মিল্কশেক", category: "milkshake", price: 190, popular: false, chefPick: false, available: true, description: "Cashew nut milkshake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-84", name: "Cold Coffee", nameBn: "কোল্ড কফি", category: "milkshake", price: 120, popular: false, chefPick: false, available: true, description: "Iced coffee blend", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-85", name: "Flavor Cold Coffee", nameBn: "ফ্লেভার কোল্ড কফি", category: "milkshake", price: 150, popular: false, chefPick: false, available: true, description: "Flavored iced coffee", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-86", name: "Regular Hot Coffee", nameBn: "রেগুলার হট কফি", category: "coffee", price: 100, popular: false, chefPick: false, available: true, description: "Freshly brewed hot coffee", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: "dish-87", name: "Black Coffee", nameBn: "ব্ল্যাক কফি", category: "coffee", price: 80, popular: false, chefPick: false, available: true, description: "Strong black coffee", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
];

function getInitialStore() {
  const adminAuth = hashPassword('Admin@Sampan2026!');
  const staffAuth = hashPassword('Staff@Sampan2026!');
  
  return {
    users: [
      {
        id: 'usr-admin-1',
        email: 'admin@sampan.com',
        username: 'admin',
        passwordHash: adminAuth.hash,
        salt: adminAuth.salt,
        role: 'admin',
        fullName: 'Super Administrator',
        phone: '+880 1923 784 149',
        created_date: new Date().toISOString(),
        last_login: null
      },
      {
        id: 'usr-staff-1',
        email: 'manager@sampan.com',
        username: 'manager',
        passwordHash: staffAuth.hash,
        salt: staffAuth.salt,
        role: 'admin',
        fullName: 'Restaurant Manager',
        phone: '+880 1923 784 150',
        created_date: new Date().toISOString(),
        last_login: null
      }
    ],
    menuItems: defaultMenuItems.map(item => ({
      ...item,
      created_date: new Date().toISOString(),
      updated_date: new Date().toISOString()
    })),
    orders: [
      {
        id: 'ord-1001',
        customerName: 'Tanvir Ahmed',
        customerPhone: '+8801712345678',
        customerEmail: 'tanvir@gmail.com',
        items: [
          { id: 'dish-16', name: 'Sampan Special Burger', nameBn: 'সাম্পান স্পেশাল বার্গার', price: 250, quantity: 2, image: 'https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png' },
          { id: 'dish-25', name: 'Crispy Chicken Fry 1 Pcs', nameBn: 'ক্রিসপি চিকেন ফ্রাই ১ পিস', price: 100, quantity: 2, image: 'https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png' }
        ],
        subtotal: 700,
        deliveryFee: 50,
        discount: 0,
        total: 750,
        orderType: 'delivery',
        address: 'Baimail, Konabari, Gazipur',
        notes: 'Please bring extra ketchup and napkins',
        status: 'preparing',
        paymentMethod: 'Cash on Delivery',
        paymentStatus: 'pending',
        created_date: new Date(Date.now() - 35 * 60 * 1000).toISOString()
      },
      {
        id: 'ord-1002',
        customerName: 'Nusrat Jahan',
        customerPhone: '+8801898765432',
        customerEmail: 'nusrat@outlook.com',
        items: [
          { id: 'dish-61', name: 'Set Menu 7 (Family Platter 4 Person)', nameBn: 'সেট মেনু ৭ (পারিবারিক প্লেটার ৪ জন)', price: 1390, quantity: 1, image: 'https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png' },
          { id: 'dish-75', name: 'Special Faluda', nameBn: 'স্পেশাল ফালুদা', price: 190, quantity: 4, image: 'https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png' }
        ],
        subtotal: 2150,
        deliveryFee: 0,
        discount: 0,
        total: 2150,
        orderType: 'dinein',
        address: 'Table 4 (Lake Pavilion)',
        notes: 'Anniversary celebration dinner',
        status: 'confirmed',
        paymentMethod: 'bKash',
        paymentStatus: 'paid',
        created_date: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ],
    reservations: [
      {
        id: 'res-201',
        name: 'Mahmudur Rahman',
        email: 'mahmud@yahoo.com',
        phone: '+8801755512345',
        date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '07:30 PM',
        guests: 4,
        tableNumber: 'Table 8 (Lakeside Float)',
        requests: 'Lake view corner table for birthday dinner',
        status: 'confirmed',
        created_date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'res-202',
        name: 'Sabrina Islam',
        email: 'sabrina@gmail.com',
        phone: '+8801911223344',
        date: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '01:00 PM',
        guests: 8,
        tableNumber: 'Pavilion A',
        requests: 'Family reunion, need quiet area',
        status: 'pending',
        created_date: new Date(Date.now() - 40 * 60 * 1000).toISOString()
      }
    ],
    reviews: [
      {
        id: 'rev-301',
        name: "Rakib Hassan",
        email: "rakib@gmail.com",
        text: "The most unique dining experience in Gazipur. Eating on the lake with neon lights reflecting in the water is magical!",
        rating: 5,
        dishName: "Dhai Fuchka",
        status: "approved",
        created_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'rev-302',
        name: "Mithila Akter",
        email: "mithila@gmail.com",
        text: "Sampan Special Burger is incredible. The lakeside view makes every meal feel like a special occasion.",
        rating: 5,
        dishName: "Sampan Special Burger",
        status: "approved",
        created_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'rev-303',
        name: "Farhan Islam",
        email: "farhan@gmail.com",
        text: "Dhai Fuchka is a must-try. The atmosphere at night with all the colorful lights is absolutely breathtaking.",
        rating: 5,
        dishName: "Crispy Chicken Fry",
        status: "approved",
        created_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'rev-304',
        name: "Kazi Nabil",
        email: "nabil@gmail.com",
        text: "Great lake view, tasty food and wonderful staff hospitality. Would definitely visit again with family!",
        rating: 5,
        dishName: "Family Platter",
        status: "pending",
        created_date: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      }
    ],
    promos: [
      { id: 'prm-1', code: 'SAMPAN10', discountType: 'percent', discountValue: 10, minOrder: 500, maxDiscount: 200, isActive: true, usageCount: 14 },
      { id: 'prm-2', code: 'LAKEVIEW50', discountType: 'fixed', discountValue: 50, minOrder: 400, maxDiscount: 50, isActive: true, usageCount: 8 }
    ],
    settings: {
      restaurantName: 'Sampan Lake View Cafe',
      tagline: 'A Symphony of Spice by the Water',
      phone: '+880 1923 784 149',
      email: 'sampanlakeviewcafe@gmail.com',
      address: 'Horinchala, Baimail, Ward No #12, Konabari, Gazipur City Corporation, Gazipur, Bangladesh',
      hours: '10:00 AM – 10:00 PM',
      deliveryFee: 50,
      minOrderAmount: 100,
      vatPercent: 0,
      currencySymbol: '৳',
      enableOnlineOrders: true,
      enableReservations: true
    },
    securityLogs: [
      { id: 'sec-1', action: 'SYSTEM_INIT', user: 'System', ip: '127.0.0.1', timestamp: new Date().toISOString(), details: 'Backend database initialized with secure admin vault.' }
    ],
    loginAttempts: {}
  };
}

class Store {
  constructor() {
    this.data = null;
    this.load();
    // Create initial backup snapshot
    this.createBackup('SYSTEM_BOOT');
  }

  load() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf8');
        this.data = JSON.parse(raw);
      } else {
        this.data = getInitialStore();
        this.save();
      }
    } catch (e) {
      console.error('Error loading DB file, fallback to initial store:', e);
      this.data = getInitialStore();
      this.save();
    }
  }

  // Atomic safe file saving with temp file to avoid file corruption on crashes
  save() {
    try {
      const json = JSON.stringify(this.data, null, 2);
      const tmpFile = `${DB_FILE}.tmp.${Date.now()}`;
      fs.writeFileSync(tmpFile, json, 'utf8');
      fs.renameSync(tmpFile, DB_FILE);
    } catch (e) {
      console.error('Error saving DB file:', e);
    }
  }

  get(collection) {
    if (!this.data[collection]) this.data[collection] = [];
    return this.data[collection];
  }

  set(collection, items) {
    this.data[collection] = items;
    this.save();
  }

  logSecurity(action, user, ip = '127.0.0.1', details = '') {
    const logs = this.get('securityLogs');
    logs.unshift({
      id: 'sec-' + Date.now(),
      action,
      user,
      ip,
      details,
      timestamp: new Date().toISOString()
    });
    if (logs.length > 200) logs.pop();
    this.save();
  }

  // Automated & Manual Backup Engine
  createBackup(label = 'MANUAL') {
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `store-backup-${label}-${timestamp}.json`;
      const backupPath = path.join(BACKUP_DIR, filename);
      const json = JSON.stringify(this.data, null, 2);
      fs.writeFileSync(backupPath, json, 'utf8');

      // Prune old backups if more than 20
      const allBackups = fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('store-backup-') && f.endsWith('.json'))
        .map(f => ({ name: f, time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime() }))
        .sort((a, b) => b.time - a.time);

      if (allBackups.length > 20) {
        allBackups.slice(20).forEach(b => {
          try { fs.unlinkSync(path.join(BACKUP_DIR, b.name)); } catch (_) {}
        });
      }

      this.logSecurity('BACKUP_CREATED', 'System', '127.0.0.1', `Created database backup snapshot: ${filename}`);
      return { success: true, filename, timestamp: new Date().toISOString(), size: Buffer.byteLength(json) };
    } catch (err) {
      console.error('Backup creation failed:', err);
      return { success: false, error: err.message };
    }
  }

  listBackups() {
    try {
      if (!fs.existsSync(BACKUP_DIR)) return [];
      return fs.readdirSync(BACKUP_DIR)
        .filter(f => f.startsWith('store-backup-') && f.endsWith('.json'))
        .map(filename => {
          const fullPath = path.join(BACKUP_DIR, filename);
          const stat = fs.statSync(fullPath);
          return {
            filename,
            size: stat.size,
            created: stat.mtime.toISOString()
          };
        })
        .sort((a, b) => new Date(b.created) - new Date(a.created));
    } catch (e) {
      return [];
    }
  }

  restoreBackup(filename) {
    try {
      const backupPath = path.join(BACKUP_DIR, filename);
      if (!fs.existsSync(backupPath)) {
        throw new Error('Backup file does not exist.');
      }
      const raw = fs.readFileSync(backupPath, 'utf8');
      const parsed = JSON.parse(raw);
      if (!parsed.users || !parsed.menuItems) {
        throw new Error('Invalid database backup structure.');
      }
      // Create a safety backup of current state before restoring
      this.createBackup('PRE_RESTORE_SAFETY');
      this.data = parsed;
      this.save();
      this.logSecurity('DATABASE_RESTORED', 'Admin', '127.0.0.1', `Restored database from snapshot: ${filename}`);
      return { success: true, message: `Successfully restored database from ${filename}` };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  importDatabase(jsonData) {
    try {
      if (typeof jsonData === 'string') jsonData = JSON.parse(jsonData);
      if (!jsonData.users || !jsonData.menuItems) {
        throw new Error('Invalid database JSON structure.');
      }
      this.createBackup('PRE_IMPORT_SAFETY');
      this.data = jsonData;
      this.save();
      this.logSecurity('DATABASE_IMPORTED', 'Admin', '127.0.0.1', 'Imported database JSON file.');
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  exportDatabase() {
    return JSON.stringify(this.data, null, 2);
  }
}

export const db = new Store();
