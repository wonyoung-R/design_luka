import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref } from 'firebase/database';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAoJrPVd7fLV_PFEyH30FPG5ohTvSB84-Q",
  authDomain: "design-luka.firebaseapp.com",
  projectId: "design-luka",
  storageBucket: "design-luka.firebasestorage.app",
  messagingSenderId: "877749621216",
  appId: "1:877749621216:web:4e373d65bf1d46bad11b85",
  databaseURL: "https://design-luka-default-rtdb.asia-southeast1.firebasedatabase.app"
};

// Firebase 초기화
const app = initializeApp(firebaseConfig);

// Auth, Database, Storage 인스턴스 생성
export const auth = getAuth(app);
export const database = getDatabase(app);
export const storage = getStorage(app);

// 데이터베이스 참조 함수
export const createRef = (path) => ref(database, path);
export const insightsRef = () => createRef('insights');
export const projectsRef = () => createRef('projects');

export default app; 