import type { Level, Unit } from "../schemas";

export const unitSeedData = [
  {
    id: "k0-u1",
    levelId: "K0",
    title: {
      ky: "Баштапкы үндөр жана окуу",
      en: "Starter sounds and reading",
      ru: "Начальные звуки и чтение",
    },
    description: {
      ky: "Алфавит, өзгөчө тамгалар жана жөнөкөй саламдашуу.",
      en: "Alphabet basics, special letters, and simple greetings.",
      ru: "Основы алфавита, особые буквы и простые приветствия.",
    },
    lessonIds: ["k0-u1-l1", "k0-u1-l2"],
  },
  {
    id: "k1-u1",
    levelId: "K1",
    title: {
      ky: "Күнүмдүк башталыш",
      en: "Everyday basics",
      ru: "Повседневное начало",
    },
    description: {
      ky: "Таанышуу, кафе жана күнүмдүк аман калуу тили.",
      en: "Introductions, cafe language, and everyday survival phrases.",
      ru: "Знакомство, кафе и язык для повседневных ситуаций.",
    },
    lessonIds: ["k1-u1-l1"],
  },
] satisfies Unit[];

export const levelSeedData = [
  {
    id: "K0",
    title: {
      ky: "K0 Нөлдөн баштоо",
      en: "K0 Absolute beginner",
      ru: "K0 С нуля",
    },
    description: {
      ky: "Алфавит, ө, ү, ң, саламдашуу жана жөнөкөй окуу.",
      en: "Alphabet, ө, ү, ң, greetings, and simple reading.",
      ru: "Алфавит, ө, ү, ң, приветствия и простое чтение.",
    },
    unitIds: ["k0-u1"],
  },
  {
    id: "K1",
    title: {
      ky: "K1 Күнүмдүк кырдаалдар",
      en: "K1 Everyday survival",
      ru: "K1 Повседневные ситуации",
    },
    description: {
      ky: "Таанышуу, үй-бүлө, сандар, тамак, кафе, дүкөн, базар, такси жана дарек.",
      en: "Introductions, family, numbers, food, cafe, shop, bazaar, taxi, and address.",
      ru: "Знакомство, семья, числа, еда, кафе, магазин, базар, такси и адрес.",
    },
    unitIds: ["k1-u1"],
  },
] satisfies Level[];
