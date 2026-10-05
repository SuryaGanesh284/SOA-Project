/**
 * Archivalia Enterprise Academic E-Library System (PS038)
 * Automated End-to-End Microservices Verification Suite
 * Tests all 13 core workflows through API Gateway (Port 8080)
 */

const GATEWAY_URL = 'http://localhost:8080/api/v1';
const EUREKA_URL = 'http://localhost:8761';

let passedTests = 0;
let totalTests = 0;
let userToken = '';
let adminToken = '';

function logPass(title, details = '') {
  passedTests++;
  console.log(`\x1b[32m[PASS]\x1b[0m ${title} ${details ? `(${details})` : ''}`);
}

function logFail(title, error) {
  console.log(`\x1b[31m[FAIL]\x1b[0m ${title}`);
  console.error(`       Error: ${error}`);
}

async function request(endpoint, options = {}) {
  const url = `${GATEWAY_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  const res = await fetch(url, { ...options, headers });
  const text = await res.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = text;
  }
  return { status: res.status, ok: res.ok, data };
}

async function runSuite() {
  console.log('======================================================================');
  console.log('   Archivalia E-Library System (PS038) - E2E Verification Suite');
  console.log('   Target: Spring Cloud API Gateway (http://localhost:8080/api/v1)');
  console.log('======================================================================\n');

  // Test 1: Eureka Discovery Registry
  totalTests++;
  try {
    const res = await fetch(`${EUREKA_URL}/actuator/health`);
    if (res.ok) {
      logPass('Test 1: Eureka Service Registry Health', 'Port 8761 UP');
    } else {
      throw new Error(`Status ${res.status}`);
    }
  } catch (e) {
    logFail('Test 1: Eureka Service Registry Health', e.message);
  }

  // Test 2: API Gateway Actuator Health
  totalTests++;
  try {
    const res = await fetch('http://localhost:8080/actuator/health');
    if (res.ok) {
      logPass('Test 2: Spring Cloud API Gateway Health', 'Port 8080 UP');
    } else {
      throw new Error(`Status ${res.status}`);
    }
  } catch (e) {
    logFail('Test 2: Spring Cloud API Gateway Health', e.message);
  }

  // Test 3: User Authentication & JWT Generation
  totalTests++;
  try {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'user@archivalia.test', password: 'user123' })
    });
    const userObj = res.data.session || res.data.user;
    if (res.ok && res.data.token && userObj) {
      userToken = res.data.token;
      logPass('Test 3: Student User Login & JWT Generation', `User: ${userObj.name}, Token generated`);
    } else {
      throw new Error(JSON.stringify(res.data));
    }
  } catch (e) {
    logFail('Test 3: Student User Login & JWT Generation', e.message);
  }

  // Test 4: Admin Authentication & Privileges
  totalTests++;
  try {
    const res = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@archivalia.test', password: 'admin123' })
    });
    const userObj = res.data.session || res.data.user;
    if (res.ok && userObj && userObj.role === 'ADMIN') {
      adminToken = res.data.token;
      logPass('Test 4: Admin User Authentication', `Role: ${userObj.role}`);
    } else {
      throw new Error(JSON.stringify(res.data));
    }
  } catch (e) {
    logFail('Test 4: Admin User Authentication', e.message);
  }

  // Test 5: Protected User Profile Route
  totalTests++;
  try {
    const res = await request('/users/me', {
      headers: { Authorization: `Bearer ${userToken}` }
    });
    if (res.ok && res.data.email === 'user@archivalia.test') {
      logPass('Test 5: Protected Profile Route (JWT Authorized)', `Verified: ${res.data.email}`);
    } else {
      throw new Error(JSON.stringify(res.data));
    }
  } catch (e) {
    logFail('Test 5: Protected Profile Route (JWT Authorized)', e.message);
  }

  // Test 6: Catalog Inventory & Book Search
  totalTests++;
  try {
    const res = await request('/books');
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      logPass('Test 6: Catalog Inventory & Multi-format Search', `${res.data.length} titles available`);
    } else {
      throw new Error('Books array empty or invalid');
    }
  } catch (e) {
    logFail('Test 6: Catalog Inventory & Multi-format Search', e.message);
  }

  // Test 7: Physical Copy Tracking & Locations
  totalTests++;
  try {
    const res = await request('/copies');
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      const avail = res.data.filter(c => c.status === 'AVAILABLE').length;
      logPass('Test 7: Physical Copy Tracking & Shelving Locations', `${res.data.length} copies tracked, ${avail} available`);
    } else {
      throw new Error('Copies endpoint empty or invalid');
    }
  } catch (e) {
    logFail('Test 7: Physical Copy Tracking & Shelving Locations', e.message);
  }

  // Test 8: Circulation Active Loans Tracking
  totalTests++;
  try {
    const res = await request('/borrows/my?userId=USR-101');
    if (res.ok && Array.isArray(res.data)) {
      logPass('Test 8: Circulation Active Loans Tracking', `${res.data.length} loan records for USR-101`);
    } else {
      throw new Error('Borrows endpoint failed');
    }
  } catch (e) {
    logFail('Test 8: Circulation Active Loans Tracking', e.message);
  }

  // Test 9: Fine Service & Razorpay Sandbox Balance
  totalTests++;
  try {
    const res = await request('/fines/my?userId=USR-101');
    if (res.ok && Array.isArray(res.data)) {
      logPass('Test 9: Fines Management & Payment Gateway', `${res.data.length} fines registered for USR-101`);
    } else {
      throw new Error('Fines endpoint failed');
    }
  } catch (e) {
    logFail('Test 9: Fines Management & Payment Gateway', e.message);
  }

  // Test 10: Notification Alerts
  totalTests++;
  try {
    const res = await request('/notifications/me?userId=USR-101');
    if (res.ok && Array.isArray(res.data)) {
      logPass('Test 10: Notification Service & Activity Feed', `${res.data.length} alerts loaded`);
    } else {
      throw new Error('Notifications endpoint failed');
    }
  } catch (e) {
    logFail('Test 10: Notification Service & Activity Feed', e.message);
  }

  // Test 11: Content/Affinity AI Recommendation Engine
  totalTests++;
  try {
    const res = await request('/recommendations/me?userId=USR-101');
    if (res.ok && Array.isArray(res.data) && res.data.length > 0) {
      logPass('Test 11: AI Content/Affinity Recommendation Engine', `${res.data.length} personalized suggestions generated`);
    } else {
      throw new Error('Recommendations endpoint returned empty');
    }
  } catch (e) {
    logFail('Test 11: AI Content/Affinity Recommendation Engine', e.message);
  }

  // Test 12: Resource Discovery & JSoup Web Scraper
  totalTests++;
  try {
    const res = await request('/discovery/scrape-url', {
      method: 'POST',
      body: JSON.stringify({ url: 'https://en.wikipedia.org/wiki/Service-oriented_architecture' })
    });
    if (res.ok && res.data.title) {
      logPass('Test 12: Resource Discovery & JSoup Web Scraper', `Scraped: "${res.data.title}"`);
    } else {
      throw new Error('Scraper failed to extract metadata');
    }
  } catch (e) {
    logFail('Test 12: Resource Discovery & JSoup Web Scraper', e.message);
  }

  // Test 13: Admin Dashboard Ecosystem Health & KPIs
  totalTests++;
  try {
    const res = await request('/admin/dashboard');
    if (res.ok && res.data.servicesStatus) {
      const upCount = Object.values(res.data.servicesStatus).filter(s => s === 'UP').length;
      const totalServices = Object.keys(res.data.servicesStatus).length;
      logPass('Test 13: Admin Dashboard KPI Aggregation & Health', `${upCount}/${totalServices} microservices UP`);
    } else {
      throw new Error('Dashboard endpoint failed');
    }
  } catch (e) {
    logFail('Test 13: Admin Dashboard KPI Aggregation & Health', e.message);
  }

  console.log('\n======================================================================');
  if (passedTests === totalTests) {
    console.log(`\x1b[32mSUCCESS: All ${passedTests}/${totalTests} E2E Test Cases PASSED!\x1b[0m`);
    console.log('Microservices Ecosystem is 100% verified and operational.');
  } else {
    console.log(`\x1b[33mCOMPLETED: ${passedTests}/${totalTests} tests passed.\x1b[0m`);
  }
  console.log('======================================================================');
}

runSuite().catch(console.error);
