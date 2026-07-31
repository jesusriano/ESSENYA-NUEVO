import { MassageService, AddOn, CoverageZone, Review, FAQItem } from '../types';
import coupleMassageImg from '../assets/images/couple_massage_spa_1785442759347.jpg';
import lymphaticMassageImg from '../assets/images/lymphatic_drainage_massage_1785443688048.jpg';
import prenatalMassageImg from '../assets/images/prenatal_massage_mom_1785443757882.jpg';
import reflexologyCraniofacialImg from '../assets/images/reflexology_craniofacial_fixed_1785443961160.jpg';
import sportsMassageImg from '../assets/images/sports_massage_athletics_1785444051684.jpg';

export const WHATSAPP_NUMBER = '5215511318971'; // Official WhatsApp hotline
export const WHATSAPP_DISPLAY = '+52 1 55 1131 8971';

export const ADD_ONS: AddOn[] = [
  {
    id: 'addon-exfoliacion',
    name: 'Exfoliación Orgánica Espalda o Pies',
    description: 'Elimina células muertas con sales marinas y aceites esenciales de lavanda y almendras.',
    price: 350,
  },
  {
    id: 'addon-antifaz',
    name: 'Antifaz Térmico de Semillas & Lavanda',
    description: 'Compresa tibia aromática sobre los ojos para aliviar fatiga ocular y migraña.',
    price: 250,
  },
  {
    id: 'addon-facial',
    name: 'Facial Hidratante Exprés con Ácido Hialurónico',
    description: 'Limpieza profunda con suero iluminador y masaje facial con rodillo de cuarzo rosa.',
    price: 550,
  },
  {
    id: 'addon-piedras-extra',
    name: 'Piedras Volcánicas Calientes Focalizadas',
    description: 'Aplicación de piedras basálticas de origen volcánico en zona de mayor tensión.',
    price: 400,
  },
  {
    id: 'addon-aromaterapia-oro',
    name: 'Infusión de Aromaterapia Orgánica Esencial',
    description: 'Selección de aceites botánicos de grado terapéutico (Sándalo, Bergamota, Ylang Ylang).',
    price: 200,
  }
];

