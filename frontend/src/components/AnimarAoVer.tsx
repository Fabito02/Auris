import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const AnimarAoVer = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({
        threshold: 0.15,
    });

    useEffect(() => {
        if (inView) {
            controls.start({
                opacity: 1,
                y: 0,
                transition: { duration: 0.35, ease: "easeOut" },
            });
        } else {
            controls.start({
                opacity: 0,
                y: 20,
            });
        }
    }, [controls, inView]);

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={controls}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default AnimarAoVer;