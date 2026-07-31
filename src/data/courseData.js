/* ============================================================
   courseData.js — Datos completos del curso de 30 días
   Días 1-10:  contenido completo (Fase 6)
   Días 11-20: contenido completo (Fase 7)
   Días 21-30: contenido completo (Fase 8)
   ============================================================ */

import { days1to10  } from './days1to10.js'
import { days11to20 } from './days11to20.js'
import { days21to30 } from './days21to30.js'

export const courseData = [...days1to10, ...days11to20, ...days21to30]
