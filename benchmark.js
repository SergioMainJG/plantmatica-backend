// benchmark.js
import http from 'k6/http';
import { check, sleep } from 'k6';

// Configuración del Test Suite
export const options = {
  // 1. CONCURRENCIA, RENDIMIENTO Y ESTRÉS
  stages: [
    { duration: '30s', target: 50 },  // Ramp-up: Sube a 50 usuarios concurrentes
    { duration: '1m',  target: 50 },  // Rendimiento: Mantiene 50 usuarios para medir latencia estable
    { duration: '30s', target: 300 }, // Estrés: Pico masivo de 300 usuarios concurrentes
    { duration: '30s', target: 0 },   // Ramp-down: Bajada a 0 para ver cómo se recupera el servidor
  ],
  
  // Criterios de éxito (Si no se cumplen, el test falla)
  thresholds: {
    http_req_duration: ['p(95)<500'], // El 95% de las peticiones deben tardar menos de 500ms
    http_req_failed: ['rate<0.01'],   // La tasa de error (500s, timeouts) debe ser menor al 1%
  },
};

// Variables de entorno para dinamismo
const BASE_URL = __ENV.BASE_URL || 'http://localhost:8080/api';
const TOKEN = __ENV.TOKEN || '';

export default function () {
  // --- PRUEBA 1: Ruta Pública (Ej. Fichas) ---
  const resPublica = http.get(`${BASE_URL}/fichas`);
  
  check(resPublica, {
    'GET fichas status es 200': (r) => r.status === 200,
    'GET fichas responde rápido': (r) => r.timings.duration < 200,
  });

  // --- PRUEBA 2: Ruta Protegida (Requiere JWT) ---
  if (TOKEN) {
    const params = {
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
    };
    
    // Cambia esto por un endpoint real de tu API que requiera auth
    const resProtegida = http.get(`${BASE_URL}/user/perfil`, params);
    
    check(resProtegida, {
      'GET perfil auth exitosa': (r) => r.status === 200,
    });
  }

  // Pausa simulando el tiempo de lectura de un usuario real
  sleep(1); 
}