import { motion } from 'framer-motion';

const WhatsAppFloating = () => {
    const whatsappNumber = "628123456789"; // Replace with real number
    const message = "Halo Hartadinata, saya ingin mendaftar menjadi reseller.";
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    return (
        <motion.a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1, type: "spring", stiffness: 260, damping: 20 }}
            whileHover="hover"
            className="fixed bottom-8 right-8 z-[100] flex flex-row-reverse items-center p-3.5 bg-[#075E54]/90 hover:bg-[#128C7E] text-white rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.5)] cursor-pointer overflow-hidden backdrop-blur-md border border-white/5 transition-colors duration-300"
        >
            {/* Icon Container - Always on the right side of the expanded button */}
            <div className="relative z-10 w-7 h-7 flex items-center justify-center translate-x-0.5">
                <svg
                    viewBox="0 0 24 24"
                    className="w-full h-full fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393.015 12.03c0 2.123.543 4.197 1.574 6.035L0 24l6.096-1.6a11.802 11.802 0 005.949 1.586h.005c6.636 0 12.032-5.391 12.036-12.029a11.82 11.82 0 00-3.676-8.528z" />
                </svg>
            </div>

            <motion.span
                variants={{
                    hover: { width: "auto", opacity: 1, paddingRight: 12 },
                }}
                initial={{ width: 0, opacity: 0, paddingRight: 0 }}
                className="whitespace-nowrap font-bold text-[11px] tracking-[0.1em] uppercase overflow-hidden"
            >
                Hubungi Kami
            </motion.span>

            {/* Subtle Glow Effect */}
            <motion.div
                animate={{
                    opacity: [0.2, 0.4, 0.2],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                }}
                className="absolute inset-0 bg-primary/5 rounded-full z-0"
            />
        </motion.a>
    );
};

export default WhatsAppFloating;
