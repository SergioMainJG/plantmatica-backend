// benchmarks/full-benchmark.js
const autocannon = require('autocannon');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

// Configuración
const BASE_URL = process.env.BENCH_URL || 'http://localhost:8080';
const OUTPUT_FILE = path.join(__dirname, 'results.json');

// Token JWT para endpoints protegidos (obtenerlo vía login antes de correr benchmarks)
let AUTH_TOKEN = process.env.BENCH_TOKEN || '';

async function obtenerToken() {
    console.log('🔑 Obteniendo token de autenticación...');
    try {
        const result = await autocannon({
            url: BASE_URL,
            connections: 1,
            duration: 1,
            requests: [{
                method: 'POST',
                path: '/login',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    correo: 'test@example.com',
                    password: 'password123'
                })
            }]
        });

        // Nota: autocannon no devuelve el body, necesitas hacer fetch manual para obtener el token
        // Esto es solo un placeholder - en producción usa axios/fetch para obtener el token real
        console.log('⚠️  Token no obtenido automáticamente. Usa BENCH_TOKEN env var o modifica el script.');
        return '';
    } catch (err) {
        console.warn('No se pudo obtener token:', err.message);
        return '';
    }
}

async function benchmarkEndpoint(name, config) {
    console.log(`\n🚀 Iniciando test: ${name}`);
    const startTime = performance.now();

    const result = await autocannon({
        url: BASE_URL,
        ...config
    });

    const duration = (performance.now() - startTime) / 1000;

    const summary = {
        name,
        duration: `${duration.toFixed(2)}s`,
        rps: Math.round(result.requests.average),
        rpsMin: Math.round(result.requests.min),
        rpsMax: Math.round(result.requests.max),
        latencyAvg: Math.round(result.latency.average),
        latencyP50: Math.round(result.latency.p50),
        latencyP75: Math.round(result.latency.p75),
        latencyP99: Math.round(result.latency.p99),
        latencyMax: Math.round(result.latency.max),
        errors: result.errors,
        timeouts: result.timeouts,
        throughputKB: Math.round(result.throughput.average / 1024),
        status2xx: result['2xx'],
        status3xx: result['3xx'],
        status4xx: result['4xx'],
        status5xx: result['5xx'],
        totalRequests: result.requests.sent
    };

    // Print inline results
    console.log(`  ✅ RPS: ${summary.rps} | Latency avg: ${summary.latencyAvg}ms | p99: ${summary.latencyP99}ms | Errors: ${summary.errors}`);

    return summary;
}

