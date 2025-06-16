// Google API configuration
const API_KEY = 'AIzaSyCRf-WRLlJ_lzuxHvPhuHY7DiKL3yauUN0';
const CLIENT_ID = '332773576868-bj0k9v0vpubgd0gt538set394m5kdnfm.apps.googleusercontent.com';
const DISCOVERY_DOC = 'https://sheets.googleapis.com/$discovery/rest?version=v4';
const SCOPES = 'https://www.googleapis.com/auth/spreadsheets';
const SPREADSHEET_ID = '1gkwg3WZW_0F9NIfo8Bit7PkXwAdrbBTqp-4KgpdVdZw';

// Google Apps Script Web App URL
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbyXvdH5ip6Xaqh9jfzRx-rBz2LWYpvqnWkkyCHPitEXbOfMDxk6im_u75rZeXqSc5si/exec';

// Global variables
let gapi = null;
let googleAuth = null;
let isInitialized = false;
let initRetryCount = 0;
const MAX_RETRIES = 3;
const SCRIPT_LOAD_TIMEOUT = 10000;
const INIT_TIMEOUT = 10000;

// Debug logging function
const logDebug = (message, data = null) => {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[Google API ${timestamp}] ${message}:`, data);
  } else {
    console.log(`[Google API ${timestamp}] ${message}`);
  }
};

// Get the current base path
const getBasePath = () => {
  const path = window.location.pathname;
  return path.startsWith('/design_luka') ? '/design_luka' : '';
};

// Create a promise that resolves after a delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Check if Google API is available
const checkGoogleApiAvailability = () => {
  const isAvailable = typeof window.gapi !== 'undefined';
  logDebug('Google API availability check', { isAvailable });
  return isAvailable;
};

// Initialize Google API
export const initializeGapi = async () => {
  logDebug('Starting Google API initialization');
  
  if (isInitialized && gapi && googleAuth) {
    logDebug('Google API already initialized');
    return;
  }

  if (!window.gapi) {
    logDebug('Waiting for Google API script to load');
    // Wait for script to load (since it's in HTML)
    let attempts = 0;
    const maxAttempts = 50; // 5 seconds
    
    while (!window.gapi && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 100));
      attempts++;
    }
    
    if (!window.gapi) {
      throw new Error('Google API script not loaded after waiting');
    }
  }

  try {
    gapi = window.gapi;
    logDebug('Google API script loaded, initializing client:auth2');
    
    await new Promise((resolve, reject) => {
      gapi.load('client:auth2', {
        callback: async () => {
          try {
            logDebug('client:auth2 loaded, initializing client');
            await gapi.client.init({
              apiKey: API_KEY,
              clientId: CLIENT_ID,
              discoveryDocs: [DISCOVERY_DOC],
              scope: SCOPES
            });
            
            googleAuth = gapi.auth2.getAuthInstance();
            if (!googleAuth) {
              throw new Error('Auth2 instance not available after initialization');
            }
            
            logDebug('Google API client initialized successfully');
            isInitialized = true;
            resolve();
          } catch (error) {
            logDebug('Error during client initialization', error);
            reject(error);
          }
        },
        onerror: (error) => {
          logDebug('Error loading client:auth2', error);
          reject(new Error(`Failed to load Google API: ${error.message || 'Unknown error'}`));
        }
      });
    });
  } catch (error) {
    logDebug('Error in Google API initialization', error);
    throw error;
  }
};

// Sign in function
export const signIn = async () => {
  logDebug('Checking sign-in status');
  
  if (!isInitialized || !googleAuth) {
    await initializeGapi();
  }
  
  if (!googleAuth.isSignedIn.get()) {
    logDebug('User not signed in, initiating sign-in');
    try {
      await googleAuth.signIn();
      logDebug('User signed in successfully');
    } catch (error) {
      logDebug('Error during sign-in', error);
      throw error;
    }
  } else {
    logDebug('User already signed in');
  }
};

// Submit Q&A form data using Google Apps Script
export const submitQnAForm = async (formData) => {
  try {
    // 전화번호 앞에 작은따옴표 추가하여 문자열로 처리
    const formattedPhone = `'${formData.phone}`;
    
    console.log('Submitting form data to:', WEB_APP_URL);
    console.log('Form data:', { ...formData, phone: formattedPhone });

    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors', // CORS 이슈 해결을 위해 필요
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formattedPhone, // 수정된 전화번호 사용
        email: formData.email,
        message: formData.message,
        emailConsent: formData.emailConsent
      })
    });

    console.log('Form submission response:', response);
    // no-cors 모드에서는 response를 확인할 수 없으므로,
    // 항상 성공으로 처리하고 서버 측에서 에러를 처리
    return { status: 'success' };
  } catch (error) {
    console.error('Error submitting form:', error);
    throw new Error('문의사항 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
  }
};

// Submit contact form data to Google Sheets
export const submitContactForm = async (formData) => {
  if (!gapi) {
    await initializeGapi();
  }

  try {
    const response = await gapi.client.sheets.spreadsheets.values.append({
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
      range: 'ContactForm!A:E',
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [[
          new Date().toISOString(),
          formData.name,
          formData.email,
          formData.phone,
          formData.message
        ]]
      }
    });
    return response;
  } catch (error) {
    console.error('Error submitting form:', error);
    throw error;
  }
};

// Fetch press articles from Google Sheets
export const fetchPressArticles = async () => {
  if (!gapi) {
    await initializeGapi();
  }

  try {
    const response = await gapi.client.sheets.spreadsheets.values.get({
      spreadsheetId: process.env.REACT_APP_SPREADSHEET_ID,
      range: 'PressArticles!A:D'
    });

    const rows = response.result.values;
    if (!rows || rows.length === 0) {
      return [];
    }

    // Skip header row and map to article objects
    return rows.slice(1).map(row => ({
      date: row[0],
      title: row[1],
      source: row[2],
      link: row[3]
    }));
  } catch (error) {
    console.error('Error fetching press articles:', error);
    throw error;
  }
};

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}; 