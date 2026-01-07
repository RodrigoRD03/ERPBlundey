import { MaintenanceSVG, SmallLogo } from "../../constants";
import { motion } from "framer-motion";

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.3,
      duration: 0.6,
      ease: "easeOut",
    },
  }),
};

const Maintenance = () => {
  return (
    <div className="w-full h-screen flex gap-8 items-center justify-center text-2xl font-bold font-display relative">
      <motion.div
        className="absolute top-5 left-5"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <img className="w-16" src={SmallLogo} alt="" />
      </motion.div>

      <motion.div
        className="bg-white p-4 rounded-xl"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={1}
      >
        <img className="h-84" src={MaintenanceSVG} alt="Small Logo" />
      </motion.div>

      <motion.div
        className="text-start max-w-130"
        variants={fadeIn}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <h1 className="text-4xl text-sovetec-primary">
          Estamos en Mantenimiento
        </h1>
        <h3 className="text-xl text-sovetec-thirty font-semibold">
          ¡Volveremos pronto!
        </h3>
        <div className="flex flex-col gap-2 mt-4 text-pretty">
          {[
            "Estamos realizando actualizaciones importantes para brindarte una mejor experiencia.",
            "En unos momentos todo volverá a la normalidad.",
            "Agradecemos tu comprensión.",
          ].map((text, i) => (
            <motion.p
              key={i}
              className="text-[16px] text-zinc-700 font-medium"
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              custom={3 + i}
            >
              {text}
            </motion.p>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Maintenance;