async function main() {
    console.log('═══════════════════════════════════════════════════════════');
    console.log('   PLANTMATICA BACKEND - FULL BENCHMARK SUITE');
    console.log(`   Target: ${BASE_URL}`);
    console.log('═══════════════════════════════════════════════════════════');

    // Obtener token si es necesario
    if (!AUTH_TOKEN) {
        AUTH_TOKEN = await obtenerToken();
    }

    const authHeaders = AUTH_TOKEN ? { 'x-token': AUTH_TOKEN } : {};

    const tests = [
        // === TESTS DE LECTURA (Endpoints públicos) ===
        {
            name: '1. GET /ficha (Listar fichas) - Baseline',
            config: { 
                connections: 10, 
                duration: 15, 
                warmup: { connections: 5, duration: 2 },
                requests: [{ method: 'GET', path: '/ficha' }] 
            }
        },
        {
            name: '2. GET /ficha/:id (Ficha específica)',
            config: { 
                connections: 50, 
                duration: 20, 
                warmup: { connections: 10, duration: 2 },
                requests: [{ method: 'GET', path: '/ficha/64a1b2c3d4e5f6a7b8c9d0e1' }] 
            }
        },
        {
            name: '3. GET /ficha/buscar/etiquetas',
            config: { 
                connections: 50, 
                duration: 20, 
                requests: [{ method: 'GET', path: '/ficha/buscar/etiquetas' }] 
            }
        },
        {
            name: '4. PUT /ficha/encontrar/coincidencia (Búsqueda)',
            config: { 
                connections: 30, 
                duration: 20, 
                requests: [{ 
                    method: 'PUT', 
                    path: '/ficha/encontrar/coincidencia/',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({ termino: 'suculenta' })
                }] 
            }
        },

        // === TESTS DE AUTENTICACIÓN ===
        {
            name: '5. POST /login (Login)',
            config: { 
                connections: 50, 
                duration: 20, 
                requests: [{ 
                    method: 'POST', 
                    path: '/login',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify({
                        correo: 'test@example.com',
                        password: 'password123'
                    })
                }] 
            }
        },

        // === TESTS DE CONCURRENCIA (Stress) ===
        {
            name: '6. Stress - GET /ficha (100 conexiones)',
            config: { 
                connections: 100, 
                duration: 30, 
                warmup: { connections: 20, duration: 3 },
                requests: [{ method: 'GET', path: '/ficha' }] 
            }
        },
        {
            name: '7. Stress - GET /ficha (200 conexiones)',
            config: { 
                connections: 200, 
                duration: 30, 
                warmup: { connections: 50, duration: 3 },
                requests: [{ method: 'GET', path: '/ficha' }] 
            }
        },
        {
            name: '8. Spike Test - GET /ficha (500 conexiones, 10s)',
            config: { 
                connections: 500, 
                duration: 10, 
                requests: [{ method: 'GET', path: '/ficha' }]
            }
        },

        // === TESTS DE ESCRITURA (Requieren JWT - comentados por defecto) ===
        // Descomenta y configura AUTH_TOKEN para probar endpoints protegidos
        // {
        //     name: '9. POST /ficha (Crear ficha)',
        //     config: { 
        //         connections: 10, 
        //         duration: 15, 
        //         requests: [{ 
        //             method: 'POST', 
        //             path: '/ficha',
        //             headers: { 
        //                 'content-type': 'application/json',
        //                 ...authHeaders
        //             },
        //             body: JSON.stringify({
        //                 nombre_comun: 'Planta Test',
        //                 nombre_cientifico: 'Testus plantus',
        //                 descripcion: 'Descripción de prueba',
        //                 complemento: 'Complemento',
        //                 usuario_creo: '64a1b2c3d4e5f6a7b8c9d0e1',
        //                 etiquetas: ['test'],
        //                 origen_distribucion: 'México',
        //                 usos_medicinales: 'Ninguno',
        //                 consumo: 'No comestible',
        //                 fuentes: 'Test',
        //                 caracteristicas_especiales: 'Resistente',
        //                 polemica: false
        //             })
        //         }] 
        //     }
        // },
        // {
        //     name: '10. POST /comment/:id (Comentar)',
        //     config: { 
        //         connections: 20, 
        //         duration: 15, 
        //         requests: [{ 
        //             method: 'POST', 
        //             path: '/comment/64a1b2c3d4e5f6a7b8c9d0e1',
        //             headers: { 
        //                 'content-type': 'application/json',
        //                 ...authHeaders
        //             },
        //             body: JSON.stringify({
        //                 comentario: 'Excelente ficha de planta',
        //                 id_user: '64a1b2c3d4e5f6a7b8c9d0e1'
        //             })
        //         }] 
        //     }
        // },
    ];

    const results = [];
    for (const test of tests) {
        try {
            const result = await benchmarkEndpoint(test.name, test.config);
            results.push(result);

            // Pausa de recuperación entre tests
            console.log('⏳ Pausa de recuperación (5s)...');
            await new Promise(r => setTimeout(r, 5000));
        } catch (err) {
            console.error(`❌ Error en test "${test.name}":`, err.message);
            results.push({ name: test.name, error: err.message });
        }
    }

    // === RESUMEN ===
    console.log('\n═══════════════════════════════════════════════════════════');
    console.log('   RESUMEN DE RESULTADOS');
    console.log('═══════════════════════════════════════════════════════════');

    const tableData = results.map(r => ({
        Test: r.name.split(' - ')[0],
        RPS: r.rps || 'N/A',
        'Latency avg': r.latencyAvg ? `${r.latencyAvg}ms` : 'N/A',
        'Latency p99': r.latencyP99 ? `${r.latencyP99}ms` : 'N/A',
        Errors: r.errors || 'N/A',
        '5xx': r.status5xx || 0
    }));
    console.table(tableData);

    // Identificar punto de ruptura
    const breakingPoints = results.filter(r => (r.status5xx > 0 || r.errors > 10));
    if (breakingPoints.length > 0) {
        console.log('\n⚠️  PUNTOS DE RUPTURA DETECTADOS:');
        breakingPoints.forEach(bp => {
            console.log(`   • ${bp.name}`);
            console.log(`     RPS: ${bp.rps} | Latency p99: ${bp.latencyP99}ms | 5xx: ${bp.status5xx} | Errors: ${bp.errors}`);
        });
    } else {
        console.log('\n✅ No se detectaron puntos de ruptura en los tests realizados.');
    }

    // Guardar resultados en JSON
    const output = {
        timestamp: new Date().toISOString(),
        target: BASE_URL,
        results
    };
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));
    console.log(`\n💾 Resultados guardados en: ${OUTPUT_FILE}`);

    // Recomendaciones
    console.log('\n📋 RECOMENDACIONES:');
    const maxRps = Math.max(...results.filter(r => r.rps).map(r => r.rps));
    console.log(`   • Capacidad máxima observada: ~${maxRps} RPS`);
    console.log('   • Para tests de endpoints con JWT, exporta BENCH_TOKEN o modifica el script');
    console.log('   • Considera agregar tests de /admin para medir operaciones de administrador');
    console.log('   • Monitorea la base de MongoDB durante los tests de escritura');
}

main().catch(err => {
    console.error('❌ Error fatal:', err.message);
    console.error('Asegúrate de que el servidor esté corriendo en', BASE_URL);
    process.exit(1);
});