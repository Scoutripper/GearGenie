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
            <div className="container mx-auto px-6 py-10 min-h-[603px] flex flex-col justify-between">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* LEFT */}
                    <div className="lg:col-span-5">
                        <Link to="/" className="inline-block mb-8">
                            <img
                                src="/assets/logo.png"
                                alt="Scoutripper"
                                className="brightness-0 invert"
                                style={{ width: '279px', height: '80px', objectFit: 'contain' }}
                            />
                        </Link>

                        <div className="flex gap-12 mb-8">
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

                        {/* SOCIAL */}
                        <div>
                            <div className="text-sm text-white/90 mb-3">
                                Follow us on social media
                            </div>
                            <div className="flex gap-4">
                                {/* Facebook */}
                                <a href="#" className="text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>

                                {/* Instagram (FIXED) */}
                                <a href="#" className="text-white">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm10 2a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3h10zm-5 3a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6zm4.5-.9a1.1 1.1 0 100 2.2 1.1 1.1 0 000-2.2z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT */}
                    <div className="lg:col-span-7 pl-20">
                        {/* NEWSLETTER */}
                        <div className="mb-10">
                            <h3 className="font-semibold text-white mb-3">
                                Get Updates & More
                            </h3>

                            <div className="flex w-full">
                                <div className="flex w-full max-w-[640px]">
                                    <input
                                        type="email"
                                        placeholder="Your Email"
                                        className="flex-1 px-6 py-5 text-sm rounded-l bg-white text-gray-700 placeholder-gray-400 focus:outline-none"
                                    />
                                    <button className="px-8 py-3.5 bg-white text-[#324B4C] font-semibold rounded-r">
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* LINKS */}
                        <div className="grid grid-cols-[auto_1fr_auto] gap-12 w-full">
  {/* SHOP (LEFT) */}
  <div className="justify-self-start">
    <h3 className="font-semibold mb-4 text-white">Shop</h3>
    <ul className="space-y-6">
      {shopLinks.map(link => (
        <li key={link.name}>
          <Link
            to={link.path}
            className="text-white/90 hover:text-white text-sm"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>

  {/* CUSTOMER SERVICE (CENTER) */}
  <div className="justify-self-center">
    <h3 className="font-semibold mb-4 text-white">Customer Service</h3>
    <ul className="space-y-6">
      {customerServiceLinks.map(link => (
        <li key={link.name}>
          <Link
            to={link.path}
            className="text-white/90 hover:text-white text-sm"
          >
            {link.name}
          </Link>
        </li>
      ))}
    </ul>
  </div>

  {/* COMPANY (RIGHT) */}
  <div className="justify-self-end ">
    <h3 className="font-semibold mb-4 text-white">Company</h3>
    <ul className="space-y-6">
      {companyLinks.map(link => (
        <li key={link.name}>
          <Link
            to={link.path}
            className="text-white/90 hover:text-white text-sm"
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

                {/* BOTTOM */}
                <div className="pt-6 mt-auto flex justify-between text-sm text-white/90">
                    <p>Copyright © {currentYear} by Scoutripper</p>
                    <p>Made with <span className="text-red-400">❤️</span></p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;