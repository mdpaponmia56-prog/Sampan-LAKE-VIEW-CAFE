import { db, hashPassword, verifyPassword, generateToken, verifyToken } from './db.js';

// Helper to parse JSON body from incoming Node HTTP request
export async function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

// Helper to send JSON response
export function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-App-Id'
  });
  res.end(JSON.stringify(data));
}

// Extract auth user from Request headers
export function getAuthUser(req) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.substring(7).trim();
  return verifyToken(token);
}

// Rate limiting and Lockout manager
const failedAttempts = new Map(); // ip_identifier -> { count, lockedUntil }

function checkBruteForce(identifier) {
  const attempt = failedAttempts.get(identifier);
  if (attempt && attempt.lockedUntil && attempt.lockedUntil > Date.now()) {
    const minutesLeft = Math.ceil((attempt.lockedUntil - Date.now()) / (60 * 1000));
    return { locked: true, minutesLeft };
  }
  return { locked: false };
}

function recordFailedLogin(identifier) {
  const now = Date.now();
  const attempt = failedAttempts.get(identifier) || { count: 0, lockedUntil: 0 };
  attempt.count += 1;
  if (attempt.count >= 5) {
    attempt.lockedUntil = now + 15 * 60 * 1000; // 15 minutes lockout
  }
  failedAttempts.set(identifier, attempt);
  return attempt;
}

function clearFailedLogin(identifier) {
  failedAttempts.delete(identifier);
}

