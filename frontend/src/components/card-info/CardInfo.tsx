import "./CardInfo.css";
import { motion } from "framer-motion";

type CardInfoProps = {
  conteudo_cards: Array<{
    total: number;
    titulo: string;
    cor?: string;
  }>;
  className?: string;
};

export default function CardInfo({ conteudo_cards, className }: CardInfoProps) {
  return (
    <section className={`info-cards py-3 ${className ?? ""}`}>
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {conteudo_cards.map((card, index) => (
            <motion.div
              whileHover={{ scale: 1.035 }}
              transition={{ duration: 0.3 }}
              key={index}
              className={`card-info flex flex-col shadow-sm ${
                card.cor ?? "primary"
              }`}
            >
              <h1 className="total ml-5">{card.total}</h1>
              <h2 className="titulo-card-info text-gray-400 ml-12 mb-1">
                {card.titulo}
              </h2>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
