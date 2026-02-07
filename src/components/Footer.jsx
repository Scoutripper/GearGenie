import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const shopLinks = [
    { name: 'Rent Gear', path: '/rent' },
    { name: 'Buy Gear', path: '/buy' },
    { name: 'Trek Kits', path: '/trek-kits' },
    { name: 'Accessories', path: '/products' },
    { name: 'New Arrivals', path: '/products' },
  ];

  const customerServiceLinks = [
    { name: 'Contact Us', path: '/contact' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Shipping & Delivery', path: '/shipping' },
    { name: 'Returns & Exchanges', path: '/returns' },
    { name: 'Size Guide', path: '/size-guide' },
    { name: 'Track Order', path: '/track-order' },
  ];

  const companyLinks = [
    { name: 'About Us', path: '/about' },
    { name: 'Careers', path: '/careers' },
    { name: 'Blog', path: '/blog' },
    { name: 'Privacy Policy', path: '/privacy' },
    { name: 'Terms & Conditions', path: '/terms' },
  ];

  return (
    <footer className="bg-[#4ec5c1] text-white">
      <div className="container mx-auto px-6 py-10 lg:min-h-[603px] flex flex-col justify-between">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6">

          {/* LEFT SECTION */}
          <div className="lg:col-span-5">
            {/* Logo */}
            <Link to="/" className="inline-block mb-6 lg:mb-8">
              <img
                src="/assets/logo.png"
                alt="Scoutripper"
                className="brightness-0 invert"
                style={{ width: '200px', height: 'auto', objectFit: 'contain' }}
              />
            </Link>

            {/* Contact Info - Stack on mobile, side by side on desktop */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 mb-6 lg:mb-8">
              <div>
                <div className="text-sm text-white/90 mb-1">
                  Toll Free Customer Care
                </div>
                <a href="tel:+919888454430" className="font-medium hover:underline">
                  +91 98884 54430
                </a>
              </div>
              <div>
                <div className="text-sm text-white/90 mb-1">
                  Need Support?
                </div>
                <a href="mailto:hello@scoutripper.com" className="font-medium hover:underline">
                  hello@scoutripper.com
                </a>
              </div>
            </div>

            {/* Social Media */}
            <div>
              <div className="text-sm text-white/90 mb-3">
                Follow us on social media
              </div>
              <div className="flex gap-4">
                {/* Facebook */}
                <a href="#" className="text-white hover:text-white/80 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a href="#" className="text-white hover:text-white/80 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="lg:col-span-7 lg:pl-20">
            {/* Newsletter */}
            <div className="mb-8 lg:mb-10">
              <h3 className="font-semibold text-white mb-3">
                Get Updates & More
              </h3>

              <div className="flex w-full">
                <input
                  type="email"
                  placeholder="Your Email"
                  className="flex-1 px-4 sm:px-6 py-3 sm:py-5 text-sm rounded-l bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
                />
                <button className="px-6 sm:px-8 py-3 sm:py-3.5 bg-white text-[#324B4C] font-semibold rounded-r hover:bg-gray-100 transition-colors whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>

            {/* Footer Links - Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Shop Links */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Shop</h3>
                <ul className="space-y-3 lg:space-y-6">
                  {shopLinks.map(link => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-white/90 hover:text-white text-sm transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Customer Service Links */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Customer Service</h3>
                <ul className="space-y-3 lg:space-y-6">
                  {customerServiceLinks.map(link => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-white/90 hover:text-white text-sm transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Company Links */}
              <div>
                <h3 className="font-semibold mb-4 text-white">Company</h3>
                <ul className="space-y-3 lg:space-y-6">
                  {companyLinks.map(link => (
                    <li key={link.name}>
                      <Link
                        to={link.path}
                        className="text-white/90 hover:text-white text-sm transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom - Copyright */}
        <div className="pt-6 mt-8 lg:mt-auto flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-white/90 border-t border-white/20">
          <p>Copyright © {currentYear} by Scoutripper</p>
          <p>Made with <span className="text-red-400">❤️</span></p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;