// Main API request dispatcher
export async function handleApiRequest(req, res, urlPath) {
  const method = req.method;
  const rawUrl = urlPath || req.url || '/';
  const [pathname, queryString] = rawUrl.split('?');
  const params = new URLSearchParams(queryString || '');
  const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '127.0.0.1';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-App-Id'
    });
    return res.end();
  }

  try {
    // -------------------------------------------------------------
    // AUTHENTICATION & SECURITY
    // -------------------------------------------------------------
    if (pathname === '/api/auth/admin-login' && method === 'POST') {
      const body = await parseBody(req);
      const { identifier, password } = body; // identifier can be email or username
      const lockCheck = checkBruteForce(identifier || ip);

      if (lockCheck.locked) {
        return sendJson(res, 429, {
          error: `Security Lockout: Too many failed login attempts. Please try again in ${lockCheck.minutesLeft} minutes.`
        });
      }

      if (!identifier || !password) {
        return sendJson(res, 400, { error: 'Please enter both User ID / Email and Password.' });
      }

      const users = db.get('users');
      const user = users.find(u => 
        (u.email?.toLowerCase() === identifier.toLowerCase() || u.username?.toLowerCase() === identifier.toLowerCase())
      );

      if (!user) {
        recordFailedLogin(identifier || ip);
        db.logSecurity('FAILED_LOGIN_UNKNOWN_USER', identifier, ip, 'Invalid user ID entered.');
        return sendJson(res, 401, { error: 'Invalid User ID or Password.' });
      }

      const isMatch = verifyPassword(password, user.passwordHash, user.salt);
      if (!isMatch) {
        const attempt = recordFailedLogin(identifier || ip);
        const remaining = Math.max(0, 5 - attempt.count);
        db.logSecurity('FAILED_LOGIN_PASSWORD_MISMATCH', user.email, ip, `Password failure. Attempts remaining: ${remaining}`);
        return sendJson(res, 401, {
          error: remaining > 0 
            ? `Invalid credentials. ${remaining} attempt(s) remaining before security lockout.`
            : 'Too many failed attempts. Account locked for 15 minutes.'
        });
      }

      if (user.role !== 'admin') {
        db.logSecurity('UNAUTHORIZED_ADMIN_ACCESS_ATTEMPT', user.email, ip, 'Non-admin attempted admin portal login.');
        return sendJson(res, 403, { error: 'Access Denied: This account does not possess administrator privileges.' });
      }

      clearFailedLogin(identifier || ip);
      user.last_login = new Date().toISOString();
      db.save();

      const token = generateToken(user);
      db.logSecurity('ADMIN_LOGIN_SUCCESS', user.email, ip, 'Successful administrator login.');

      return sendJson(res, 200, {
        success: true,
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          fullName: user.fullName,
          phone: user.phone
        }
      });
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;
      const users = db.get('users');
      const user = users.find(u => u.email?.toLowerCase() === email?.toLowerCase() || u.username?.toLowerCase() === email?.toLowerCase());

      if (!user || !verifyPassword(password, user.passwordHash, user.salt)) {
        return sendJson(res, 401, { error: 'Invalid email or password.' });
      }

      const token = generateToken(user);
      return sendJson(res, 200, {
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          fullName: user.fullName
        }
      });
    }

    if (pathname === '/api/auth/register' && method === 'POST') {
      const body = await parseBody(req);
      const { email, password } = body;
      if (!email || !password) return sendJson(res, 400, { error: 'Email and password are required.' });

      const users = db.get('users');
      if (users.find(u => u.email?.toLowerCase() === email.toLowerCase())) {
        return sendJson(res, 400, { error: 'An account with this email already exists.' });
      }

      const { hash, salt } = hashPassword(password);
      const newUser = {
        id: 'usr-' + Date.now(),
        email: email.trim().toLowerCase(),
        username: email.split('@')[0].trim().toLowerCase(),
        passwordHash: hash,
        salt,
        role: 'user',
        fullName: email.split('@')[0],
        created_date: new Date().toISOString(),
        last_login: new Date().toISOString()
      };

      users.push(newUser);
      db.save();
      const token = generateToken(newUser);

      return sendJson(res, 201, {
        success: true,
        token,
        user: {
          id: newUser.id,
          email: newUser.email,
          username: newUser.username,
          role: newUser.role,
          fullName: newUser.fullName
        }
      });
    }

    if (pathname === '/api/auth/verify-otp' && method === 'POST') {
      const body = await parseBody(req);
      const { email } = body;
      const users = db.get('users');
      const user = users.find(u => u.email?.toLowerCase() === email?.toLowerCase()) || {
        id: 'usr-' + Date.now(),
        email,
        role: 'user'
      };
      const token = generateToken(user);
      return sendJson(res, 200, { access_token: token, user });
    }

    if (pathname === '/api/auth/me' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser) return sendJson(res, 401, { error: 'Unauthorized' });
      const users = db.get('users');
      const user = users.find(u => u.id === authUser.id);
      if (!user) return sendJson(res, 404, { error: 'User not found' });
      return sendJson(res, 200, {
        id: user.id,
        email: user.email,
        username: user.username,
        role: user.role,
        fullName: user.fullName,
        phone: user.phone
      });
    }

    if (pathname === '/api/auth/change-password' && method === 'POST') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const body = await parseBody(req);
      const { currentPassword, newPassword, newUsername, newEmail } = body;

      const users = db.get('users');
      const user = users.find(u => u.id === authUser.id);
      if (!user) return sendJson(res, 404, { error: 'User not found' });

      if (currentPassword && !verifyPassword(currentPassword, user.passwordHash, user.salt)) {
        return sendJson(res, 400, { error: 'Current password is incorrect.' });
      }

      if (newPassword) {
        if (newPassword.length < 8) return sendJson(res, 400, { error: 'New password must be at least 8 characters long.' });
        const { hash, salt } = hashPassword(newPassword);
        user.passwordHash = hash;
        user.salt = salt;
      }

      if (newUsername) user.username = newUsername.trim();
      if (newEmail) user.email = newEmail.trim().toLowerCase();

      db.save();
      db.logSecurity('PASSWORD_OR_PROFILE_UPDATED', user.email, ip, 'Admin profile updated.');

      const token = generateToken(user);
      return sendJson(res, 200, {
        success: true,
        message: 'Credentials updated successfully.',
        token,
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
          role: user.role,
          fullName: user.fullName
        }
      });
    }

    // -------------------------------------------------------------
    // MENU ITEMS & PRICE CONTROL
    // -------------------------------------------------------------
    if (pathname === '/api/menu-items' && method === 'GET') {
      let items = [...db.get('menuItems')];
      const category = params.get('category');
      const search = params.get('search');
      if (category && category !== 'all') {
        items = items.filter(i => i.category === category);
      }
      if (search) {
        const q = search.toLowerCase();
        items = items.filter(i => 
          i.name?.toLowerCase().includes(q) || 
          i.nameBn?.toLowerCase().includes(q) || 
          i.description?.toLowerCase().includes(q)
        );
      }
      return sendJson(res, 200, items);
    }

    if (pathname === '/api/menu-items' && method === 'POST') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const body = await parseBody(req);
      if (!body.name || !body.category || body.price == null) {
        return sendJson(res, 400, { error: 'Name, category, and price are required.' });
      }

      const items = db.get('menuItems');
      const newItem = {
        id: 'dish-' + Date.now(),
        name: body.name.trim(),
        nameBn: body.nameBn || body.name,
        category: body.category,
        price: Number(body.price),
        description: body.description || '',
        image: body.image || 'https://media.db.com/images/public/6a709030d676bd6178ead433/62e6f9f35_generated_7d39ceb9.png',
        popular: Boolean(body.popular),
        chefPick: Boolean(body.chefPick),
        available: body.available !== false,
        created_date: new Date().toISOString(),
        updated_date: new Date().toISOString()
      };

      items.unshift(newItem);
      db.save();
      db.logSecurity('MENU_ITEM_CREATED', authUser.email, ip, `Created dish: ${newItem.name} (৳${newItem.price})`);

      return sendJson(res, 201, newItem);
    }

    if (pathname.startsWith('/api/menu-items/') && pathname.endsWith('/price') && method === 'PATCH') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const parts = pathname.split('/');
      const itemId = parts[3];
      const body = await parseBody(req);
      const items = db.get('menuItems');
      const item = items.find(i => i.id == itemId);

      if (!item) return sendJson(res, 404, { error: 'Menu item not found.' });

      let newPrice = item.price;
      if (body.price != null) {
        newPrice = Math.max(0, Number(body.price));
      } else if (body.delta != null) {
        newPrice = Math.max(0, Number(item.price) + Number(body.delta));
      }

      const oldPrice = item.price;
      item.price = newPrice;
      item.updated_date = new Date().toISOString();
      db.save();

      db.logSecurity('PRICE_ADJUSTED', authUser.email, ip, `Changed "${item.name}" price from ৳${oldPrice} to ৳${newPrice}`);

      return sendJson(res, 200, item);
    }

    if (pathname === '/api/menu-items/bulk-price' && method === 'PATCH') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const body = await parseBody(req);
      const { category, deltaPercent, deltaFixed } = body;
      const items = db.get('menuItems');
      let count = 0;

      items.forEach(item => {
        if (!category || category === 'all' || item.category === category) {
          if (deltaPercent != null) {
            item.price = Math.max(0, Math.round(item.price * (1 + deltaPercent / 100)));
            count++;
          } else if (deltaFixed != null) {
            item.price = Math.max(0, item.price + Number(deltaFixed));
            count++;
          }
          item.updated_date = new Date().toISOString();
        }
      });

      db.save();
      db.logSecurity('BULK_PRICE_ADJUSTED', authUser.email, ip, `Updated ${count} items in category: ${category || 'all'}`);
      return sendJson(res, 200, { success: true, updatedCount: count, items });
    }

    if (pathname.startsWith('/api/menu-items/') && method === 'PUT') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const itemId = pathname.replace('/api/menu-items/', '');
      const body = await parseBody(req);
      const items = db.get('menuItems');
      const index = items.findIndex(i => i.id == itemId);

      if (index === -1) return sendJson(res, 404, { error: 'Menu item not found.' });

      items[index] = {
        ...items[index],
        ...body,
        price: Number(body.price ?? items[index].price),
        updated_date: new Date().toISOString()
      };

      db.save();
      db.logSecurity('MENU_ITEM_UPDATED', authUser.email, ip, `Updated dish: ${items[index].name}`);
      return sendJson(res, 200, items[index]);
    }

    if (pathname.startsWith('/api/menu-items/') && method === 'DELETE') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const itemId = pathname.replace('/api/menu-items/', '');
      let items = db.get('menuItems');
      const itemToDelete = items.find(i => i.id == itemId);

      if (!itemToDelete) return sendJson(res, 404, { error: 'Item not found.' });

      items = items.filter(i => i.id != itemId);
      db.set('menuItems', items);
      db.logSecurity('MENU_ITEM_DELETED', authUser.email, ip, `Deleted dish: ${itemToDelete.name}`);

      return sendJson(res, 200, { success: true, message: 'Item deleted successfully.' });
    }

    // -------------------------------------------------------------
    // ORDERS MANAGEMENT
    // -------------------------------------------------------------
    if (pathname === '/api/orders' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const orders = db.get('orders');
      return sendJson(res, 200, orders);
    }

    if (pathname === '/api/orders' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.customerName || !body.customerPhone || !body.items || body.items.length === 0) {
        return sendJson(res, 400, { error: 'Customer name, phone, and order items are required.' });
      }

      const orders = db.get('orders');
      const newOrder = {
        id: 'ord-' + Math.floor(1000 + Math.random() * 9000),
        customerName: body.customerName.trim(),
        customerPhone: body.customerPhone.trim(),
        customerEmail: body.customerEmail || '',
        items: body.items,
        subtotal: Number(body.subtotal || 0),
        deliveryFee: Number(body.deliveryFee || 0),
        discount: Number(body.discount || 0),
        total: Number(body.total || 0),
        orderType: body.orderType || 'delivery',
        address: body.address || '',
        notes: body.notes || '',
        status: 'pending',
        paymentMethod: body.paymentMethod || 'Cash on Delivery',
        paymentStatus: 'pending',
        created_date: new Date().toISOString()
      };

      orders.unshift(newOrder);
      db.save();

      return sendJson(res, 201, newOrder);
    }

    if (pathname.startsWith('/api/orders/') && pathname.endsWith('/status') && method === 'PATCH') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const parts = pathname.split('/');
      const orderId = parts[3];
      const body = await parseBody(req);
      const orders = db.get('orders');
      const order = orders.find(o => o.id === orderId);

      if (!order) return sendJson(res, 404, { error: 'Order not found.' });

      order.status = body.status || order.status;
      order.updated_date = new Date().toISOString();
      db.save();

      db.logSecurity('ORDER_STATUS_CHANGED', authUser.email, ip, `Order ${orderId} marked as ${order.status}`);
      return sendJson(res, 200, order);
    }

    if (pathname.startsWith('/api/orders/') && method === 'DELETE') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const orderId = pathname.replace('/api/orders/', '');
      let orders = db.get('orders');
      orders = orders.filter(o => o.id !== orderId);
      db.set('orders', orders);
      return sendJson(res, 200, { success: true });
    }

    // -------------------------------------------------------------
    // RESERVATIONS MANAGEMENT
    // -------------------------------------------------------------
    if (pathname === '/api/reservations' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const reservations = db.get('reservations');
      return sendJson(res, 200, reservations);
    }

    if (pathname === '/api/reservations' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || !body.phone || !body.date || !body.time) {
        return sendJson(res, 400, { error: 'Name, phone, date, and time are required for reservation.' });
      }

      const reservations = db.get('reservations');
      const newReservation = {
        id: 'res-' + Math.floor(100 + Math.random() * 900),
        name: body.name.trim(),
        email: body.email || '',
        phone: body.phone.trim(),
        date: body.date,
        time: body.time,
        guests: Number(body.guests || 2),
        tableNumber: body.tableNumber || 'Auto-Assigned',
        requests: body.requests || '',
        status: 'pending',
        created_date: new Date().toISOString()
      };

      reservations.unshift(newReservation);
      db.save();

      return sendJson(res, 201, newReservation);
    }

    if (pathname.startsWith('/api/reservations/') && pathname.endsWith('/status') && method === 'PATCH') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const parts = pathname.split('/');
      const resId = parts[3];
      const body = await parseBody(req);
      const reservations = db.get('reservations');
      const reservation = reservations.find(r => r.id === resId);

      if (!reservation) return sendJson(res, 404, { error: 'Reservation not found.' });

      reservation.status = body.status || reservation.status;
      if (body.tableNumber) reservation.tableNumber = body.tableNumber;
      db.save();

      db.logSecurity('RESERVATION_STATUS_CHANGED', authUser.email, ip, `Reservation ${resId} marked as ${reservation.status}`);
      return sendJson(res, 200, reservation);
    }

    if (pathname.startsWith('/api/reservations/') && method === 'DELETE') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const resId = pathname.replace('/api/reservations/', '');
      let reservations = db.get('reservations');
      reservations = reservations.filter(r => r.id !== resId);
      db.set('reservations', reservations);
      return sendJson(res, 200, { success: true });
    }

    // -------------------------------------------------------------
    // REVIEWS MODERATION
    // -------------------------------------------------------------
    if (pathname === '/api/reviews' && method === 'GET') {
      const authUser = getAuthUser(req);
      const reviews = db.get('reviews');

      // If requested by logged-in admin, return all reviews; otherwise only approved
      if (authUser && authUser.role === 'admin') {
        return sendJson(res, 200, reviews);
      }
      const approved = reviews.filter(r => r.status === 'approved');
      return sendJson(res, 200, approved);
    }

    if (pathname === '/api/reviews' && method === 'POST') {
      const body = await parseBody(req);
      if (!body.name || !body.text) {
        return sendJson(res, 400, { error: 'Name and review text are required.' });
      }

      const reviews = db.get('reviews');
      const newReview = {
        id: 'rev-' + Date.now(),
        name: body.name.trim(),
        email: body.email || '',
        text: body.text.trim(),
        rating: Math.min(5, Math.max(1, Number(body.rating || 5))),
        dishName: body.dishName || '',
        status: 'pending', // Requires admin moderation
        created_date: new Date().toISOString()
      };

      reviews.unshift(newReview);
      db.save();

      return sendJson(res, 201, newReview);
    }

    if (pathname.startsWith('/api/reviews/') && pathname.endsWith('/status') && method === 'PATCH') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const parts = pathname.split('/');
      const revId = parts[3];
      const body = await parseBody(req);
      const reviews = db.get('reviews');
      const review = reviews.find(r => r.id === revId);

      if (!review) return sendJson(res, 404, { error: 'Review not found.' });

      review.status = body.status || review.status;
      db.save();

      db.logSecurity('REVIEW_MODERATION', authUser.email, ip, `Review ${revId} status updated to: ${review.status}`);
      return sendJson(res, 200, review);
    }

    if (pathname.startsWith('/api/reviews/') && method === 'DELETE') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const revId = pathname.replace('/api/reviews/', '');
      let reviews = db.get('reviews');
      reviews = reviews.filter(r => r.id !== revId);
      db.set('reviews', reviews);
      return sendJson(res, 200, { success: true });
    }

    // -------------------------------------------------------------
    // USERS & STAFF MANAGEMENT
    // -------------------------------------------------------------
    if (pathname === '/api/users' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const users = db.get('users').map(u => ({
        id: u.id,
        email: u.email,
        username: u.username,
        role: u.role,
        fullName: u.fullName,
        phone: u.phone,
        created_date: u.created_date,
        last_login: u.last_login
      }));

      return sendJson(res, 200, users);
    }

    if (pathname === '/api/users' && method === 'POST') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const body = await parseBody(req);
      if (!body.email || !body.password) {
        return sendJson(res, 400, { error: 'Email and password are required.' });
      }

      const users = db.get('users');
      if (users.find(u => u.email?.toLowerCase() === body.email.toLowerCase())) {
        return sendJson(res, 400, { error: 'A user with this email already exists.' });
      }

      const { hash, salt } = hashPassword(body.password);
      const newUser = {
        id: 'usr-' + Date.now(),
        email: body.email.trim().toLowerCase(),
        username: (body.username || body.email.split('@')[0]).trim().toLowerCase(),
        passwordHash: hash,
        salt,
        role: body.role || 'user',
        fullName: body.fullName || 'Staff Member',
        phone: body.phone || '',
        created_date: new Date().toISOString(),
        last_login: null
      };

      users.push(newUser);
      db.save();
      db.logSecurity('USER_CREATED', authUser.email, ip, `Created ${newUser.role}: ${newUser.email}`);

      return sendJson(res, 201, {
        id: newUser.id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role,
        fullName: newUser.fullName
      });
    }

    if (pathname.startsWith('/api/users/') && method === 'DELETE') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const userId = pathname.replace('/api/users/', '');
      let users = db.get('users');
      if (userId === authUser.id) {
        return sendJson(res, 400, { error: 'You cannot delete your own active administrator account.' });
      }

      users = users.filter(u => u.id !== userId);
      db.set('users', users);
      db.logSecurity('USER_DELETED', authUser.email, ip, `Deleted user ID: ${userId}`);

      return sendJson(res, 200, { success: true });
    }

    // -------------------------------------------------------------
    // ANALYTICS & DASHBOARD
    // -------------------------------------------------------------
    if (pathname === '/api/analytics/overview' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const orders = db.get('orders');
      const reservations = db.get('reservations');
      const reviews = db.get('reviews');
      const menuItems = db.get('menuItems');

      const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
      const pendingOrders = orders.filter(o => o.status === 'pending').length;
      const pendingReservations = reservations.filter(r => r.status === 'pending').length;
      const pendingReviews = reviews.filter(r => r.status === 'pending').length;

      // Calculate popular dishes
      const dishSales = {};
      orders.forEach(ord => {
        (ord.items || []).forEach(it => {
          dishSales[it.name] = (dishSales[it.name] || 0) + (it.quantity || 1);
        });
      });

      const topDishes = Object.entries(dishSales)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);

      return sendJson(res, 200, {
        totalRevenue,
        ordersCount: orders.length,
        pendingOrders,
        reservationsCount: reservations.length,
        pendingReservations,
        reviewsCount: reviews.length,
        pendingReviews,
        menuItemsCount: menuItems.length,
        topDishes,
        recentOrders: orders.slice(0, 5)
      });
    }

    // -------------------------------------------------------------
    // PROMO CODES / COUPONS
    // -------------------------------------------------------------
    if (pathname === '/api/promos' && method === 'GET') {
      const promos = db.get('promos');
      return sendJson(res, 200, promos);
    }

    if (pathname === '/api/promos' && method === 'POST') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const body = await parseBody(req);
      if (!body.code || !body.discountValue) {
        return sendJson(res, 400, { error: 'Coupon code and discount value are required.' });
      }

      const promos = db.get('promos');
      const newPromo = {
        id: 'prm-' + Date.now(),
        code: body.code.toUpperCase().trim(),
        discountType: body.discountType || 'percent',
        discountValue: Number(body.discountValue),
        minOrder: Number(body.minOrder || 0),
        maxDiscount: Number(body.maxDiscount || 500),
        isActive: body.isActive !== false,
        usageCount: 0
      };

      promos.push(newPromo);
      db.save();
      return sendJson(res, 201, newPromo);
    }

    if (pathname === '/api/promos/validate' && method === 'POST') {
      const body = await parseBody(req);
      const { code, subtotal } = body;
      const promos = db.get('promos');
      const promo = promos.find(p => p.code.toUpperCase() === code?.toUpperCase() && p.isActive);

      if (!promo) {
        return sendJson(res, 404, { valid: false, error: 'Invalid or expired promo code.' });
      }

      if (subtotal < promo.minOrder) {
        return sendJson(res, 400, { valid: false, error: `Minimum order amount of ৳${promo.minOrder} required for this coupon.` });
      }

      let discount = 0;
      if (promo.discountType === 'percent') {
        discount = Math.min(promo.maxDiscount, Math.round((subtotal * promo.discountValue) / 100));
      } else {
        discount = Math.min(subtotal, promo.discountValue);
      }

      return sendJson(res, 200, { valid: true, code: promo.code, discount });
    }

    // -------------------------------------------------------------
    // SETTINGS & AUDIT LOGS
    // -------------------------------------------------------------
    if (pathname === '/api/settings' && method === 'GET') {
      return sendJson(res, 200, db.get('settings'));
    }

    if (pathname === '/api/settings' && method === 'PUT') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const body = await parseBody(req);
      const current = db.get('settings');
      const updated = { ...current, ...body };
      db.data.settings = updated;
      db.save();
      db.logSecurity('SETTINGS_UPDATED', authUser.email, ip, 'Restaurant operational settings updated.');

      return sendJson(res, 200, updated);
    }

    if (pathname === '/api/security/logs' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      return sendJson(res, 200, db.get('securityLogs'));
    }

    // -------------------------------------------------------------
    // DATABASE BACKUP & DISASTER RECOVERY
    // -------------------------------------------------------------
    if (pathname === '/api/backup/list' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const backups = db.listBackups();
      return sendJson(res, 200, {
        backups,
        totalItems: {
          dishes: db.get('menuItems').length,
          orders: db.get('orders').length,
          reservations: db.get('reservations').length,
          reviews: db.get('reviews').length,
          users: db.get('users').length,
          promos: db.get('promos').length
        },
        storageStatus: 'HEALTHY (Atomic Persistence Active)'
      });
    }

    if (pathname === '/api/backup/create' && method === 'POST') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const body = await parseBody(req);
      const label = body.label ? body.label.replace(/[^a-zA-Z0-9_-]/g, '_') : 'ADMIN_MANUAL';
      const result = db.createBackup(label);

      if (!result.success) {
        return sendJson(res, 500, { error: result.error || 'Backup creation failed.' });
      }

      return sendJson(res, 201, result);
    }

    if (pathname === '/api/backup/download' && method === 'GET') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const json = db.exportDatabase();
      const filename = `sampan-database-backup-${new Date().toISOString().split('T')[0]}.json`;

      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Access-Control-Allow-Origin': '*'
      });
      res.end(json);
      return;
    }

    if (pathname === '/api/backup/restore' && method === 'POST') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const body = await parseBody(req);
      const { filename } = body;
      if (!filename) return sendJson(res, 400, { error: 'Backup filename required.' });

      const result = db.restoreBackup(filename);
      if (!result.success) {
        return sendJson(res, 500, { error: result.error });
      }

      return sendJson(res, 200, result);
    }

    if (pathname === '/api/backup/import' && method === 'POST') {
      const authUser = getAuthUser(req);
      if (!authUser || authUser.role !== 'admin') return sendJson(res, 403, { error: 'Admin permission required.' });

      const body = await parseBody(req);
      const result = db.importDatabase(body);
      if (!result.success) {
        return sendJson(res, 400, { error: result.error || 'Import failed. Invalid JSON database structure.' });
      }

      return sendJson(res, 200, { success: true, message: 'Database successfully imported.' });
    }

    // 404 for unmatched API routes
    return sendJson(res, 404, { error: `API route ${method} ${pathname} not found.` });

  } catch (err) {
    console.error('Backend API Error:', err);
    return sendJson(res, 500, { error: 'Internal Server Error', details: err.message });
  }
}
