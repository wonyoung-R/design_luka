import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Disclosure, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import logoWhite from '../images/logo/LUKA(W).png';

const navigation = [
  { name: 'About', href: '/about', current: false },
  { 
    name: 'Portfolio', 
    href: '/portfolio', 
    current: false,
    submenu: [
      { name: 'Residential', href: '/portfolio/residential' },
      { name: 'Commercial', href: '/portfolio/commercial' }
    ]
  },
  { name: 'Contact', href: '/contact', current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [portfolioOpen, setPortfolioOpen] = useState(false);
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

  return (
    <Disclosure as="nav" className={classNames(
      'fixed w-full z-40 transition-all duration-300',
      isHomePage 
        ? 'bg-transparent py-6' 
        : scrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    )}>
      {({ open }) => (
        <>
          <div className="w-full px-4 sm:px-6 lg:px-8">
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
              <div className="hidden sm:flex sm:space-x-8">
                {navigation.map((item) => (
                  <div key={item.name} className="relative">
                    {item.submenu ? (
                      <div 
                        className="relative"
                        onMouseEnter={() => setPortfolioOpen(true)}
                        onMouseLeave={() => setPortfolioOpen(false)}
                      >
                        <Link
                          to={item.href}
                          className={classNames(
                            'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200',
                            location.pathname.startsWith('/portfolio')
                              ? isHomePage ? 'text-accent' : 'text-accent'
                              : isHomePage 
                                ? 'text-white/80 hover:text-white' 
                                : 'text-primary-light hover:text-primary-dark'
                          )}
                        >
                          {item.name}
                        </Link>
                        
                        {/* Dropdown */}
                        {portfolioOpen && (
                          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5">
                            <div className="py-1">
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className="block px-4 py-2 text-sm text-primary hover:bg-neutral-light hover:text-primary-dark"
                                >
                                  {subItem.name}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        to={item.href}
                        className={classNames(
                          'inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200',
                          location.pathname === item.href
                            ? isHomePage ? 'text-accent' : 'text-accent'
                            : isHomePage 
                              ? 'text-white/80 hover:text-white' 
                              : 'text-primary-light hover:text-primary-dark'
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
                  "inline-flex items-center justify-center p-2 rounded-md hover:bg-neutral-light focus:outline-none focus:ring-2 focus:ring-inset focus:ring-accent",
                  isHomePage ? "text-white" : "text-primary"
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
          <Transition
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel className="sm:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
                {navigation.map((item) => (
                  <div key={item.name}>
                    <Disclosure.Button
                      as={Link}
                      to={item.href}
                      className={classNames(
                        location.pathname === item.href || 
                        (item.submenu && location.pathname.startsWith('/portfolio'))
                          ? 'bg-accent-light text-primary-dark'
                          : 'text-primary hover:bg-neutral-light',
                        'block px-3 py-2 rounded-md text-base font-medium'
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
                                ? 'bg-accent-light text-primary-dark'
                                : 'text-primary-light hover:bg-neutral-light',
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
          </Transition>
        </>
      )}
    </Disclosure>
  );
} 