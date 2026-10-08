import type { CareMapAnalysis, Language } from "./schema";

const appointmentQuote = "A follow-up appointment is scheduled for October 15, 2026, at 10:30 AM.";
const preparationQuote = "Please bring your current medication list to the follow-up appointment.";
const laboratoryQuote = "The visit notes mention an additional laboratory test, but the date and scheduling instructions are not specified. Please ask the clinic to clarify.";
const laboratoryDefinitionQuote = "A laboratory test is an examination of a sample, such as blood, in a laboratory.";

export const DEMO_DOCUMENT = `FICTIONAL DEMO — AFTER-VISIT SUMMARY

Visit date: October 8, 2026.

${appointmentQuote}

${preparationQuote}

${laboratoryQuote}

${laboratoryDefinitionQuote}

No new medication instructions are included in this summary.`;

export function isDemoDocument(text: string): boolean {
  return text.trim() === DEMO_DOCUMENT.trim();
}

export const demoAnalyses: Record<Language, CareMapAnalysis> = {
  en: {
    summary: "This fictional summary is from a visit on October 8, 2026. Your follow-up appointment is scheduled for October 15 at 10:30 AM. Bring your current medication list. A laboratory test is mentioned, but when and how to arrange it are missing, so the summary asks you to clarify with the clinic. No new medication instructions are included.",
    actions: [
      {
        id: "follow-up",
        title: "Your follow-up appointment",
        description: "The summary records a follow-up appointment for October 15, 2026, at 10:30 AM.",
        category: "appointment",
        when: "October 15, 2026 · 10:30 AM",
        sourceQuote: appointmentQuote,
        needsConfirmation: false,
      },
      {
        id: "medication-list",
        title: "Bring your current medication list",
        description: "Bring the list of medications you currently take to your follow-up appointment.",
        category: "preparation",
        when: "At your follow-up appointment",
        sourceQuote: preparationQuote,
        needsConfirmation: false,
      },
      {
        id: "clarify-test",
        title: "Ask the clinic about the laboratory test",
        description: "The test date and scheduling instructions are missing. The summary asks you to contact the clinic for clarification.",
        category: "administrative",
        when: null,
        sourceQuote: laboratoryQuote,
        needsConfirmation: true,
      },
    ],
    terms: [
      {
        term: "follow-up appointment",
        explanation: "Another appointment after your earlier visit. This document gives its date and time: October 15, 2026, at 10:30 AM.",
        sourceQuote: appointmentQuote,
      },
      {
        term: "laboratory test",
        explanation: "An examination of a sample, such as blood, in a laboratory. The document explains the term but does not say which test is planned or how to schedule it.",
        sourceQuote: laboratoryDefinitionQuote,
      },
    ],
    questionsForDoctor: [
      "Which laboratory test is mentioned in my summary, and when and how should it be scheduled?",
      "Is any preparation required for that laboratory test?",
      "Where will my follow-up appointment take place?",
    ],
    uncertainties: [
      {
        explanation: "The summary mentions a laboratory test but does not specify its date or scheduling instructions. Ask the clinic to clarify before making arrangements.",
        sourceQuote: laboratoryQuote,
      },
    ],
    quiz: [
      {
        question: "When is the documented follow-up appointment?",
        options: ["October 12, 2026, at 10:30 AM", "October 15, 2026, at 10:30 AM", "October 20, 2026, at 10:30 AM"],
        correctAnswerIndex: 1,
        explanation: "The original summary states October 15, 2026, at 10:30 AM.",
        sourceQuote: appointmentQuote,
      },
      {
        question: "What does the summary ask you to bring to your follow-up?",
        options: ["Your current medication list", "A new prescription", "Laboratory test results"],
        correctAnswerIndex: 0,
        explanation: "The documented request is to bring your current medication list.",
        sourceQuote: preparationQuote,
      },
      {
        question: "What needs clarification about the laboratory test?",
        options: ["The follow-up appointment date", "What to bring to the follow-up", "The test date and scheduling instructions"],
        correctAnswerIndex: 2,
        explanation: "The date and scheduling instructions are not specified. The summary asks you to clarify with the clinic.",
        sourceQuote: laboratoryQuote,
      },
    ],
  },
  uz: {
    summary: "Bu xayoliy xulosa 2026-yil 8-oktabrdagi qabulga tegishli. Keyingi qabulingiz 15-oktabr soat 10:30 ga belgilangan. Qabulga hozir qabul qilayotgan dorilaringiz ro‘yxatini olib boring. Laboratoriya tekshiruvi tilga olingan, ammo uni qachon va qanday rejalashtirish yozilmagan; xulosada klinikadan aniqlashtirish so‘ralgan. Yangi dori bo‘yicha ko‘rsatmalar kiritilmagan.",
    actions: [
      {
        id: "follow-up",
        title: "Keyingi qabulingiz",
        description: "Xulosada keyingi qabul 2026-yil 15-oktabr soat 10:30 ga belgilangan.",
        category: "appointment",
        when: "2026-yil 15-oktabr · 10:30",
        sourceQuote: appointmentQuote,
        needsConfirmation: false,
      },
      {
        id: "medication-list",
        title: "Hozirgi dorilaringiz ro‘yxatini olib boring",
        description: "Keyingi qabulga hozir qabul qilayotgan dorilaringiz ro‘yxatini olib boring.",
        category: "preparation",
        when: "Keyingi qabulda",
        sourceQuote: preparationQuote,
        needsConfirmation: false,
      },
      {
        id: "clarify-test",
        title: "Laboratoriya tekshiruvi haqida klinikadan so‘rang",
        description: "Tekshiruv sanasi va rejalashtirish tartibi yozilmagan. Xulosada bu ma’lumotlarni klinikadan aniqlashtirish so‘ralgan.",
        category: "administrative",
        when: null,
        sourceQuote: laboratoryQuote,
        needsConfirmation: true,
      },
    ],
    terms: [
      {
        term: "follow-up appointment",
        explanation: "Avvalgi tashrifdan keyingi navbatdagi qabul. Ushbu hujjatda uning sanasi va vaqti berilgan: 2026-yil 15-oktabr, soat 10:30.",
        sourceQuote: appointmentQuote,
      },
      {
        term: "laboratory test",
        explanation: "Qon kabi namunani laboratoriyada tekshirish. Hujjat atamani tushuntiradi, ammo qaysi tekshiruv rejalashtirilgani yoki unga qanday yozilish kerakligini aytmaydi.",
        sourceQuote: laboratoryDefinitionQuote,
      },
    ],
    questionsForDoctor: [
      "Xulosamda qaysi laboratoriya tekshiruvi nazarda tutilgan va uni qachon, qanday rejalashtirish kerak?",
      "Ushbu laboratoriya tekshiruvi uchun tayyorgarlik kerakmi?",
      "Keyingi qabulim qayerda bo‘ladi?",
    ],
    uncertainties: [
      {
        explanation: "Xulosada laboratoriya tekshiruvi tilga olingan, ammo sanasi va rejalashtirish tartibi ko‘rsatilmagan. Rejalashtirishdan oldin klinikadan aniqlashtiring.",
        sourceQuote: laboratoryQuote,
      },
    ],
    quiz: [
      {
        question: "Hujjatda keyingi qabul qachonga belgilangan?",
        options: ["2026-yil 12-oktabr, soat 10:30", "2026-yil 15-oktabr, soat 10:30", "2026-yil 20-oktabr, soat 10:30"],
        correctAnswerIndex: 1,
        explanation: "Asl xulosada 2026-yil 15-oktabr, soat 10:30 deb yozilgan.",
        sourceQuote: appointmentQuote,
      },
      {
        question: "Xulosada keyingi qabulga nima olib kelish so‘ralgan?",
        options: ["Hozirgi dorilaringiz ro‘yxati", "Yangi retsept", "Laboratoriya tekshiruvi natijalari"],
        correctAnswerIndex: 0,
        explanation: "Hujjatda hozir qabul qilayotgan dorilaringiz ro‘yxatini olib kelish so‘ralgan.",
        sourceQuote: preparationQuote,
      },
      {
        question: "Laboratoriya tekshiruvi haqida nimani aniqlashtirish kerak?",
        options: ["Keyingi qabul sanasini", "Keyingi qabulga nima olib borishni", "Tekshiruv sanasi va rejalashtirish tartibini"],
        correctAnswerIndex: 2,
        explanation: "Tekshiruv sanasi va rejalashtirish tartibi ko‘rsatilmagan. Xulosada klinikadan aniqlashtirish so‘ralgan.",
        sourceQuote: laboratoryQuote,
      },
    ],
  },
  ru: {
    summary: "Этот вымышленный документ относится к визиту 8 октября 2026 года. Повторный приём назначен на 15 октября в 10:30. Возьмите список лекарств, которые вы сейчас принимаете. В документе упомянуто лабораторное исследование, но не указано, когда и как его организовать, поэтому предлагается уточнить это в клинике. Новых инструкций по приёму лекарств нет.",
    actions: [
      {
        id: "follow-up",
        title: "Ваш повторный приём",
        description: "В документе повторный приём назначен на 15 октября 2026 года в 10:30.",
        category: "appointment",
        when: "15 октября 2026 г. · 10:30",
        sourceQuote: appointmentQuote,
        needsConfirmation: false,
      },
      {
        id: "medication-list",
        title: "Возьмите список ваших лекарств",
        description: "Принесите на повторный приём список лекарств, которые вы сейчас принимаете.",
        category: "preparation",
        when: "На повторном приёме",
        sourceQuote: preparationQuote,
        needsConfirmation: false,
      },
      {
        id: "clarify-test",
        title: "Уточните в клинике детали исследования",
        description: "Дата и порядок записи на исследование не указаны. В документе предлагается уточнить эти сведения в клинике.",
        category: "administrative",
        when: null,
        sourceQuote: laboratoryQuote,
        needsConfirmation: true,
      },
    ],
    terms: [
      {
        term: "follow-up appointment",
        explanation: "Следующий приём после предыдущего визита. В этом документе указаны дата и время: 15 октября 2026 года, 10:30.",
        sourceQuote: appointmentQuote,
      },
      {
        term: "laboratory test",
        explanation: "Исследование образца, например крови, в лаборатории. В документе объяснён термин, но не указано, какое исследование запланировано и как на него записаться.",
        sourceQuote: laboratoryDefinitionQuote,
      },
    ],
    questionsForDoctor: [
      "Какое лабораторное исследование упомянуто в моём документе, когда и как на него записаться?",
      "Нужна ли подготовка к этому лабораторному исследованию?",
      "Где состоится мой повторный приём?",
    ],
    uncertainties: [
      {
        explanation: "В документе упомянуто лабораторное исследование, но не указаны его дата и порядок записи. Уточните это в клинике перед планированием.",
        sourceQuote: laboratoryQuote,
      },
    ],
    quiz: [
      {
        question: "Когда назначен повторный приём в документе?",
        options: ["12 октября 2026 года в 10:30", "15 октября 2026 года в 10:30", "20 октября 2026 года в 10:30"],
        correctAnswerIndex: 1,
        explanation: "В исходном документе указано: 15 октября 2026 года в 10:30.",
        sourceQuote: appointmentQuote,
      },
      {
        question: "Что документ просит принести на повторный приём?",
        options: ["Список лекарств, которые вы сейчас принимаете", "Новый рецепт", "Результаты лабораторного исследования"],
        correctAnswerIndex: 0,
        explanation: "В документе просят принести список лекарств, которые вы сейчас принимаете.",
        sourceQuote: preparationQuote,
      },
      {
        question: "Что нужно уточнить о лабораторном исследовании?",
        options: ["Дату повторного приёма", "Что принести на повторный приём", "Дату исследования и порядок записи"],
        correctAnswerIndex: 2,
        explanation: "Дата исследования и порядок записи не указаны. В документе предлагают уточнить их в клинике.",
        sourceQuote: laboratoryQuote,
      },
    ],
  },
};