export const MASSAGE_SERVICES: MassageService[] = [
  {
    id: 'masaje-relajante-sueco',
    title: 'Masaje Relajante Sueco',
    shortDescription: 'Movimientos suaves y envolventes para liberar el estrés acumulado, activar la circulación y armonizar cuerpo y mente.',
    fullDescription: 'El masaje relajante sueco de ESSENYA combina fricciones largas, amasamientos gentiles y presiones rítmicas con aceites botánicos tibios. Ideal para desconectar del ritmo acelerado de la ciudad, aliviar el insomnio y alcanzar un estado de serenidad absoluta en la calma de tu espacio.',
    category: 'relajante',
    tag: 'Más Solicitado',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
    prices: [
      { durationMinutes: 60, priceMXN: 0 },
      { durationMinutes: 90, priceMXN: 0 },
      { durationMinutes: 120, priceMXN: 0 },
    ],
    benefits: [
      'Reduce drásticamente los niveles de cortisol y estrés',
      'Mejora la calidad del sueño y combate el insomnio',
      'Activa la circulación sanguínea y linfática',
      'Relaja el sistema nervioso central'
    ],
    recommendedFor: [
      'Personas con carga laboral intensa',
      'Primerizos en masajes a domicilio',
      'Quienes buscan un espacio personal de desconexión'
    ],
    intensity: 2,
    includedOils: ['Aceite de Almendras Dulces', 'Esencia Botánica de Lavanda Orgánica'],
    durationOptions: [60, 90, 120]
  },
  {
    id: 'masaje-descontracturante-profundo',
    title: 'Masaje Descontracturante & Deep Tissue',
    shortDescription: 'Técnica de presión firme en capas musculares profundas para disolver nudos, contracturas severas y fatiga muscular en espalda y hombros.',
    fullDescription: 'Diseñado específicamente para tratar la tensión crónica en espalda, cuello, hombros y zona lumbar. Utiliza nudillos, antebrazos y digitopresión enfocada para deshacer los nudos musculares acumulados por malas posturas o estrés elevado.',
    category: 'terapeutico',
    tag: 'Recomendado Terapéutico',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=1200&q=80',
    prices: [
      { durationMinutes: 60, priceMXN: 0 },
      { durationMinutes: 90, priceMXN: 0 },
      { durationMinutes: 120, priceMXN: 0 },
    ],
    benefits: [
      'Elimina contracturas musculares dolorosas',
      'Restablece la movilidad articular y postura correcta',
      'Libera toxinas atrapadas en las fibras musculares',
      'Alivia dolores de cuello, escápula y zona baja de la espalda'
    ],
    recommendedFor: [
      'Personas que pasan muchas horas frente a la computadora',
      'Deportistas o personas con dolor muscular persistente',
      'Quienes prefieren presiones moderadas a muy firmes'
    ],
    intensity: 4,
    includedOils: ['Bálsamo Térmico de Árnica', 'Aceite Esencial de Eucalipto y Menta'],
    durationOptions: [60, 90, 120]
  },
  {
    id: 'masaje-piedras-calientes',
    title: 'Masaje Ritual con Piedras Volcánicas',
    shortDescription: 'Terapia milenaria con piedras de basalto volcánico tibias aplicadas estratégicamente para relajar la musculatura y aliviar tensiones profundas.',
    fullDescription: 'Las piedras volcánicas pulidas retienen el calor y se deslizan suavemente a lo largo de los meridianos energéticos del cuerpo. El calor radiante dilata los vasos sanguíneos y ablanda los músculos tensos proporcionando un alivio cálido y reconfortante.',
    category: 'especial',
    tag: 'Ritual Volcánico',
    image: 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&w=1200&q=80',
    prices: [
      { durationMinutes: 60, priceMXN: 0 },
      { durationMinutes: 90, priceMXN: 0 },
      { durationMinutes: 120, priceMXN: 0 },
    ],
    benefits: [
      'Penetración profunda de calor que desinflama los tejidos',
      'Equilibrio de los centros de energía del cuerpo',
      'Sensación de ligereza e ingravidez extrema',
      'Alivio de rigidez articular y frialdad corporal'
    ],
    recommendedFor: [
      'Personas con alta tensión acumulada o sensibilidad al frío',
      'Momentos de gran cansancio mental y físico',
      'Regalos especiales y fechas conmemorativas'
    ],
    intensity: 3,
    includedOils: ['Aceite Tibio de Sésamo y Romero', 'Infusión de Aceites Calientes de Canela y Naranja'],
    durationOptions: [60, 90, 120]
  },
  {
    id: 'masaje-en-pareja',
    title: 'Masaje en Pareja',
    shortDescription: 'Dos terapeutas profesionales simultáneas para disfrutar juntos de una sesión de masaje personalizada en la tranquilidad de su espacio.',
    fullDescription: 'Crea un ambiente de paz y reconexión en tu residencia o espacio privado. Incluye dos camillas de masaje profesionales instaladas lado a lado, música coordinada, aromaterapia botánica y atención totalmente personalizada para cada integrante de la pareja.',
    category: 'parejas',
    tag: 'Sesión en Pareja',
    image: coupleMassageImg,
    prices: [
      { durationMinutes: 60, priceMXN: 0 },
      { durationMinutes: 90, priceMXN: 0 },
      { durationMinutes: 120, priceMXN: 0 },
    ],
    benefits: [
      'Dos terapeutas certificadas atendiendo simultáneamente',
      'Ambiente multisensorial coordinado con música y aromaterapia',
      'Experiencia idónea para aniversarios, descansos de fin de semana o fechas especiales',
      'Conexión y descanso compartido sin traslados ni tráfico'
    ],
    recommendedFor: [
      'Parejas que buscan compartir un momento de descanso',
      'Sorpresas de aniversario o cumpleaños',
      'Fin de semana de salud y bienestar integral'
    ],
    intensity: 3,
    includedOils: ['Esencia de Sándalo', 'Ylang Ylang Vainilla', 'Aromaterapia Dúo Personalizada'],
    durationOptions: [60, 90, 120]
  },
  {
    id: 'masaje-drenaje-linfatico',
    title: 'Drenaje Linfático Manual',
    shortDescription: 'Técnica suave de bombeo rítmico que estimula la circulación de la linfa, favoreciendo la reducción de líquidos y pesadez en piernas y cuerpo.',
    fullDescription: 'Especialmente indicado para personas con piernas cansadas, retención de líquidos, edemas o recomendaciones específicas de bienestar. Los movimientos rítmicos y muy suaves favorecen la eliminación natural de líquidos y la desinflamación corporal.',
    category: 'terapeutico',
    tag: 'Desinflamante',
    image: lymphaticMassageImg,
    prices: [
      { durationMinutes: 60, priceMXN: 0 },
      { durationMinutes: 90, priceMXN: 0 },
      { durationMinutes: 120, priceMXN: 0 },
    ],
    benefits: [
      'Desinflamación de piernas, tobillos y zonas con retención',
      'Estímulo suave al sistema circulatorio',
      'Sensación inmediata de ligereza y descanso corporal',
      'Favorece la eliminación de toxinas'
    ],
    recommendedFor: [
      'Personas con problemas de circulación y pesadez en piernas',
      'Quienes sufren de hinchazón por sedentarismo o viajes largos',
      'Tratamiento suave sin presión fuerte'
    ],
    intensity: 1,
    includedOils: ['Gel Activo de Caléndula y Manzanilla', 'Aceite Neutro de Grado Terapéutico'],
    durationOptions: [60, 90, 120]
  },
  {
    id: 'masaje-prenatal-mama',
    title: 'Masaje Prenatal para Mamás',
    shortDescription: 'Atención adaptada y cuidadosa para embarazadas (a partir del 2º trimestre) con cojines de soporte ergonómicos para aliviar carga en zona lumbar y piernas.',
    fullDescription: 'Técnica delicada diseñada específicamente para futuras mamás a partir de la semana 13 de gestación. Ayuda a liberar la tensión en espalda baja, caderas, piernas y pies hinchados, promoviendo un espacio de calma segura para la madre y su bebé.',
    category: 'prenatal',
    tag: 'Futuras Mamás',
    image: prenatalMassageImg,
    prices: [
      { durationMinutes: 60, priceMXN: 0 },
      { durationMinutes: 90, priceMXN: 0 },
      { durationMinutes: 120, priceMXN: 0 },
    ],
    benefits: [
      'Alivio seguro del cansancio lumbar y molestia gestacional',
      'Mejora la circulación y disminuye la hinchazón de pies',
      'Posturas adaptadas y seguras de lado con apoyo de cojines',
      'Sensación de contención y paz para la mamá'
    ],
    recommendedFor: [
      'Embarazadas a partir de la semana 13 de gestación',
      'Regalo especial para futuras mamás',
      'Quienes sienten pesadez en la espalda baja por la gestación'
    ],
    intensity: 2,
    includedOils: ['Aceite Orgánico Hipoalergénico de Rosa Mosqueta y Almendras sin Fragancias Sintéticas'],
    durationOptions: [60, 90, 120]
  },
  {
    id: 'masaje-deportivo-recuperacion',
    title: 'Masaje Deportivo & Descarga Muscular',
    shortDescription: 'Estiramientos asistidos, movilización miofascial y percusiones rítmicas para optimizar la recuperación física y liberar fatiga atlética.',
    fullDescription: 'Ideal para corredores, ciclistas, atletas o personas con alta exigencia física. Combina movilizaciones articulares asistidas y presión enfocada en grupos musculares para prevenir rigidez y restaurar la flexibilidad.',
    category: 'terapeutico',
    tag: 'Recuperación Física',
    image: sportsMassageImg,
    prices: [
      { durationMinutes: 60, priceMXN: 0 },
      { durationMinutes: 90, priceMXN: 0 },
      { durationMinutes: 120, priceMXN: 0 },
    ],
    benefits: [
      'Acelera la recuperación tras entrenamientos intensos',
      'Aumenta la flexibilidad y rango de movimiento',
      'Previene la rigidez muscular acumulada',
      'Prepara la musculatura para nuevos retos físicos'
    ],
    recommendedFor: [
      'Corredores, practicantes de gimnasio, ciclismo o deportes de alto impacto',
      'Personas con fatiga muscular constante por ejercicio',
      'Recuperación post-competencia'
    ],
    intensity: 5,
    includedOils: ['Aceite Terapéutico de Árnica, Romero y Mentol'],
    durationOptions: [60, 90, 120]
  },
  {
    id: 'masaje-reflexologia-holistica',
    title: 'Reflexología Podal & Craneofacial',
    shortDescription: 'Estimulación en puntos reflejos de pies, manos y rostro para liberar la sobrecarga mental, tensión de mandíbula y fatiga general.',
    fullDescription: 'Técnica enfocada en puntos de presión de las terminales nerviosas en la planta de los pies, manos y área craneofacial. Ayuda a calmar la mente agitada, aliviar cefaleas por tensión y proporcionar un descanso reparador.',
    category: 'especial',
    tag: 'Cuidado Integral',
    image: reflexologyCraniofacialImg,
    prices: [
      { durationMinutes: 60, priceMXN: 0 },
      { durationMinutes: 90, priceMXN: 0 },
      { durationMinutes: 120, priceMXN: 0 },
    ],
    benefits: [
      'Alivio directo de pesadez en pies y cansancio mental',
      'Calma el sistema nervioso y promueve un sueño profundo',
      'Liberación de tensión en sienes y rostro',
      'Terapia altamente relajante e interactiva'
    ],
    recommendedFor: [
      'Personas que permanecen mucho tiempo de pie o caminando',
      'Quienes sufren agotamiento mental, migraña o estrés de oficina',
      'Adultos que buscan una técnica suave y focalizada'
    ],
    intensity: 2,
    includedOils: ['Esencia de Menta Silvestre y Lavanda'],
    durationOptions: [60, 90, 120]
  }
];

