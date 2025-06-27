import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import lukaSlogan from '../images/aboutluka/LUKA slogan.png';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-black text-white pt-8 pb-6 font-noto-sans-kr">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6">

          {/* Logo and Company Info */}
          <div className="md:col-span-6">
            <img 
              src={lukaSlogan} 
              alt="LUKA Slogan" 
              className="h-8 w-auto mb-4 filter brightness-0 invert"
            />
            
            {/* Company Description */}
            <p className="text-neutral-light mb-3 text-xs">
            공간을 빛나게 함으로써, 삶에 품격을 더합니다.
            </p>
            
            {/* Copyright and Company Info */}
            <div className="pt-2 border-t border-white/10">
              <div className="text-xs text-neutral-light mb-1">
                &copy; {currentYear} DESIGN LUKA. All rights reserved.
              </div>
              <div className="text-xs text-neutral-light mb-2">
                루카앤컴퍼니 주식회사 | 대표자: 김규민 | 사업자 등록번호: 669-87-02507
              </div>
              <div className="flex flex-wrap gap-x-4">
                <a href="#" className="hidden hover:text-white transition-colors text-xs">Privacy Policy</a>
                <a href="#" className="hidden hover:text-white transition-colors text-xs">Terms of Service</a>
                <a href="#" className="hidden hover:text-white transition-colors text-xs">Sitemap</a>
                <Link to="/admin" className="hidden md:block hover:text-white transition-colors text-xs">관리자</Link>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="md:col-span-6 flex flex-col items-start md:items-end text-left md:text-right">
            <ul className="space-y-1 mb-4">
              <li className="flex items-start">
                <MapPinIcon className="w-3 h-3 text-accent mr-2 mt-0.5" />
                <span className="text-neutral-light text-xs">
                  서울특별시 서초구 사평대로57길 131, 2층<br />
                  (반포동, 웰빙센타 휴리재)
                </span>
              </li>
              <li className="flex items-center">
                <PhoneIcon className="w-3 h-3 text-accent mr-2" />
                <span className="text-neutral-light text-xs">02-6405-0075</span>
              </li>
              <li className="flex items-center">
                <EnvelopeIcon className="w-3 h-3 text-accent mr-2" />
                <span className="text-neutral-light text-xs">design_luka@naver.com</span>
              </li>
              <li className="flex items-start">
                <ClockIcon className="w-3 h-3 text-accent mr-2 mt-0.5" />
                <div>
                  <p className="text-neutral-light text-xs">평일: 09:00 - 18:00</p>
                  <p className="text-neutral-light text-xs">주말 및 공휴일 휴무</p>
                </div>
              </li>
            </ul>
            
            {/* Social Media Links */}
            <div className="flex space-x-3 self-start md:self-end">
              <a 
                href="https://www.instagram.com/design_luka_official" 
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"></path>
                </svg>
              </a>
              <a
                href="https://www.threads.com/@design_luka_official"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 50 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M25 2C12.3 2 2 12.3 2 25s10.3 23 23 23 23-10.3 23-23S37.7 2 25 2zm0 44C13.4 46 4 36.6 4 25S13.4 4 25 4s21 9.4 21 21-9.4 21-21 21zm0-32c-6.1 0-11 4.9-11 11 0 4.4 2.7 8.2 6.6 9.8.5.2.7-.2.7-.5v-1.7c-2.7.6-3.3-1.3-3.3-1.3-.5-1.1-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.5 1 1.5 1 .9 1.5 2.3 1.1 2.9.8.1-.6.3-1.1.6-1.3-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1-2.7-.1-.3-.4-1.3.1-2.6 0 0 .8-.3 2.7 1C19.7 15.8 22.3 15.8 25 15.8c2.7 0 5.3 0 7.2.2 1.9-1.3 2.7-1 2.7-1 .5 1.3.2 2.3.1 2.6.6.7 1 1.6 1 2.7 0 3.9-2.3 4.7-4.6 5 .4.3.7.9.7 1.9v2.8c0 .3.2.7.7.5C38.3 33.2 41 29.4 41 25c0-6.1-4.9-11-11-11z" />
                </svg>
              </a>
              <a
                href="https://ohou.se/experts/myhome/25337805"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
              >
                <svg className="w-5 h-5" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="512" height="512" rx="0" fill="#36C8F4"/>
                  <path d="M256 104.6L126.6 194.1c-6.1 4.2-9.8 11.1-9.8 18.4v175.9c0 12.4 10.1 22.5 22.5 22.5h233.4c12.4 0 22.5-10.1 22.5-22.5V212.5c0-7.3-3.7-14.2-9.8-18.4L256 104.6zM256 144.2l110.2 76.1v168.1H145.8V220.3L256 144.2zm0 64.8c-35.3 0-64 28.7-64 64s28.7 64 64 64 64-28.7 64-64-28.7-64-64-64zm0 32c17.7 0 32 14.3 32 32s-14.3 32-32 32-32-14.3-32-32 14.3-32 32-32z" fill="#fff"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 