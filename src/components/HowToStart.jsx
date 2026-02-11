import { motion } from 'framer-motion';
import { ShoppingBag, Package, Map, Leaf } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from './Card';
import Button from './Button';

const HowToStart = () => {
    const options = [
        {
            icon: ShoppingBag,
            title: 'Rent Gear',
            description: 'Get quality gear for your next trek without the commitment',
            link: '/products',
            color: 'bg-emerald-50 text-emerald-600',
        },
        {
            icon: Package,
            title: 'Buy Gear',
            description: 'Own premium trekking equipment at great prices',
            link: '/products',
            color: 'bg-blue-50 text-blue-600',
        },
        {
            icon: Map,
            title: 'Trek-Based Gear Kits',
            description: 'Complete gear sets curated for specific treks',
            link: '/trek-kits',
            color: 'bg-purple-50 text-purple-600',
        },
        {
            icon: Leaf,
            title: 'Eco-Friendly Gear',
            description: 'Sustainable choices for conscious adventurers',
            link: '/eco-friendly',
            color: 'bg-green-50 text-green-600',
        },
    ];

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.2,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5 },
        },
    };

    return (
        <section className="py-20 bg-slate-50">
            <div className="container">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        How Would You Like to Start?
                    </h2>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                        Choose the option that best suits your adventure
                    </p>
                </motion.div>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto"
                >
                    {options.map((option, index) => {
                        const Icon = option.icon;
                        return (
                            <motion.div key={index} variants={itemVariants}>
                                <Card className="h-full text-center group cursor-pointer flex flex-col">
                                    <div className={`w-16 h-16 ${option.color} rounded-xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-2xl font-semibold mb-3">{option.title}</h3>
                                    <p className="text-slate-600 mb-6 flex-grow">{option.description}</p>
                                    <Link to={option.link}>
                                        <Button variant="secondary" className="w-full">
                                            Get Started
                                        </Button>
                                    </Link>
                                </Card>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
};

export default HowToStart;
