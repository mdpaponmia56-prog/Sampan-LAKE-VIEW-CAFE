const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

export const translations = {
  en: {
    // Nav
    home: "Home",
    about: "About",
    menu: "Menu",
    gallery: "Gallery",
    reservation: "Reserve a Table",
    contact: "Contact",
    order: "Order Now",
    signatureDishes: "Signature Dishes",
    
    // Hero
    heroTagline: "A Symphony of Spice by the Water",
    heroSub: "Experience authentic Chinese-fusion cuisine on the serene lakeside of Gazipur",
    heroBtn1: "Explore Menu",
    heroBtn2: "Reserve a Table",
    heroScroll: "Scroll to discover",
    
    // Stats
    happyGuests: "Happy Guests",
    menuItems: "Menu Items",
    yearsOfJoy: "Years of Joy",
    lakeViews: "Lake Views Daily",

    // About
    aboutLabel: "Our Story",
    aboutTitle: "Where Water Meets Flavor",
    aboutText1: "Nestled on the tranquil banks of Gazipur's shimmering lake, Sampan Lake View Cafe is more than a restaurant—it is a sanctuary where the spirit of Chinese culinary tradition meets the soul of Bangladesh.",
    aboutText2: "Our bamboo pavilions float gently above the water, each table offering an unobstructed panorama of the horizon. From the first crisp bite of our signature Chicken Fry to the last sip of a chilled Faluda, every moment here is designed to linger in memory.",
    aboutText3: "We believe dining is a ceremony. Come, be still, and let the lake do the rest.",
    openEveryDay: "Open Every Day",
    hours: "10 AM – 10 PM",
    location: "Horinchala, Baimail, Konabari, Gazipur",
    
    // Signature
    signatureLabel: "Chef's Selection",
    signatureTitle: "Our Signature Creations",
    signatureSub: "Three dishes that define us — crafted with precision, served with pride.",
    
    // Menu
    menuLabel: "Full Menu",
    menuTitle: "A World of Flavors",
    menuSub: "From crispy Chicken Fry to steaming Thai Soup, our menu is a journey.",
    searchPlaceholder: "Search dishes...",
    allCategories: "All",
    addToCart: "Add to Cart",
    popular: "Popular",
    chefPick: "Chef's Pick",
    
    // Categories
    catChickenFry: "Chicken Fry",
    catBurgers: "Burgers",
    catSandwich: "Sandwich & Rolls",
    catPasta: "Pasta",
    catPizza: "Pizza",
    catSoup: "Soup",
    catNoodles: "Noodles",
    catSalad: "Salad",
    catNachos: "Nachos",
    catKhichuri: "Khichuri",
    catSetMenu: "Set Menu",
    catFaluda: "Faluda",
    catLacchi: "Lacchi & Juice",
    catIceCream: "Ice Cream",
    catMilkshake: "Milkshake",
    catCoffee: "Coffee",
    
    // Gallery
    galleryLabel: "Visual Journey",
    galleryTitle: "Life at the Lake",
    
    // Reservation
    reservationLabel: "Book Your Table",
    reservationTitle: "Reserve Your Lakeside Seat",
    reservationSub: "Secure your spot for an unforgettable dining experience",
    yourName: "Full Name",
    yourEmail: "Email Address",
    yourPhone: "Phone Number",
    date: "Date",
    time: "Time",
    guests: "Number of Guests",
    specialRequests: "Special Requests",
    confirmReservation: "Confirm Reservation",
    reservationSuccess: "Reservation Confirmed!",
    reservationSuccessMsg: "We look forward to welcoming you. You'll receive a confirmation shortly.",
    
    // Cart
    yourCart: "Your Cart",
    emptyCart: "Your cart is empty",
    subtotal: "Subtotal",
    delivery: "Delivery",
    total: "Total",
    checkout: "Proceed to Checkout",
    remove: "Remove",
    
    // Contact
    contactLabel: "Get in Touch",
    contactTitle: "Find Us at the Lake",
    phone: "Phone",
    email: "Email",
    address: "Address",
    followUs: "Follow Us",
    sendMessage: "Send Message",
    yourMessage: "Your Message",
    send: "Send",
    
    // Footer
    allRights: "All rights reserved.",
    privacyPolicy: "Privacy Policy",
    terms: "Terms of Service",
    openHours: "Opening Hours",
    everydayHours: "Every Day: 10 AM – 10 PM",
    
    // FAQ
    faqLabel: "Got Questions?",
    faqTitle: "Frequently Asked Questions",
    
    // 404
    notFound: "Page Not Found",
    notFoundMsg: "The page you're looking for has drifted away like a sampan on the lake.",
    goHome: "Return Home",

    // WhatsApp
    chatWhatsApp: "Chat on WhatsApp",
    orderWhatsApp: "Order via WhatsApp",
  },
  
  bn: {
    // Nav
    home: "হোম",
    about: "আমাদের সম্পর্কে",
    menu: "মেনু",
    gallery: "গ্যালারি",
    reservation: "টেবিল বুক করুন",
    contact: "যোগাযোগ",
    order: "অর্ডার করুন",
    signatureDishes: "সিগনেচার ডিশ",
    
    // Hero
    heroTagline: "জলের ধারে মশলার সিম্ফনি",
    heroSub: "গাজীপুরের শান্ত হ্রদের তীরে খাঁটি চাইনিজ-ফিউশন রন্ধনশৈলীর অভিজ্ঞতা নিন",
    heroBtn1: "মেনু দেখুন",
    heroBtn2: "টেবিল বুক করুন",
    heroScroll: "নিচে স্ক্রল করুন",
    
    // Stats
    happyGuests: "সন্তুষ্ট অতিথি",
    menuItems: "মেনু আইটেম",
    yearsOfJoy: "আনন্দের বছর",
    lakeViews: "দৈনিক লেক ভিউ",
    
    // About
    aboutLabel: "আমাদের গল্প",
    aboutTitle: "যেখানে জল আর স্বাদ মিলে যায়",
    aboutText1: "গাজীপুরের ঝিলমিল হ্রদের শান্ত তীরে অবস্থিত সাম্পান লেক ভিউ ক্যাফে শুধু একটি রেস্তোরাঁ নয়—এটি এমন একটি আশ্রয়স্থল যেখানে চীনা রন্ধন ঐতিহ্যের আত্মা বাংলাদেশের সারাংশের সাথে মিলিত হয়।",
    aboutText2: "আমাদের বাঁশের প্যাভিলিয়নগুলো জলের উপর ভাসমান, প্রতিটি টেবিল থেকে দিগন্তের অবাধ দৃশ্য উপভোগ করা যায়। আমাদের সিগনেচার চিকেন ফ্রাইয়ের প্রথম কুড়কুড়ে কামড় থেকে শেষ ঠান্ডা ফালুদার চুমুক পর্যন্ত, এখানকার প্রতিটি মুহূর্ত স্মৃতিতে থেকে যায়।",
    aboutText3: "আমরা বিশ্বাস করি রান্না একটি অনুষ্ঠান। আসুন, স্থির হোন, বাকিটা হ্রদ করবে।",
    openEveryDay: "প্রতিদিন খোলা",
    hours: "সকাল ১০টা – রাত ১০টা",
    location: "হরিণতলা, বাইমাইল, কোনাবাড়ী, গাজীপুর",
    
    // Signature
    signatureLabel: "শেফের পছন্দ",
    signatureTitle: "আমাদের সিগনেচার সৃষ্টি",
    signatureSub: "তিনটি ডিশ যা আমাদের সংজ্ঞায়িত করে — নির্ভুলতার সাথে তৈরি, গর্বের সাথে পরিবেশিত।",
    
    // Menu
    menuLabel: "সম্পূর্ণ মেনু",
    menuTitle: "স্বাদের এক জগৎ",
    menuSub: "কুড়কুড়ে চিকেন ফ্রাই থেকে গরম থাই স্যুপ পর্যন্ত, আমাদের মেনু একটি যাত্রা।",
    searchPlaceholder: "ডিশ খুঁজুন...",
    allCategories: "সব",
    addToCart: "কার্টে যোগ করুন",
    popular: "জনপ্রিয়",
    chefPick: "শেফের পছন্দ",
    
    // Categories
    catChickenFry: "চিকেন ফ্রাই",
    catBurgers: "বার্গার",
    catSandwich: "স্যান্ডউইচ ও রোল",
    catPasta: "পাস্তা",
    catPizza: "পিৎজা",
    catSoup: "স্যুপ",
    catNoodles: "নুডলস",
    catSalad: "সালাদ",
    catNachos: "নাচোস",
    catKhichuri: "খিচুড়ি",
    catSetMenu: "সেট মেনু",
    catFaluda: "ফালুদা",
    catLacchi: "লাচ্ছি ও জুস",
    catIceCream: "আইসক্রিম",
    catMilkshake: "মিল্কশেক",
    catCoffee: "কফি",
    
    // Gallery
    galleryLabel: "দৃশ্যমান যাত্রা",
    galleryTitle: "হ্রদের জীবন",
    
    // Reservation
    reservationLabel: "টেবিল বুক করুন",
    reservationTitle: "আপনার হ্রদতীরের আসন সংরক্ষণ করুন",
    reservationSub: "অবিস্মরণীয় ডাইনিং অভিজ্ঞতার জন্য আপনার স্পট নিশ্চিত করুন",
    yourName: "পুরো নাম",
    yourEmail: "ইমেইল ঠিকানা",
    yourPhone: "ফোন নম্বর",
    date: "তারিখ",
    time: "সময়",
    guests: "অতিথির সংখ্যা",
    specialRequests: "বিশেষ অনুরোধ",
    confirmReservation: "রিজার্ভেশন নিশ্চিত করুন",
    reservationSuccess: "রিজার্ভেশন নিশ্চিত হয়েছে!",
    reservationSuccessMsg: "আমরা আপনাকে স্বাগত জানাতে উন্মুখ। শীঘ্রই একটি নিশ্চিতকরণ পাবেন।",
    
    // Cart
    yourCart: "আপনার কার্ট",
    emptyCart: "আপনার কার্ট খালি",
    subtotal: "সাবটোটাল",
    delivery: "ডেলিভারি",
    total: "মোট",
    checkout: "চেকআউট করুন",
    remove: "সরান",
    
    // Contact
    contactLabel: "যোগাযোগ করুন",
    contactTitle: "হ্রদে আমাদের খুঁজুন",
    phone: "ফোন",
    email: "ইমেইল",
    address: "ঠিকানা",
    followUs: "আমাদের অনুসরণ করুন",
    sendMessage: "বার্তা পাঠান",
    yourMessage: "আপনার বার্তা",
    send: "পাঠান",
    
    // Footer
    allRights: "সর্বস্বত্ব সংরক্ষিত।",
    privacyPolicy: "গোপনীয়তা নীতি",
    terms: "সেবার শর্তাবলী",
    openHours: "খোলার সময়",
    everydayHours: "প্রতিদিন: সকাল ১০টা – রাত ১০টা",
    
    // FAQ
    faqLabel: "প্রশ্ন আছে?",
    faqTitle: "প্রায়শই জিজ্ঞাসিত প্রশ্ন",
    
    // 404
    notFound: "পৃষ্ঠা পাওয়া যায়নি",
    notFoundMsg: "আপনি যে পৃষ্ঠাটি খুঁজছেন তা হ্রদে সাম্পানের মতো ভেসে গেছে।",
    goHome: "হোমে ফিরুন",

    // WhatsApp
    chatWhatsApp: "হোয়াটসঅ্যাপে চ্যাট করুন",
    orderWhatsApp: "হোয়াটসঅ্যাপে অর্ডার করুন",
  }
};

