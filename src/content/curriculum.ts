import { lessonSeedData } from "@/content/seed/lessons";
import {
  type Lesson,
  type Level,
  type Unit,
  lessonSchema,
  levelSchema,
  unitSchema,
} from "@/content/schemas";

export const lessons = lessonSchema.array().parse(lessonSeedData);

export const units: Unit[] = unitSchema.array().parse([
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
]);

export const levels: Level[] = levelSchema.array().parse([
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
]);

export function getLessonById(lessonId: string): Lesson | undefined {
  return lessons.find((lesson) => lesson.id === lessonId);
}

export function getLessonsForUnit(unitId: string): Lesson[] {
  return lessons
    .filter((lesson) => lesson.unitId === unitId)
    .sort((a, b) => a.order - b.order);
}

export function getUnitById(unitId: string): Unit | undefined {
  return units.find((unit) => unit.id === unitId);
}

export function getLevelById(levelId: Level["id"]): Level | undefined {
  return levels.find((level) => level.id === levelId);
}

export function getFirstLesson(): Lesson {
  return lessons[0];
}