export const COVERAGE_ZONES: CoverageZone[] = [
  {
    id: 'zone-polanco',
    name: 'Polanco & Anzures',
    areaGroup: 'Poniente',
    zipCodes: ['11550', '11560', '11570', '11580', '11590', '11520'],
    estimatedArrival: '30 - 45 min',
    deliveryFee: 0,
    popularNeighborhoods: ['Polanco I, II, III, IV, V Sección', 'Campos Elíseos', 'Anzures', 'Bosque de Chapultepec']
  },
  {
    id: 'zone-lomas',
    name: 'Lomas de Chapultepec & Bosques',
    areaGroup: 'Poniente',
    zipCodes: ['11000', '11700', '11010', '05120'],
    estimatedArrival: '35 - 50 min',
    deliveryFee: 0,
    popularNeighborhoods: ['Lomas de Chapultepec', 'Bosques de las Lomas', 'Lomas Altas', 'Monte Líbano', 'Virreyes']
  },
  {
    id: 'zone-condesa-roma',
    name: 'Condesa, Roma & Juárez',
    areaGroup: 'Centro-Sur',
    zipCodes: ['06100', '06140', '06700', '06600'],
    estimatedArrival: '30 - 45 min',
    deliveryFee: 0,
    popularNeighborhoods: ['Roma Norte', 'Roma Sur', 'Hipódromo Condesa', 'Condesa', 'Juárez', 'Cuauhtémoc']
  },
  {
    id: 'zone-santa-fe',
    name: 'Santa Fe & Bosques de las Lomas',
    areaGroup: 'Oeste',
    zipCodes: ['01210', '01219', '05300', '05348'],
    estimatedArrival: '40 - 60 min',
    deliveryFee: 0,
    popularNeighborhoods: ['Santa Fe Peña Blanca', 'Paseo de las Palmas', 'Bosques de las Lomas', 'Contadero']
  },
  {
    id: 'zone-interlomas',
    name: 'Interlomas, Tecamachalco & La Dehesa',
    areaGroup: 'Interlomas & Edomex',
    zipCodes: ['52760', '52787', '53950'],
    estimatedArrival: '40 - 60 min',
    deliveryFee: 0,
    popularNeighborhoods: ['Interlomas', 'Lomas de Tecamachalco', 'Bosque de las Palmas', 'La Enramada', 'Jesús del Monte']
  },
  {
    id: 'zone-coyoacan-san-angel',
    name: 'San Ángel, Coyoacán & Del Valle',
    areaGroup: 'Centro-Sur',
    zipCodes: ['01000', '04000', '03100', '03200'],
    estimatedArrival: '35 - 50 min',
    deliveryFee: 0,
    popularNeighborhoods: ['San Ángel', 'San Ángel Inn', 'Coyoacán Centro', 'Del Valle Norte/Sur', 'Florida', 'Nápoles']
  },
  {
    id: 'zone-pedregal',
    name: 'Jardines del Pedregal & Fuentes del Pedregal',
    areaGroup: 'Centro-Sur',
    zipCodes: ['01900', '14140', '01420'],
    estimatedArrival: '40 - 55 min',
    deliveryFee: 0,
    popularNeighborhoods: ['Jardines del Pedregal', 'Fuentes del Pedregal', 'Rancho San Francisco', 'San Jerónimo']
  }
];

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Mariana S. de Alva',
    neighborhood: 'Lomas de Chapultepec',
    rating: 5,
    date: 'Hace 2 días',
    comment: 'Llegaron puntualísimas con su camilla super acolchada, sábanas impecables y difusor con aceites orgánicos. La terapeuta identificó mis nudos de la espalda en minutos. ¡Un servicio de spa de alto nivel sin salir de tu espacio!',
    serviceUsed: 'Masaje Descontracturante 90 min',
    verified: true,
    avatarImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-2',
    author: 'Roberto C. & Valentina P.',
    neighborhood: 'Polanco IV Sección',
    rating: 5,
    date: 'Hace 1 semana',
    comment: 'Reservamos la sesión en pareja para nuestro aniversario. El nivel de detalle es increíble: música suave, aromas espectaculares y una atención sumamente respetuosa y profesional. Repetiremos cada mes.',
    serviceUsed: 'Masaje en Pareja 120 min',
    verified: true,
    avatarImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-3',
    author: 'Dra. Elena H.',
    neighborhood: 'Santa Fe',
    rating: 5,
    date: 'Hace 2 semanas',
    comment: 'Sufro de migraña tensional grave por las largas jornadas de cirugía. La terapeuta de ESSENYA aplicó digitopresión precisa y el antifaz térmico. Salí flotando. Totalmente recomendable.',
    serviceUsed: 'Masaje Terapéutico + Antifaz Térmico',
    verified: true,
    avatarImage: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80'
  },
  {
    id: 'rev-4',
    author: 'Santiago M.',
    neighborhood: 'Roma Norte',
    rating: 5,
    date: 'Hace 3 semanas',
    comment: 'Servicio ultra discreto, seguro y fácil de pedir por WhatsApp. Traen absolutamente todo, incluso la música. Tú solo pones el espacio de 2x2 metros.',
    serviceUsed: 'Masaje Deportivo 90 min',
    verified: true,
    avatarImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
  }
];

