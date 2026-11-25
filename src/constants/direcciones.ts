// Alcaldías con cobertura en el sitio, con la zona de precio/llegada que les corresponde
// y sus colonias. Se usan en el paso de dirección de la reserva.
export interface AlcaldiaCobertura {
  alcaldia: string;
  zoneId: string;
  colonias: string[];
}

export const ALCALDIAS_COBERTURA: AlcaldiaCobertura[] = [
  { alcaldia: 'Miguel Hidalgo', zoneId: 'zone-polanco', colonias: ['Polanco I Sección', 'Polanco II Sección', 'Polanco III Sección', 'Polanco IV Sección', 'Polanco V Sección', 'Lomas de Chapultepec', 'Anzures', 'Granada', 'Ampliación Granada', 'Irrigación', 'San Miguel Chapultepec', 'Pensil', 'Bosque de Chapultepec', 'Observatorio', 'Tacubaya', 'Lomas Virreyes', 'Los Morales', 'Chapultepec Morales', 'Escandón', 'Tacuba', 'Torre Blanca'] },
  { alcaldia: 'Cuauhtémoc', zoneId: 'zone-condesa-roma', colonias: ['Roma Norte', 'Roma Sur', 'Condesa', 'Hipódromo', 'Juárez', 'Centro Histórico', 'San Rafael', 'Santa María la Ribera', 'Doctores', 'Buenavista', 'Guerrero', 'Tabacalera', 'Cuauhtémoc'] },
  { alcaldia: 'Benito Juárez', zoneId: 'zone-condesa-roma', colonias: ['Del Valle Centro', 'Del Valle Norte', 'Narvarte', 'Nápoles', 'Insurgentes Mixcoac', 'Xoco', 'Santa Cruz Atoyac', 'Portales', 'Acacias', 'Ciudad de los Deportes', 'Actipan', 'Moderna'] },
  { alcaldia: 'Cuajimalpa de Morelos', zoneId: 'zone-santa-fe', colonias: ['Santa Fe', 'Contadero', 'Bosques de las Lomas', 'Cuajimalpa Centro', 'Lomas del Chamizal', 'Vista Hermosa', 'El Yaqui', 'Lomas de Santa Fe', 'Huizachera'] },
  { alcaldia: 'Álvaro Obregón', zoneId: 'zone-coyoacan-san-angel', colonias: ['San Ángel', 'Jardines del Pedregal', 'Las Águilas', 'San Jerónimo Lídice', 'Guadalupe Inn', 'Florida', 'Chimalistac', 'Altavista', 'Lomas de Becerra'] },
  { alcaldia: 'Coyoacán', zoneId: 'zone-coyoacan-san-angel', colonias: ['Coyoacán Centro', 'Del Carmen', 'Copilco Universidad', 'Pedregal de San Ángel', 'Romero de Terreros', 'Villa Coyoacán', 'Santa Úrsula', 'Viveros de Coyoacán', 'Campestre Churubusco'] },
  { alcaldia: 'Tlalpan', zoneId: 'zone-pedregal', colonias: ['Pedregal de San Nicolás', 'Tlalpan Centro', 'Fuentes del Pedregal', 'Parques del Pedregal', 'Tepepan', 'Hacienda de San Juan', 'Jardines del Ajusco', 'Villa Olímpica'] },
  { alcaldia: 'Huixquilucan', zoneId: 'zone-interlomas', colonias: ['Interlomas', 'Bosque Real', 'Jesús del Monte', 'Tecamachalco', 'La Herradura', 'Paseos de la Herradura', 'Lomas Anáhuac', 'Club de Golf Hacienda', 'Lomas de Bezares', 'Vista Hermosa'] },
  { alcaldia: 'Atizapán de Zaragoza', zoneId: 'zone-atizapan', colonias: ['Zona Esmeralda', 'Valle Dorado', 'Lomas de Atizapán', 'Las Arboledas', 'Lomas Verdes', 'Club de Golf Bellavista', 'Condado de Sayavedra', 'Sayavedra', 'San Mateo Atizapán', 'Hacienda Bellavista', 'Jardines de Atizapán'] },
];

export const coloniasDeAlcaldia = (alcaldia: string): string[] =>
  ALCALDIAS_COBERTURA.find(a => a.alcaldia === alcaldia)?.colonias ?? [];

export const zoneIdDeAlcaldia = (alcaldia: string): string =>
  ALCALDIAS_COBERTURA.find(a => a.alcaldia === alcaldia)?.zoneId ?? ALCALDIAS_COBERTURA[0].zoneId;

// Última dirección usada en este navegador, para no volver a escribirla.
export interface DireccionWeb { alcaldia: string; colonia: string; calle: string }
const CLAVE_DIRECCION_WEB = 'essenya_direccion_web';

export const leerDireccionWeb = (): DireccionWeb => {
  try {
    const raw = localStorage.getItem(CLAVE_DIRECCION_WEB);
    if (raw) {
      const d = JSON.parse(raw);
      return { alcaldia: String(d.alcaldia || ''), colonia: String(d.colonia || ''), calle: String(d.calle || '') };
    }
  } catch {
    // Sin almacenamiento disponible: se empieza en blanco.
  }
  return { alcaldia: '', colonia: '', calle: '' };
};

export const guardarDireccionWeb = (d: DireccionWeb) => {
  try {
    localStorage.setItem(CLAVE_DIRECCION_WEB, JSON.stringify(d));
  } catch {
    // Si el navegador bloquea el almacenamiento, simplemente no se recuerda.
  }
};
