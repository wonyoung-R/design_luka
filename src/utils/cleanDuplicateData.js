import { database } from '../firebase/config';
import { ref, onValue, set, remove } from 'firebase/database';

// Firebase에서 중복 데이터 정리 함수
export const cleanDuplicatePortfolioData = async () => {
  try {
    const projectsRef = ref(database, 'portfolio');
    
    return new Promise((resolve, reject) => {
      onValue(projectsRef, async (snapshot) => {
        const data = snapshot.val();
        
        if (!data) {
          console.log('No portfolio data found');
          resolve();
          return;
        }
        
        console.log('Checking for duplicates in portfolio data...');
        
        const projects = Object.entries(data);
        const seenTitles = new Map(); // title을 키로 사용하여 중복 체크
        const duplicates = [];
        
        // 중복 체크
        projects.forEach(([id, project]) => {
          const title = project.title || `프로젝트 ${id}`;
          
          if (seenTitles.has(title)) {
            duplicates.push({
              id,
              title,
              duplicateOf: seenTitles.get(title)
            });
          } else {
            seenTitles.set(title, id);
          }
        });
        
        console.log(`Found ${duplicates.length} duplicate projects:`, duplicates);
        
        // 중복 제거 (나중에 생성된 것 삭제)
        for (const duplicate of duplicates) {
          try {
            await remove(ref(database, `portfolio/${duplicate.id}`));
            console.log(`Removed duplicate project: ${duplicate.id} (${duplicate.title})`);
          } catch (error) {
            console.error(`Error removing duplicate ${duplicate.id}:`, error);
          }
        }
        
        console.log('Duplicate cleanup completed');
        resolve();
      }, (error) => {
        console.error('Error reading portfolio data:', error);
        reject(error);
      });
    });
  } catch (error) {
    console.error('Error in cleanDuplicatePortfolioData:', error);
    throw error;
  }
};

// 중복 체크 함수 (읽기 전용)
export const checkDuplicatePortfolioData = () => {
  return new Promise((resolve, reject) => {
    const projectsRef = ref(database, 'portfolio');
    
    onValue(projectsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (!data) {
        console.log('No portfolio data found');
        resolve({ duplicates: [], total: 0 });
        return;
      }
      
      const projects = Object.entries(data);
      const seenTitles = new Map();
      const duplicates = [];
      
      projects.forEach(([id, project]) => {
        const title = project.title || `프로젝트 ${id}`;
        
        if (seenTitles.has(title)) {
          duplicates.push({
            id,
            title,
            duplicateOf: seenTitles.get(title),
            createdAt: project.createdAt
          });
        } else {
          seenTitles.set(title, id);
        }
      });
      
      console.log(`Found ${duplicates.length} duplicates out of ${projects.length} total projects`);
      resolve({ duplicates, total: projects.length });
    }, (error) => {
      console.error('Error checking duplicates:', error);
      reject(error);
    });
  });
}; 