import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const communityLinks = [
        { name: 'About Us', path: '/about' },
        { name: 'Cleanup Drive', path: '/cleanup-drive' },
        { name: 'Blog', path: '/blog' },
        { name: 'Memories', path: '/memories' },
        { name: 'Trekking Essentials', path: '/trekking-essentials' },
        { name: 'Contact', path: '/contact' },
    ];

    const supportLinks = [
        { name: 'Chat on Whatsapp', path: 'https://wa.me/+919888454430', external: true },
        { name: 'Terms & Conditions', path: '/terms' },
        { name: 'Privacy Policy', path: '/privacy' },
        { name: 'Cancellation & Refund Policy', path: '/refund' },
    ];

    const otherServicesLinks = [
        { name: 'Plan with TripGenie', path: '/tripgenie' },
        { name: 'Ask TrekGenie', path: '/trekgenie' },
        { name: 'Compare Treks', path: '/compare-treks' },
        { name: 'Write a Review', path: '/reviews' },
        { name: 'Calculate BMI', path: '/bmi-calculator' },
        { name: 'Eco Genie', path: '/ecogenie' },
    ];

    return (
        <footer className="bg-[#4ec5c1] text-white">
            <div className="max-w-[1522px] mx-auto px-6 py-10 min-h-[603px] flex flex-col    justify-between"> {/* Main Footer Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column - Logo & Contact */}
                    <div className="lg:col-span-4">
                        {/* Logo */}
                        <Link to="/" className="inline-block mb-8">
                            <img
                                src="/assets/logo.png"
                                alt="Scoutripper"
                                className="brightness-0 invert"
                                style={{ width: '279px', height: '80px', objectFit: 'contain' }}
                            />
                        </Link>

                        {/* Contact Info - Side by Side */}
                        <div className="flex gap-12 mb-8">
                            <div>
                                <div className="text-sm text-white/80 mb-1">Toll Free Customer Care</div>
                                <a
                                    href="tel:+919888454430"
                                    className="text-white font-medium hover:underline"
                                >
                                    +91 98884 54430
                                </a>
                            </div>
                            <div>
                                <div className="text-sm text-white/80 mb-1">Need Support?</div>
                                <a
                                    href="mailto:hello@scoutripper.com"
                                    className="text-white font-medium hover:underline"
                                >
                                    hello@scoutripper.com
                                </a>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div>
                            <div className="text-sm text-white/80 mb-3">
                                Follow us on social media
                            </div>
                            <div className="flex gap-4">
                                <a
                                    href="https://facebook.com/scoutripper"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-white/80"
                                    aria-label="Facebook"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a
                                    href="https://instagram.com/scoutripper"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-white hover:text-white/80"
                                    aria-label="Instagram"
                                >
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Newsletter + Links */}
                    <div className="lg:col-span-8">
                        {/* Newsletter Row */}
                        <div className="mb-10">
                            <h3 className="text-white font-semibold mb-3">
                                Get Updates & More
                            </h3>
                            <div className="flex max-w-md">
                                <input
                                    type="email"
                                    placeholder="Your Email"
                                    className="flex-1 px-4 py-3 text-sm rounded-l-md bg-white/20 border border-white/30 placeholder-white/70 text-white focus:outline-none focus:bg-white/30"
                                />
                                <button className="px-6 py-3 bg-white text-[#4ec5c1] text-sm font-semibold rounded-r-md hover:bg-white/90 transition-colors">
                                    Subscribe
                                </button>
                            </div>
                        </div>

                        {/* Links Columns */}
                        <div className="grid grid-cols-3 gap-8">
                            {/* Community Column */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">
                                    Community
                                </h3>
                                <ul className="space-y-4">
                                    {communityLinks.map((link) => (
                                        <li key={link.path}>
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

                            {/* Support Column */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">
                                    Support
                                </h3>
                                <ul className="space-y-4">
                                    {supportLinks.map((link) => (
                                        <li key={link.path}>
                                            {link.external ? (
                                                <a
                                                    href={link.path}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-white/90 hover:text-white text-sm"
                                                >
                                                    {link.name}
                                                </a>
                                            ) : (
                                                <Link
                                                    to={link.path}
                                                    className="text-white/90 hover:text-white text-sm"
                                                >
                                                    {link.name}
                                                </Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Other Services Column */}
                            <div>
                                <h3 className="text-white font-semibold mb-4">
                                    Other Services
                                </h3>
                                <ul className="space-y-4">
                                    {otherServicesLinks.map((link) => (
                                        <li key={link.path}>
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

                {/* Bottom Bar */}
                <div className="pt-6 border-t border-white/20 flex flex-col md:flex-row justify-between items-center gap-2 mt-auto">
                    <p className="text-white/90 text-sm">
                        Copyright © {currentYear} by Scoutripper
                    </p>
                    <p className="text-white/90 text-sm">
                        Made with <span className="text-red-400">❤️</span>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
