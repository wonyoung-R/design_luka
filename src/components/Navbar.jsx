import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logoWhite from '../images/logo/LUKA(W).png';

const navigation = [
  { name: 'About LUKA', href: '/about', current: false },
  // { name: 'Business', href: '/business', current: false },
  {
    name: 'Portfolio',
    href: '/portfolio', 
    current: false,
    submenu: [
      { name: 'Residential', href: '/portfolio?category=residential' },
      { name: 'Commercial', href: '/portfolio?category=commercial' }
    ]
  },
  { name: 'Insight & Contents', href: '/insight', current: false },
  { name: 'Contact', href: '/contact', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [businessOpen, setBusinessOpen] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const [businessTimeout, setBusinessTimeout] = useState(null);
  const [portfolioTimeout, setPortfolioTimeout] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isPortfolioHovered, setIsPortfolioHovered] = useState(false);
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    if (!isHomePage) {
      const handleScroll = () => {
        const isScrolled = window.scrollY > 10;
        if (isScrolled !== scrolled) {
          setScrolled(isScrolled);
        }
      };

      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [scrolled, isHomePage]);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <Disclosure as="nav" className={classNames(
      'fixed w-full z-40 transition-all duration-300 h-16',
      isHomePage 
        ? 'bg-transparent' 
        : scrolled ? 'bg-white/70 backdrop-blur-sm shadow-md' : 'bg-white'
    )}>
      {({ open }) => (
        <>
          <div className="w-full max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              {/* Logo - Left side */}
              <motion.div 
                className="flex-shrink-0 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Link to="/" className="flex items-center">
                  <img
                    src={logoWhite}
                    alt="LUKA"
                    className={classNames(
                      "h-8 w-auto",
                      isHomePage ? "" : "filter brightness-0"
                    )}
                  />
                </Link>
              </motion.div>

              {/* Desktop menu - Right side */}
              <div className="hidden sm:flex sm:space-x-4 md:space-x-6 lg:space-x-8">
                {navigation.map((item) => (
                  <div key={item.name} className="relative">
                    {item.submenu ? (
                      <div 
                        className="relative"
                        onMouseEnter={() => {
                          if (item.name === 'Business') {
                            if (businessTimeout) {
                              clearTimeout(businessTimeout);
                              setBusinessTimeout(null);
                            }
                            setBusinessOpen(true);
                          } else if (item.name === 'Portfolio') {
                            if (portfolioTimeout) {
                              clearTimeout(portfolioTimeout);
                              setPortfolioTimeout(null);
                            }
                            setPortfolioOpen(true);
                          }
                        }}
                        onMouseLeave={() => {
                          if (item.name === 'Business') {
                            const timeout = setTimeout(() => {
                              setBusinessOpen(false);
                            }, 150);
                            setBusinessTimeout(timeout);
                          } else if (item.name === 'Portfolio') {
                            const timeout = setTimeout(() => {
                              setPortfolioOpen(false);
                            }, 150);
                            setPortfolioTimeout(timeout);
                          }
                        }}
                      >
                        <Link
                          to={item.href}
                          className={classNames(
                            'inline-flex items-center px-1 pt-1 text-sm font-normal font-[\'Noto_Sans_KR\'] transition-colors duration-200 relative',
                            location.pathname.startsWith(item.href)
                              ? isHomePage ? 'text-white' : 'text-accent'
                              : isHomePage 
                                ? 'text-white/80 hover:text-white' 
                                : 'text-black hover:text-primary-dark',
                            'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full',
                            isHomePage ? 'after:bg-white' : 'after:bg-black'
                          )}
                        >
                          {item.name}
                        </Link>
                        
                        {/* Dropdown */}
                        <AnimatePresence>
                          {(item.name === 'Business' && businessOpen) || (item.name === 'Portfolio' && portfolioOpen) ? (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.3, ease: 'easeInOut' }}
                              className={classNames(
                                "absolute top-full left-0 mt-1 w-64 backdrop-blur-sm rounded-lg shadow-lg",
                                isHomePage ? "bg-black/20" : "bg-white/90"
                              )}
                            >
                              <div className="py-2">
                                {item.submenu.map((subItem) => (
                                  <div key={subItem.name}>
                                    {subItem.submenu ? (
                                      // Nested submenu
                                      <div className="px-4 py-2">
                                        <div className={classNames(
                                          "text-xs font-semibold mb-1",
                                          isHomePage ? "text-white" : "text-primary-dark"
                                        )}>
                                          {subItem.name}
                                        </div>
                                        <div className={classNames(
                                          "pl-2 border-l-2",
                                          isHomePage ? "border-white/20" : "border-accent/20"
                                        )}>
                                          {subItem.submenu.map((nestedItem) => (
                                            <Link
                                              key={nestedItem.name}
                                              to={nestedItem.href}
                                              className={classNames(
                                                "block px-2 py-1 text-sm transition-all duration-300 ease-in-out hover:pl-4",
                                                isHomePage 
                                                  ? "text-white hover:bg-white/20" 
                                                  : "text-primary hover:bg-black/10"
                                              )}
                                            >
                                              {nestedItem.name}
                                            </Link>
                                          ))}
                                        </div>
                                      </div>
                                    ) : (
                                      // Regular submenu item
                                      <Link
                                        to={subItem.href}
                                        className={classNames(
                                          "block px-4 py-2 text-sm transition-all duration-300 ease-in-out hover:pl-6",
                                          isHomePage 
                                            ? "text-white hover:bg-white/20" 
                                            : "text-primary hover:bg-black/10"
                                        )}
                                      >
                                        {subItem.name}
                                      </Link>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ) : null}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={classNames(
                          'inline-flex items-center px-1 pt-1 text-sm font-normal font-[\'Noto_Sans_KR\'] transition-colors duration-200 relative',
                          location.pathname === item.href
                            ? isHomePage ? 'text-white' : 'text-accent'
                            : isHomePage 
                              ? 'text-white/80 hover:text-white' 
                              : 'text-black hover:text-primary-dark',
                          'after:content-[""] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:transition-all after:duration-300 after:ease-in-out hover:after:w-full',
                          isHomePage ? 'after:bg-white' : 'after:bg-black'
                        )}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </div>

              {/* Mobile menu button */}
              <div className="sm:hidden">
                <Disclosure.Button className={classNames(
                  "inline-flex items-center justify-center p-2 focus:outline-none",
                  isHomePage ? "text-white" : "text-black"
                )}>
                  <span className="sr-only">메뉴 열기</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu panel */}
          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.1 }}
              >
                <Disclosure.Panel className="sm:hidden">
                  <div className={classNames(
                    "px-2 pt-2 pb-3 space-y-1 shadow-lg",
                    isHomePage ? "bg-black/90" : "bg-white"
                  )}>
                    {navigation.map((item) => (
                      <div key={item.name}>
                        <Disclosure.Button
                          as={Link}
                          to={item.href}
                          className={classNames(
                            location.pathname === item.href || 
                            (item.submenu && location.pathname.startsWith('/portfolio'))
                              ? isHomePage ? 'bg-white/20 text-white' : 'bg-accent-light text-primary-dark'
                              : isHomePage ? 'text-white hover:bg-white/20' : 'text-black hover:bg-neutral-light',
                            'block px-3 py-2 rounded-md text-base font-normal font-[\'Noto_Sans_KR\']'
                          )}
                        >
                          {item.name}
                        </Disclosure.Button>
                        {item.submenu && (
                          <div className="ml-4 space-y-1">
                            {item.submenu.map((subItem) => (
                              <Disclosure.Button
                                key={subItem.name}
                                as={Link}
                                to={subItem.href}
                                className={classNames(
                                  location.pathname === subItem.href
                                    ? isHomePage ? 'bg-white/20 text-white' : 'bg-accent-light text-primary-dark'
                                    : isHomePage ? 'text-white/80 hover:bg-white/20' : 'text-primary-light hover:bg-neutral-light',
                                  'block px-3 py-2 rounded-md text-sm'
                                )}
                              >
                                {subItem.name}
                              </Disclosure.Button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Disclosure.Panel>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Disclosure>
  );
} 