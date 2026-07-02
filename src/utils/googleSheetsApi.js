// Google Apps Script Web App URL for Q&A form
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxtKmmDhEbotU2JjwoGrGWEJ9t1su3EEVdADRLpDJ9emmA389VPgKURqxqi-roCOmBI/exec';

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
        phone: formattedPhone,
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

// Format date for display
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};