export const menuData = [
  // Chicken Fry
  { id: 1, name: "Chicken Fry-1 Pcs", nameBn: "চিকেন ফ্রাই-১ পিস", category: "chickenFry", price: 200, popular: true, chefPick: false, description: "French Fry, Dinner Bun, Drinks-2 Pcs & Sauce", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 2, name: "Chicken Fry-2 Pcs", nameBn: "চিকেন ফ্রাই-২ পিস", category: "chickenFry", price: 380, popular: true, chefPick: true, description: "French Fry, Dinner Bun-2 Pcs, Drinks-2 Pcs & Sauce", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 3, name: "Chicken Fry-4 Pcs", nameBn: "চিকেন ফ্রাই-৪ পিস", category: "chickenFry", price: 740, popular: false, chefPick: false, description: "French Fry, Dinner Bun-4 Pcs, Drinks-2 Pcs & Sauce", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 4, name: "Hot Wings-6 Pcs", nameBn: "হট উইংস-৬ পিস", category: "chickenFry", price: 210, popular: false, chefPick: false, description: "French Fry & Sauce", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 5, name: "Strip Chicken-6 Pcs", nameBn: "স্ট্রিপ চিকেন-৬ পিস", category: "chickenFry", price: 250, popular: false, chefPick: false, description: "French Fry & Sauce", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 6, name: "Naga Wings-6 Pcs", nameBn: "নাগা উইংস-৬ পিস", category: "chickenFry", price: 300, popular: true, chefPick: false, description: "Spicy Naga flavor wings", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 7, name: "BBQ Chicken-4 Pcs", nameBn: "বিবিকিউ চিকেন-৪ পিস", category: "chickenFry", price: 320, popular: false, chefPick: false, description: "Smoky BBQ glazed chicken", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 8, name: "Naga Chicken-4 Pcs", nameBn: "নাগা চিকেন-৪ পিস", category: "chickenFry", price: 340, popular: false, chefPick: false, description: "Extra spicy Naga chicken", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 9, name: "Chicken Cheese Meat Box", nameBn: "চিকেন চিজ মিট বক্স", category: "chickenFry", price: 280, popular: false, chefPick: false, description: "Cheese stuffed chicken box", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 25, name: "Crispy Chicken Fry 1 Pcs", nameBn: "ক্রিসপি চিকেন ফ্রাই ১ পিস", category: "chickenFry", price: 100, popular: true, chefPick: true, description: "Our signature crispy chicken", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 26, name: "Crispy Chicken Fry 2 Pcs", nameBn: "ক্রিসপি চিকেন ফ্রাই ২ পিস", category: "chickenFry", price: 190, popular: true, chefPick: false, description: "Double the crispy goodness", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 27, name: "Crispy Chicken Fry 4 Pcs", nameBn: "ক্রিসপি চিকেন ফ্রাই ৪ পিস", category: "chickenFry", price: 360, popular: false, chefPick: false, description: "Family sized crispy chicken", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },
  { id: 28, name: "Crispy Chicken Fry 8 Pcs", nameBn: "ক্রিসপি চিকেন ফ্রাই ৮ পিস", category: "chickenFry", price: 650, popular: false, chefPick: false, description: "Party platter", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png" },

  // Burgers
  { id: 10, name: "Crispy Cheese Burger", nameBn: "ক্রিসপি চিজ বার্গার", category: "burgers", price: 230, popular: true, chefPick: true, description: "With French Fry", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: 11, name: "Crispy Burger with French Fry", nameBn: "ক্রিসপি বার্গার", category: "burgers", price: 200, popular: true, chefPick: false, description: "Crispy chicken burger with fries", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: 12, name: "Chicken Patty Burger", nameBn: "চিকেন প্যাটি বার্গার", category: "burgers", price: 170, popular: false, chefPick: false, description: "Juicy chicken patty", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: 13, name: "Beef Patty Burger", nameBn: "বিফ প্যাটি বার্গার", category: "burgers", price: 180, popular: false, chefPick: false, description: "Premium beef patty", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: 14, name: "Chicken Fry Burger", nameBn: "চিকেন ফ্রাই বার্গার", category: "burgers", price: 150, popular: true, chefPick: false, description: "Crispy fried chicken burger", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: 15, name: "Chicken Sub Burger", nameBn: "চিকেন সাব বার্গার", category: "burgers", price: 170, popular: false, chefPick: false, description: "Submarine style chicken", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: 16, name: "Sampan Special Burger", nameBn: "সাম্পান স্পেশাল বার্গার", category: "burgers", price: 250, popular: true, chefPick: true, description: "With French Fry - Our house special", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },
  { id: 17, name: "Chicken Sandwich", nameBn: "চিকেন স্যান্ডউইচ", category: "burgers", price: 140, popular: false, chefPick: false, description: "Classic chicken sandwich", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/dd8ec6830_generated_e3fd66e9.png" },

  // Sandwich & Rolls
  { id: 18, name: "Single French Fry with Sauce", nameBn: "সিঙ্গেল ফ্রেঞ্চ ফ্রাই", category: "sandwich", price: 120, popular: false, chefPick: false, description: "Crispy fries with dipping sauce", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 19, name: "Club Sandwich with French Fry & Sauce", nameBn: "ক্লাব স্যান্ডউইচ", category: "sandwich", price: 180, popular: false, chefPick: false, description: "Triple-decker club sandwich", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 20, name: "Sub Sandwich", nameBn: "সাব স্যান্ডউইচ", category: "sandwich", price: 170, popular: false, chefPick: false, description: "Foot-long style sub", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 21, name: "Kolkata Role-2 Pcs", nameBn: "কলকাতা রোল-২ পিস", category: "sandwich", price: 300, popular: true, chefPick: false, description: "Authentic Kolkata style roll", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 22, name: "Regular Fuchka-10 Pcs", nameBn: "রেগুলার ফুচকা-১০ পিস", category: "sandwich", price: 100, popular: true, chefPick: true, description: "Traditional Bengali pani puri", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/9ba9de1c4_generated_27ecc927.png" },
  { id: 23, name: "Dhai Fuchka-10 Pcs (Signature Item)", nameBn: "দই ফুচকা-১০ পিস", category: "sandwich", price: 170, popular: true, chefPick: true, description: "Yogurt fuchka — our signature", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/9ba9de1c4_generated_27ecc927.png" },
  { id: 24, name: "Onton-6 Pcs", nameBn: "ওন্টন-৬ পিস", category: "sandwich", price: 160, popular: false, chefPick: false, description: "Chinese style wonton", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },

  // Pasta
  { id: 29, name: "Chili Sauce Pasta", nameBn: "চিলি সস পাস্তা", category: "pasta", price: 280, popular: false, chefPick: false, description: "Spicy chili sauce pasta", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 30, name: "Naga Pasta", nameBn: "নাগা পাস্তা", category: "pasta", price: 300, popular: true, chefPick: false, description: "Fiery Naga pepper pasta", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 31, name: "Oven Baked Pasta", nameBn: "ওভেন বেকড পাস্তা", category: "pasta", price: 350, popular: false, chefPick: true, description: "Cheesy oven-baked pasta", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },

  // Pizza
  { id: 32, name: "Beef Paper Oni Pizza", nameBn: "বিফ পেপার ওনি পিৎজা", category: "pizza", price: 550, popular: false, chefPick: false, description: "8/10/12 inch — ৳550/650/750", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 33, name: "Sausages Loaded Pizza", nameBn: "সোসেজ লোডেড পিৎজা", category: "pizza", price: 500, popular: true, chefPick: false, description: "8/10/12 inch — ৳500/600/700", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 34, name: "Chicken Cheese Loaded Pizza", nameBn: "চিকেন চিজ লোডেড পিৎজা", category: "pizza", price: 650, popular: true, chefPick: true, description: "8/10/12 inch — ৳650/750/850", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 35, name: "Chicken New York Pizza", nameBn: "চিকেন নিউ ইয়র্ক পিৎজা", category: "pizza", price: 450, popular: false, chefPick: false, description: "8/10/12 inch — ৳450/550/650", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 36, name: "SAMPAN Special Pizza", nameBn: "সাম্পান স্পেশাল পিৎজা", category: "pizza", price: 600, popular: true, chefPick: true, description: "8/10/12 inch — ৳600/790/990", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },

  // Soup
  { id: 40, name: "Thai Soup 1:1", nameBn: "থাই স্যুপ ১:১", category: "soup", price: 150, popular: true, chefPick: false, description: "Authentic Thai flavors", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 41, name: "Thai Soup 1:2", nameBn: "থাই স্যুপ ১:২", category: "soup", price: 280, popular: false, chefPick: false, description: "Serves 2", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 42, name: "Thai Soup 1:3", nameBn: "থাই স্যুপ ১:৩", category: "soup", price: 390, popular: false, chefPick: false, description: "Serves 3", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 43, name: "Corn Soup 1:2", nameBn: "কর্ন স্যুপ ১:২", category: "soup", price: 190, popular: false, chefPick: false, description: "Sweet corn soup", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 44, name: "Hot & Sour Soup 1:2", nameBn: "হট অ্যান্ড সাওয়ার স্যুপ ১:২", category: "soup", price: 220, popular: true, chefPick: false, description: "Classic Chinese soup", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 45, name: "Vegetable Soup 1:2", nameBn: "ভেজিটেবল স্যুপ ১:২", category: "soup", price: 180, popular: false, chefPick: false, description: "Fresh vegetable soup", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },

  // Noodles/Chowmein
  { id: 46, name: "Chicken Chowmein 1:1", nameBn: "চিকেন চাওমিন ১:১", category: "noodles", price: 170, popular: true, chefPick: false, description: "Classic chicken noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 47, name: "Thai Mixed Chowmein 1:2", nameBn: "থাই মিক্সড চাওমিন ১:২", category: "noodles", price: 270, popular: false, chefPick: false, description: "Thai spiced mixed noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 48, name: "Beef Chowmein 1:2", nameBn: "বিফ চাওমিন ১:২", category: "noodles", price: 380, popular: false, chefPick: false, description: "Rich beef noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 49, name: "Mixed Chowmein 1:3", nameBn: "মিক্সড চাওমিন ১:৩", category: "noodles", price: 450, popular: false, chefPick: false, description: "Mixed meat noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 50, name: "SAMPAN Special Chowmein 1:3", nameBn: "সাম্পান স্পেশাল চাওমিন ১:৩", category: "noodles", price: 490, popular: true, chefPick: true, description: "Our house special noodles", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },

  // Salad
  { id: 51, name: "Green Garden Salad", nameBn: "গ্রিন গার্ডেন সালাদ", category: "salad", price: 180, popular: false, chefPick: false, description: "Fresh garden vegetables", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 52, name: "Cashew Nut Salad", nameBn: "কাজু বাদাম সালাদ", category: "salad", price: 280, popular: false, chefPick: false, description: "Crunchy cashew salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 53, name: "Honey Cashew Nut Salad", nameBn: "হানি কাজু বাদাম সালাদ", category: "salad", price: 320, popular: true, chefPick: true, description: "Sweet honey glazed cashew salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 54, name: "Mixed Cashew Nut Salad", nameBn: "মিক্সড কাজু বাদাম সালাদ", category: "salad", price: 350, popular: false, chefPick: false, description: "Mixed nuts and vegetables", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },

  // Nachos
  { id: 37, name: "BBQ Nachos", nameBn: "বিবিকিউ নাচোস", category: "nachos", price: 200, popular: false, chefPick: false, description: "Smoky BBQ nachos", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 38, name: "Mexican Nachos", nameBn: "মেক্সিকান নাচোস", category: "nachos", price: 180, popular: false, chefPick: false, description: "Spicy Mexican style", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 39, name: "Chicken Cheese Nachos", nameBn: "চিকেন চিজ নাচোস", category: "nachos", price: 230, popular: true, chefPick: false, description: "Cheesy chicken nachos", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },

  // Khichuri
  { id: 62, name: "Beef Khichuri", nameBn: "বিফ খিচুড়ি", category: "khichuri", price: 260, popular: false, chefPick: false, description: "Khichuri, Beef Masala Curry, Green Salad, Achar", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 63, name: "Chicken Khichuri", nameBn: "চিকেন খিচুড়ি", category: "khichuri", price: 220, popular: true, chefPick: false, description: "Chicken Masala Curry, Green Salad, Achar", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 64, name: "BBQ Khichuri", nameBn: "বিবিকিউ খিচুড়ি", category: "khichuri", price: 280, popular: false, chefPick: false, description: "Khichuri, Tanduri Chicken, Salad, Achar", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },

  // Set Menu
  { id: 55, name: "Set Menu 1", nameBn: "সেট মেনু ১", category: "setMenu", price: 200, popular: true, chefPick: false, description: "Fried Rice, Chicken Fry-1 Pcs, Chinese Vegetable, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 56, name: "Set Menu 2", nameBn: "সেট মেনু ২", category: "setMenu", price: 250, popular: false, chefPick: false, description: "Fried Rice, BBQ Chicken Fry-1 Pcs, Chinese Vegetable, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 57, name: "Set Menu 3", nameBn: "সেট মেনু ৩", category: "setMenu", price: 280, popular: false, chefPick: false, description: "Fried Rice, Beef Masala Curry, Chinese Vegetable, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 58, name: "Set Menu 4", nameBn: "সেট মেনু ৪", category: "setMenu", price: 240, popular: false, chefPick: false, description: "Fried Rice, Chicken Curry, Chinese Vegetable, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 59, name: "Set Menu 5", nameBn: "সেট মেনু ৫", category: "setMenu", price: 260, popular: false, chefPick: false, description: "Fried Rice, Chili Chicken, Chicken Fry-2 Pcs, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 60, name: "Set Menu 6 (SAMPAN Special)", nameBn: "সেট মেনু ৬ (সাম্পান স্পেশাল)", category: "setMenu", price: 300, popular: true, chefPick: true, description: "Mixed Rice, Chicken Curry, Chicken Fry-1 Pcs, Salad", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },
  { id: 61, name: "Set Menu 7 (Family Platter 4 Person)", nameBn: "সেট মেনু ৭ (পারিবারিক প্লেটার ৪ জন)", category: "setMenu", price: 1390, popular: true, chefPick: true, description: "Fried Rice 1:4, Chicken Masala Curry 1:4, Chinese Vegetable 1:4, Chicken Fry-4 Pcs, Thai Soup 1:4, Onthon-4 Pcs", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/db09f8245_generated_f3b1fd1b.png" },

  // Faluda
  { id: 74, name: "Regular Faluda", nameBn: "রেগুলার ফালুদা", category: "faluda", price: 150, popular: true, chefPick: false, description: "Classic rose faluda", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 75, name: "Special Faluda", nameBn: "স্পেশাল ফালুদা", category: "faluda", price: 190, popular: true, chefPick: true, description: "Premium loaded faluda", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },

  // Lacchi & Juice
  { id: 65, name: "Regular Lacchi", nameBn: "রেগুলার লাচ্ছি", category: "lacchi", price: 110, popular: false, chefPick: false, description: "Classic yogurt drink", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 66, name: "Lemon Lacchi", nameBn: "লেমন লাচ্ছি", category: "lacchi", price: 120, popular: true, chefPick: false, description: "Refreshing lemon lassi", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 67, name: "Flavor Lacchi", nameBn: "ফ্লেভার লাচ্ছি", category: "lacchi", price: 150, popular: false, chefPick: false, description: "Choice of flavors", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 68, name: "Orange Juice", nameBn: "অরেঞ্জ জুস", category: "lacchi", price: 180, popular: false, chefPick: false, description: "Fresh squeezed orange", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 69, name: "Apple Juice", nameBn: "আপেল জুস", category: "lacchi", price: 170, popular: false, chefPick: false, description: "Fresh apple juice", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 70, name: "Papiya Juice", nameBn: "পেঁপে জুস", category: "lacchi", price: 150, popular: false, chefPick: false, description: "Fresh papaya juice", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 71, name: "Mango Juice", nameBn: "ম্যাঙ্গো জুস", category: "lacchi", price: 150, popular: true, chefPick: false, description: "Sweet mango juice", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 72, name: "Dragon Fruit Juice", nameBn: "ড্রাগন ফ্রুট জুস", category: "lacchi", price: 160, popular: false, chefPick: false, description: "Exotic dragon fruit", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 73, name: "Cold Drinks 1 Glass", nameBn: "কোল্ড ড্রিংকস ১ গ্লাস", category: "lacchi", price: 40, popular: false, chefPick: false, description: "Chilled soft drink", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },

  // Ice Cream
  { id: 76, name: "Ice Cream (any flavor)", nameBn: "আইসক্রিম (যেকোনো ফ্লেভার)", category: "iceCream", price: 140, popular: true, chefPick: false, description: "Choose your favorite flavor", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 77, name: "Special Ice Cream", nameBn: "স্পেশাল আইসক্রিম", category: "iceCream", price: 170, popular: false, chefPick: true, description: "Premium loaded ice cream", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },

  // Milkshake
  { id: 78, name: "Orio Milkshake", nameBn: "ওরিও মিল্কশেক", category: "milkshake", price: 180, popular: true, chefPick: false, description: "Creamy Oreo shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 79, name: "Strawberry Milkshake", nameBn: "স্ট্রবেরি মিল্কশেক", category: "milkshake", price: 160, popular: false, chefPick: false, description: "Fresh strawberry shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 80, name: "Mango Milkshake", nameBn: "ম্যাঙ্গো মিল্কশেক", category: "milkshake", price: 150, popular: true, chefPick: false, description: "Tropical mango shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 81, name: "Chocolate Milkshake", nameBn: "চকলেট মিল্কশেক", category: "milkshake", price: 150, popular: true, chefPick: true, description: "Rich dark chocolate shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 82, name: "Banana Milkshake", nameBn: "বানানা মিল্কশেক", category: "milkshake", price: 140, popular: false, chefPick: false, description: "Creamy banana shake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 83, name: "Kaju Nuts Milkshake", nameBn: "কাজু নাটস মিল্কশেক", category: "milkshake", price: 190, popular: false, chefPick: false, description: "Cashew nut milkshake", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 84, name: "Cold Coffee", nameBn: "কোল্ড কফি", category: "milkshake", price: 120, popular: false, chefPick: false, description: "Iced coffee blend", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 85, name: "Flavor Cold Coffee", nameBn: "ফ্লেভার কোল্ড কফি", category: "milkshake", price: 150, popular: false, chefPick: false, description: "Flavored iced coffee", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },

  // Coffee
  { id: 86, name: "Regular Hot Coffee", nameBn: "রেগুলার হট কফি", category: "coffee", price: 100, popular: false, chefPick: false, description: "Freshly brewed hot coffee", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
  { id: 87, name: "Black Coffee", nameBn: "ব্ল্যাক কফি", category: "coffee", price: 80, popular: false, chefPick: false, description: "Strong black coffee", image: "https://media.db.com/images/public/6a709030d676bd6178ead433/30c51f384_generated_2214ec62.png" },
];

export const categoryMap = {
  chickenFry: { en: "Chicken Fry", bn: "চিকেন ফ্রাই", icon: "🍗" },
  burgers: { en: "Burgers", bn: "বার্গার", icon: "🍔" },
  sandwich: { en: "Sandwich & Rolls", bn: "স্যান্ডউইচ ও রোল", icon: "🥪" },
  pasta: { en: "Pasta", bn: "পাস্তা", icon: "🍝" },
  pizza: { en: "Pizza", bn: "পিৎজা", icon: "🍕" },
  soup: { en: "Soup", bn: "স্যুপ", icon: "🍜" },
  noodles: { en: "Noodles", bn: "নুডলস", icon: "🍜" },
  salad: { en: "Salad", bn: "সালাদ", icon: "🥗" },
  nachos: { en: "Nachos", bn: "নাচোস", icon: "🧀" },
  khichuri: { en: "Khichuri", bn: "খিচুড়ি", icon: "🍲" },
  setMenu: { en: "Set Menu", bn: "সেট মেনু", icon: "🍱" },
  faluda: { en: "Faluda", bn: "ফালুদা", icon: "🧁" },
  lacchi: { en: "Lacchi & Juice", bn: "লাচ্ছি ও জুস", icon: "🥤" },
  iceCream: { en: "Ice Cream", bn: "আইসক্রিম", icon: "🍦" },
  milkshake: { en: "Milkshake", bn: "মিল্কশেক", icon: "🥛" },
  coffee: { en: "Coffee", bn: "কফি", icon: "☕" },
};