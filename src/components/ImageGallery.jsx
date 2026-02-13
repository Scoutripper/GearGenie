import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ImageGallery = ({ images, productName }) => {
    const [selectedImage, setSelectedImage] = useState(0);
    const [isZoomed, setIsZoomed] = useState(false);

    const [direction, setDirection] = useState(0);

    useEffect(() => {
        setSelectedImage(0);
        setDirection(0);
    }, [images]);

    const variants = {
        enter: (direction) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0
        })
    };

    const nextImage = () => {
        setDirection(1);
        setSelectedImage((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setDirection(-1);
        setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset, velocity) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-slate-100 rounded-xl overflow-hidden group touch-pan-y">
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    <motion.img
                        key={selectedImage}
                        src={images[selectedImage]}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{
                            x: { type: "spring", stiffness: 300, damping: 30 },
                            opacity: { duration: 0.2 }
                        }}
                        alt={`${productName} - ${selectedImage + 1}`}
                        className="w-full h-full object-cover cursor-grab active:cursor-grabbing absolute inset-0"
                        drag="x"
                        dragConstraints={{ left: 0, right: 0 }}
                        dragElastic={1}
                        onDragEnd={(e, { offset, velocity }) => {
                            const swipe = swipePower(offset.x, velocity.x);

                            if (swipe < -swipeConfidenceThreshold || offset.x < -50) {
                                nextImage();
                            } else if (swipe > swipeConfidenceThreshold || offset.x > 50) {
                                prevImage();
                            }
                        }}
                    />
                </AnimatePresence>

                {/* Zoom Icon */}
                <button
                    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setIsZoomed(true)}
                >
                    <ZoomIn className="w-5 h-5 text-slate-700" />
                </button>

                {/* Navigation Arrows */}
                {images.length > 1 && (
                    <>
                        <button
                            onClick={prevImage}
                            className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronLeft className="w-5 h-5 text-slate-700" />
                        </button>
                        <button
                            onClick={nextImage}
                            className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/90 hover:bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <ChevronRight className="w-5 h-5 text-slate-700" />
                        </button>
                    </>
                )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedImage(index)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                ? 'border-primary-500 ring-2 ring-primary-200'
                                : 'border-slate-200 hover:border-slate-300'
                                }`}
                        >
                            <img
                                src={image}
                                alt={`${productName} thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}

            {/* Zoomed Modal */}
            <AnimatePresence>
                {isZoomed && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
                        onClick={() => setIsZoomed(false)}
                    >
                        <img
                            src={images[selectedImage]}
                            alt={`${productName} zoomed`}
                            className="max-w-full max-h-full object-contain"
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ImageGallery;
