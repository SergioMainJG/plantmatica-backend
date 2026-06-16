import { TypeNotSatisfiedError } from "~/config/custom-errors/type-not-satisfied.error";

export const MEXICO_STATES = {
  outside: "Resido fuera del pais",
  aguascalientes: "Aguascalientes",
  bajaCalifornia: "Baja California",
  bajaCaliforniaSur: "Baja California Sur",
  campeche: "Campeche",
  chiapas: "Chiapas",
  chihuahua: "Chihuahua",
  coahuila: "Coahuila de Zaragoza",
  colima: "Colima",
  cdmx: "CDMX",
  durango: "Durango",
  guanajuato: "Guanajuato",
  guerrero: "Guerrero",
  hidalgo: "Hidalgo",
  jalisco: "Jalisco",
  estado: "Estado de Mexico",
  michoacan: "Michoacan de Ocampo",
  morelos: "Morelos",
  nayarit: "Nayarit",
  nuevo: "Nuevo Leon",
  oaxaca: "Oaxaca",
  puebla: "Puebla",
  queretaro: "Queretaro de Arteaga",
  quintana: "Quintana Roo",
  sanLuisPotosi: "San Luis Potosi",
  sinaloa: "Sinaloa",
  sonora: "Sonora",
  tabasco: "Tabasco",
  tamaulipas: "Tamaulipas",
  tlaxcala: "Tlaxcala",
  veracruz: "Veracruz de Ignacio de la Llave",
  yucatan: "Yucatan",
  zacatecas: "Zacatecas",
} as const;

export type UserResidenceState =
  & string
  & (typeof MEXICO_STATES)[keyof typeof MEXICO_STATES]
  & { readonly __brand: unique symbol };

export const createUserResidenceState = (
  residenceState: unknown,
): UserResidenceState => {
  if( typeof residenceState !== 'string' )
    throw new TypeNotSatisfiedError(`gender must be a string`);
  if (!Object.values(MEXICO_STATES).some((state) => state === residenceState)) {
    throw new TypeNotSatisfiedError(
      `residenceState is not a valid Mexico's state`,
    );
  }
  return residenceState as UserResidenceState;
};