export const FAQS: FAQItem[] = [
  {
    id: 'faq-1',
    category: 'Preparación',
    question: '¿Qué necesito tener o preparar en mi espacio antes de que llegue la terapeuta?',
    answer: 'Casi nada. Nuestras terapeutas llevan absolutamente todo el equipo profesional necesario: camilla portátil de masaje, toallas y sábanas esterilizadas, aceites neutros y de olor, bocina bluetooth con música spa y aromatización. Solamente necesitas un espacio limpio de aproximadamente 2x2 metros (en tu habitación, espacio libre o terraza) y una temperatura agradable.'
  },
  {
    id: 'faq-2',
    category: 'Seguridad',
    question: '¿Cómo garantizan la seguridad y el profesionalismo de las terapeutas?',
    answer: 'La seguridad y confianza son nuestro pilar principal. Todas nuestras terapeutas pasan por un riguroso proceso de selección de 5 etapas: verificación estricta de identidad y antecedentes penales, exámenes psicométricos, certificaciones oficiales en cosmetología o fisioterapia, pruebas técnicas prácticas y protocolos continuos de atención al cliente de alto nivel.'
  },
  {
    id: 'faq-3',
    category: 'Reserva',
    question: '¿Con cuánto tiempo de anticipación debo agendar mi servicio?',
    answer: 'Recomendamos agendar con 2 a 4 horas de anticipación para asegurar tu horario preferido. Sin embargo, también contamos con servicio exprés sujeto a disponibilidad en zonas como Polanco, Lomas, Roma, Condesa y Santa Fe. Puedes solicitar tu cita desde las 8:00 AM hasta las 10:00 PM los 7 días de la semana.'
  },
  {
    id: 'faq-4',
    category: 'Pagos y Cancelaciones',
    question: '¿Qué métodos de pago aceptan y cuál es la política de cancelación?',
    answer: 'Aceptamos transferencias SPEI instantáneas, pagos seguros en línea con tarjeta de crédito/débito (Visa, Mastercard, AMEX) y cobro con terminal inalámbrica al finalizar tu sesión. Puedes cancelar o reprogramar tu cita sin penalización con al menos 3 horas de anticipación.'
  },
  {
    id: 'faq-5',
    category: 'Reserva',
    question: '¿Puedo elegir la intensidad o preferencia de presión de mi masaje?',
    answer: '¡Por supuesto! Al iniciar tu sesión, la terapeuta realizará una breve consulta verbal para conocer tu nivel de presión deseado (suave, medio, firme o descontracturante), áreas de mayor molestia (cuello, zona lumbar, piernas) y cualquier condición de salud especial.'
  }
];

export const GUARANTEES = [
  {
    title: 'Terapeutas Verificadas & Certificadas',
    description: 'Fisioterapeutas y cosmiatras profesionales con estrictos filtros de seguridad e identificación oficial.',
    icon: 'ShieldCheck'
  },
  {
    title: 'Equipo de Lujo',
    description: 'Camilla portátil de masaje, toallas y sábanas esterilizadas, y aceites de primera calidad.',
    icon: 'Sparkles'
  },
  {
    title: 'Puntualidad & Llegada Garantizada',
    description: 'Monitoreo de ruta en tiempo real para estar en tu puerta a la hora exacta acordada.',
    icon: 'Clock'
  },
  {
    title: 'Atención Personalizada en CDMX',
    description: 'Cobertura directa en las mejores zonas residenciales de la Ciudad de México y área metropolitana.',
    icon: 'MapPin'
  }
];
