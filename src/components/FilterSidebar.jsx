import { useState } from 'react';
import { X, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FilterSidebar = ({ isOpen, onClose, filters, setFilters }) => {
    const categories = [
        { name: 'All', count: 12 },
        { name: 'Footwear', count: 3 },
        { name: 'Jackets', count: 2 },
        { name: 'Backpacks', count: 3 },
        { name: 'Accessories', count: 2 },
        { name: 'Sleeping Gear', count: 2 },
    ];
    const difficulties = [
        { name: 'Easy', count: 4 },
        { name: 'Moderate', count: 5 },
        { name: 'Difficult', count: 3 },
        { name: 'Pro', count: 2 },
    ];
    const weatherTypes = [
        { name: 'Snow', count: 3 },
        { name: 'Rain', count: 4 },
        { name: 'Cold', count: 5 },
        { name: 'Dry', count: 2 },
    ];

    // Collapsible sections state
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        difficulty: true,
        weather: true,
        availability: true,
        price: true,
    });

    // Search states
    const [categorySearch, setCategorySearch] = useState('');

    const toggleSection = (section) => {
        setExpandedSections((prev) => ({
            ...prev,
            [section]: !prev[section],
        }));
    };

    const handleCategoryChange = (category) => {
        if (category === 'All') {
            setFilters({ ...filters, categories: [] });
        } else {
            const newCategories = filters.categories.includes(category)
                ? filters.categories.filter((c) => c !== category)
                : [...filters.categories, category];
            setFilters({ ...filters, categories: newCategories });
        }
    };

    const handleDifficultyChange = (difficulty) => {
        const newDifficulties = filters.difficulty.includes(difficulty)
            ? filters.difficulty.filter((d) => d !== difficulty)
            : [...filters.difficulty, difficulty];
        setFilters({ ...filters, difficulty: newDifficulties });
    };

    const handleWeatherChange = (weather) => {
        const newWeather = filters.weather.includes(weather)
            ? filters.weather.filter((w) => w !== weather)
            : [...filters.weather, weather];
        setFilters({ ...filters, weather: newWeather });
    };

    const handleAvailabilityChange = (inStock) => {
        setFilters({ ...filters, inStock: inStock });
    };

    const handlePriceChange = (field, value) => {
        setFilters({
            ...filters,
            priceRange: {
                ...filters.priceRange,
                [field]: parseInt(value) || 0,
            },
        });
    };

    const clearAllFilters = () => {
        setFilters({
            categories: [],
            difficulty: [],
            weather: [],
            inStock: null,
            priceRange: { min: 0, max: 5000 },
            days: { from: 0, to: 30 },
        });
        setCategorySearch('');
    };

    const hasActiveFilters =
        filters.categories.length > 0 ||
        filters.difficulty.length > 0 ||
        filters.weather.length > 0 ||
        filters.inStock !== null ||
        filters.priceRange.min > 0 ||
        filters.priceRange.max < 5000;

    const filteredCategories = categories.filter((cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase())
    );

    // Section Header Component
    const SectionHeader = ({ title, section, count }) => (
        <button
            onClick={() => toggleSection(section)}
            className="flex items-center justify-between w-full py-3 text-left group"
        >
            <span className="font-semibold text-sm text-slate-800 uppercase tracking-wide">
                {title}
                {count > 0 && (
                    <span className="ml-2 text-xs font-normal text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                        {count}
                    </span>
                )}
            </span>
            {expandedSections[section] ? (
                <ChevronUp className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
            ) : (
                <ChevronDown className="w-4 h-4 text-slate-500 group-hover:text-slate-700" />
            )}
        </button>
    );

    // Checkbox Item Component
    const CheckboxItem = ({ label, count, checked, onChange }) => (
        <label className="flex items-center gap-3 py-1.5 cursor-pointer group hover:bg-slate-50 px-2 -mx-2 rounded transition-colors">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="w-4 h-4 rounded border-2 border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer accent-blue-600"
            />
            <span className="text-sm text-slate-700 group-hover:text-slate-900 flex-1">
                {label}
            </span>
            {count !== undefined && (
                <span className="text-xs text-slate-400">({count})</span>
            )}
        </label>
    );

    return (
        <>
            {/* Mobile Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />
                )}
            </AnimatePresence>

            {/* Sidebar */}
            <motion.div
                initial={false}
                animate={isOpen ? { x: 0 } : { x: '-100%' }}
                className="fixed lg:relative inset-y-0 left-0 w-80 lg:w-full bg-white lg:bg-white overflow-y-auto z-50 lg:z-0 lg:translate-x-0 lg:inset-auto h-full lg:h-auto shadow-xl lg:shadow-none lg:border lg:border-slate-200 lg:rounded-xl"
            >
                {/* Mobile Header */}
                <div className="flex items-center justify-between p-4 border-b lg:hidden bg-white sticky top-0 z-10">
                    <h2 className="text-lg font-bold text-slate-800">FILTERS</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Desktop Header with Clear All */}
                <div className="hidden lg:flex items-center justify-between p-4 border-b border-slate-200">
                    <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">Filters</h2>
                    {hasActiveFilters && (
                        <button
                            onClick={clearAllFilters}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors"
                        >
                            Clear All
                        </button>
                    )}
                </div>

                <div className="p-4">
                    {/* Category Section */}
                    <div className="border-b border-slate-200">
                        <SectionHeader
                            title="Category"
                            section="category"
                            count={filters.categories.length}
                        />
                        <AnimatePresence>
                            {expandedSections.category && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    {/* Search Input */}
                                    <div className="relative mb-3">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <input
                                            type="text"
                                            placeholder="Search category..."
                                            value={categorySearch}
                                            onChange={(e) => setCategorySearch(e.target.value)}
                                            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    <div className="space-y-0.5 pb-4 max-h-48 overflow-y-auto">
                                        {filteredCategories.map((category) => (
                                            <CheckboxItem
                                                key={category.name}
                                                label={category.name}
                                                count={category.count}
                                                checked={
                                                    category.name === 'All'
                                                        ? filters.categories.length === 0
                                                        : filters.categories.includes(category.name)
                                                }
                                                onChange={() => handleCategoryChange(category.name)}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Trek Difficulty Section */}
                    <div className="border-b border-slate-200">
                        <SectionHeader
                            title="Trek Difficulty"
                            section="difficulty"
                            count={filters.difficulty.length}
                        />
                        <AnimatePresence>
                            {expandedSections.difficulty && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-0.5 pb-4">
                                        {difficulties.map((difficulty) => (
                                            <CheckboxItem
                                                key={difficulty.name}
                                                label={difficulty.name}
                                                count={difficulty.count}
                                                checked={filters.difficulty.includes(difficulty.name)}
                                                onChange={() => handleDifficultyChange(difficulty.name)}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Weather Section */}
                    <div className="border-b border-slate-200">
                        <SectionHeader
                            title="Weather"
                            section="weather"
                            count={filters.weather.length}
                        />
                        <AnimatePresence>
                            {expandedSections.weather && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-0.5 pb-4">
                                        {weatherTypes.map((weather) => (
                                            <CheckboxItem
                                                key={weather.name}
                                                label={weather.name}
                                                count={weather.count}
                                                checked={filters.weather.includes(weather.name)}
                                                onChange={() => handleWeatherChange(weather.name)}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Availability Section */}
                    <div className="border-b border-slate-200">
                        <SectionHeader
                            title="Availability"
                            section="availability"
                            count={filters.inStock !== null ? 1 : 0}
                        />
                        <AnimatePresence>
                            {expandedSections.availability && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="space-y-0.5 pb-4">
                                        <CheckboxItem
                                            label="In Stock"
                                            checked={filters.inStock === true}
                                            onChange={() => handleAvailabilityChange(filters.inStock === true ? null : true)}
                                        />
                                        <CheckboxItem
                                            label="Out of Stock"
                                            checked={filters.inStock === false}
                                            onChange={() => handleAvailabilityChange(filters.inStock === false ? null : false)}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Price Range Section */}
                    <div className="border-b border-slate-200">
                        <SectionHeader
                            title="Price Range"
                            section="price"
                            count={filters.priceRange.min > 0 || filters.priceRange.max < 5000 ? 1 : 0}
                        />
                        <AnimatePresence>
                            {expandedSections.price && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="pb-4 space-y-4">
                                        {/* Price Slider */}
                                        <div className="relative pt-2">
                                            <div className="h-2 bg-slate-200 rounded-full relative">
                                                <div
                                                    className="absolute h-full bg-blue-600 rounded-full"
                                                    style={{
                                                        left: `${(filters.priceRange.min / 5000) * 100}%`,
                                                        right: `${100 - (filters.priceRange.max / 5000) * 100}%`
                                                    }}
                                                />
                                            </div>
                                            <input
                                                type="range"
                                                min="0"
                                                max="5000"
                                                step="100"
                                                value={filters.priceRange.min}
                                                onChange={(e) => handlePriceChange('min', Math.min(e.target.value, filters.priceRange.max - 100))}
                                                className="absolute top-2 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                                            />
                                            <input
                                                type="range"
                                                min="0"
                                                max="5000"
                                                step="100"
                                                value={filters.priceRange.max}
                                                onChange={(e) => handlePriceChange('max', Math.max(e.target.value, filters.priceRange.min + 100))}
                                                className="absolute top-2 w-full h-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer"
                                            />
                                        </div>

                                        {/* Min-Max Inputs */}
                                        <div className="flex items-center gap-3">
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-500 mb-1">Min</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">₹</span>
                                                    <input
                                                        type="number"
                                                        min="0"
                                                        max={filters.priceRange.max}
                                                        value={filters.priceRange.min}
                                                        onChange={(e) => handlePriceChange('min', e.target.value)}
                                                        className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                            <span className="text-slate-400 mt-5">to</span>
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-500 mb-1">Max</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-500">₹</span>
                                                    <input
                                                        type="number"
                                                        min={filters.priceRange.min}
                                                        max="5000"
                                                        value={filters.priceRange.max}
                                                        onChange={(e) => handlePriceChange('max', e.target.value)}
                                                        className="w-full pl-7 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Mobile Footer with Clear & Apply */}
                <div className="lg:hidden sticky bottom-0 p-4 bg-white border-t border-slate-200 flex gap-3">
                    <button
                        onClick={clearAllFilters}
                        className="flex-1 py-3 px-4 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Clear All
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 py-3 px-4 bg-blue-600 rounded-lg text-sm font-medium text-white hover:bg-blue-700 transition-colors"
                    >
                        Apply Filters
                    </button>
                </div>
            </motion.div>
        </>
    );
};

export default FilterSidebar;
