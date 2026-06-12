// benchmarks/comprehensive-benchmark.js
// ============================================
// BENCHMARK COMPLETO DE PLANTMATICA BACKEND
// ============================================
// Ejecuta tests de estrés, concurrencia, recursos y bloqueos
// Todo en un solo script coordinado

const autocannon = require('autocannon');
const { spawn } = require('child_process');
const { performance } = require('perf_hooks');
const fs = require('fs');
const path = require('path');

const BASE_URL = process.env.BENCH_URL || 'http://localhost:8080';
const RESULTS_DIR = path.join(__dirname, 'results');

// Crear directorio de resultados
if (!fs.existsSync(RESULTS_DIR)) {
    fs.mkdirSync(RESULTS_DIR, { recursive: true });
}

// ============================================
// UTILIDADES
// ============================================

function timestamp() {
    return new Date().toISOString().replace(/[:.]/g, '-');
}

function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function formatDuration(ms) {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}min`;
}

// ============================================
// TESTS DE CARGA CON AUTOCANNON
// ============================================

async function runLoadTest(name, config) {
    console.log(`\n🚀 ${name}`);
    console.log(`   Conexiones: ${config.connections} | Duración: ${config.duration}s`);

    const start = performance.now();
    const result = await autocannon({
        url: BASE_URL,
        ...config
    });
    const elapsed = performance.now() - start;

    const summary = {
        name,
        config: {
            connections: config.connections,
            duration: config.duration,
            pipelining: config.pipelining || 1
        },
        timing: {
            benchmarkDuration: `${elapsed.toFixed(0)}ms`,
            testDuration: `${result.duration}s`
        },
        requests: {
            average: Math.round(result.requests.average),
            min: Math.round(result.requests.min),
            max: Math.round(result.requests.max),
            sent: result.requests.sent,
            total: result.requests.total
        },
        latency: {
            average: Math.round(result.latency.average),
            stddev: Math.round(result.latency.stddev),
            min: Math.round(result.latency.min),
            max: Math.round(result.latency.max),
            p50: Math.round(result.latency.p50),
            p75: Math.round(result.latency.p75),
            p90: Math.round(result.latency.p90),
            p99: Math.round(result.latency.p99)
        },
        throughput: {
            average: formatBytes(result.throughput.average),
            min: formatBytes(result.throughput.min),
            max: formatBytes(result.throughput.max)
        },
        errors: {
            total: result.errors,
            timeouts: result.timeouts,
            status2xx: result['2xx'],
            status3xx: result['3xx'],
            status4xx: result['4xx'],
            status5xx: result['5xx'],
            non2xx3xx: result.non2xx
        },
        score: calculateScore(result)
    };

    // Print inline
    const status = summary.errors.status5xx > 0 ? '❌' : 
                   summary.errors.total > 0 ? '⚠️' : '✅';
    console.log(`   ${status} RPS: ${summary.requests.average} | Latency: ${summary.latency.average}ms (p99: ${summary.latency.p99}ms) | Errors: ${summary.errors.total}`);

    return summary;
}

function calculateScore(result) {
    // Score simple: RPS / (latency_avg * error_factor)
    const errorFactor = result.errors > 0 ? 1 + (result.errors / result.requests.sent) : 1;
    const score = result.requests.average / (result.latency.average * errorFactor);
    return Math.round(score * 100) / 100;
}

// ============================================
// SCENARIOS DE TEST
// ============================================

const SCENARIOS = {
    // Lectura pública
    fichaList: (conns = 10, dur = 15) => ({
        connections: conns,
        duration: dur,
        warmup: { connections: Math.min(5, conns), duration: 2 },
        requests: [{ method: 'GET', path: '/ficha' }]
    }),

    fichaById: (conns = 50, dur = 20) => ({
        connections: conns,
        duration: dur,
        warmup: { connections: Math.min(10, conns), duration: 2 },
        requests: [{ method: 'GET', path: '/ficha/64a1b2c3d4e5f6a7b8c9d0e1' }]
    }),

    etiquetas: (conns = 50, dur = 20) => ({
        connections: conns,
        duration: dur,
        requests: [{ method: 'GET', path: '/ficha/buscar/etiquetas' }]
    }),

    busqueda: (conns = 30, dur = 20) => ({
        connections: conns,
        duration: dur,
        requests: [{ 
            method: 'PUT', 
            path: '/ficha/encontrar/coincidencia/',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ termino: 'suculenta' })
        }]
    }),

    // Autenticación
    login: (conns = 50, dur = 20) => ({
        connections: conns,
        duration: dur,
        requests: [{ 
            method: 'POST', 
            path: '/login',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({
                correo: 'test@example.com',
                password: 'password123'
            })
        }]
    }),

    // Stress tests
    stressLight: () => ({ connections: 50, duration: 30, ...SCENARIOS.fichaList(50, 30) }),
    stressMedium: () => ({ connections: 100, duration: 30, ...SCENARIOS.fichaList(100, 30) }),
    stressHeavy: () => ({ connections: 200, duration: 30, ...SCENARIOS.fichaList(200, 30) }),
    stressExtreme: () => ({ connections: 500, duration: 15, ...SCENARIOS.fichaList(500, 15) }),

    // Spike test (ramp up rápido)
    spike: () => ({
        connections: 300,
        duration: 10,
        requests: [{ method: 'GET', path: '/ficha' }]
    }),

    // Soak test (larga duración, baja carga)
    soak: () => ({
        connections: 20,
        duration: 300, // 5 minutos
        requests: [{ method: 'GET', path: '/ficha' }]
    })
};

// ============================================
// SUITE DE TESTS
// ============================================

async function runBaselineTests() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  FASE 1: TESTS BASELINE (Lectura pública)                    ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');

    const results = [];
    results.push(await runLoadTest('GET /ficha (Listar)', SCENARIOS.fichaList(10, 15)));
    await sleep(3000);
    results.push(await runLoadTest('GET /ficha/:id (Detalle)', SCENARIOS.fichaById(50, 20)));
    await sleep(3000);
    results.push(await runLoadTest('GET /ficha/buscar/etiquetas', SCENARIOS.etiquetas(50, 20)));
    await sleep(3000);
    results.push(await runLoadTest('PUT /ficha/encontrar/coincidencia', SCENARIOS.busqueda(30, 20)));
    await sleep(3000);
    results.push(await runLoadTest('POST /login (Auth)', SCENARIOS.login(50, 20)));

    return results;
}

async function runStressTests() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  FASE 2: TESTS DE ESTRÉS (Concurrencia creciente)            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');

    const results = [];
    results.push(await runLoadTest('Stress Ligero (50 conns)', SCENARIOS.stressLight()));
    await sleep(5000);
    results.push(await runLoadTest('Stress Medio (100 conns)', SCENARIOS.stressMedium()));
    await sleep(5000);
    results.push(await runLoadTest('Stress Pesado (200 conns)', SCENARIOS.stressHeavy()));
    await sleep(5000);
    results.push(await runLoadTest('Stress Extremo (500 conns)', SCENARIOS.stressExtreme()));

    return results;
}

async function runSpikeTest() {
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  FASE 3: SPIKE TEST (Pico repentino)                         ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');

    return [await runLoadTest('Spike (300 conns, 10s)', SCENARIOS.spike())];
}

async function runSoakTest() {
    if (process.env.SKIP_SOAK) {
        console.log('\n⏭️  Soak test omitido (usa SKIP_SOAK=0 para ejecutar)');
        return [];
    }

    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  FASE 4: SOAK TEST (5 minutos, 20 conns)                    ║');
    console.log('║  Esto detecta memory leaks y degradación sostenida           ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log('   Presiona Ctrl+C para saltar esta fase...');

    return [await runLoadTest('Soak (20 conns, 5min)', SCENARIOS.soak())];
}

// ============================================
// REPORTE FINAL
// ============================================

function generateReport(allResults) {
    const report = {
        metadata: {
            timestamp: new Date().toISOString(),
            target: BASE_URL,
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            cpus: require('os').cpus().length
        },
        phases: allResults
    };

    // Guardar JSON
    const filename = `benchmark-${timestamp()}.json`;
    const filepath = path.join(RESULTS_DIR, filename);
    fs.writeFileSync(filepath, JSON.stringify(report, null, 2));

    // Generar resumen en consola
    console.log('\n╔══════════════════════════════════════════════════════════════╗');
    console.log('║  RESUMEN EJECUTIVO                                           ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');

    const allTests = allResults.flatMap(p => p.results);

    console.log('\n📊 Métricas clave:');
    const maxRps = Math.max(...allTests.filter(t => t.requests).map(t => t.requests.average));
    const maxLatency = Math.max(...allTests.filter(t => t.latency).map(t => t.latency.p99));
    const totalErrors = allTests.reduce((sum, t) => sum + (t.errors?.total || 0), 0);
    const total5xx = allTests.reduce((sum, t) => sum + (t.errors?.status5xx || 0), 0);

    console.log(`   • RPS máximo alcanzado: ${maxRps}`);
    console.log(`   • Latencia P99 máxima: ${maxLatency}ms`);
    console.log(`   • Total errores: ${totalErrors}`);
    console.log(`   • Errores 5xx: ${total5xx}`);

    // Punto de ruptura
    const breakingTests = allTests.filter(t => t.errors?.status5xx > 0 || t.errors?.total > 100);
    if (breakingTests.length > 0) {
        console.log('\n⚠️  Puntos de ruptura detectados:');
        breakingTests.forEach(t => {
            console.log(`   • ${t.name}: ${t.requests.average} RPS, ${t.latency.p99}ms p99, ${t.errors.status5xx} errores 5xx`);
        });
    }

    // Recomendaciones
    console.log('\n💡 Recomendaciones:');
    if (total5xx > 0) {
        console.log('   • El servidor falla bajo carga extrema. Considera:');
        console.log('     - Implementar rate limiting');
        console.log('     - Usar clustering (PM2 o Node.js cluster)');
        console.log('     - Agregar caché (Redis) para endpoints de lectura');
        console.log('     - Revisar índices de MongoDB');
    }
    if (maxLatency > 1000) {
        console.log('   • Latencia muy alta detectada. Revisa:');
        console.log('     - Consultas MongoDB sin índices');
        console.log('     - Operaciones bcrypt síncronas');
        console.log('     - Middlewares pesados');
    }
    if (totalErrors === 0) {
        console.log('   ✅ El servidor manejó todos los tests sin errores 5xx');
        console.log('   • Considera aumentar la carga para encontrar el límite real');
    }

    console.log(`\n💾 Reporte completo guardado en: ${filepath}`);

    return report;
}

// ============================================
// MAIN
// ============================================

async function main() {
    console.log('╔══════════════════════════════════════════════════════════════╗');
    console.log('║     PLANTMATICA BACKEND - COMPREHENSIVE BENCHMARK            ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    console.log(`Target: ${BASE_URL}`);
    console.log(`Node: ${process.version} | Platform: ${process.platform} | CPUs: ${require('os').cpus().length}`);
    console.log('');

    // Verificar que el servidor esté corriendo
    try {
        await autocannon({ url: BASE_URL, connections: 1, duration: 1 });
    } catch (err) {
        console.error(`❌ No se puede conectar a ${BASE_URL}`);
        console.error('   Asegúrate de que el servidor esté corriendo.');
        process.exit(1);
    }

    const allResults = [];

    // Fase 1: Baseline
    allResults.push({ phase: 'Baseline', results: await runBaselineTests() });

    // Fase 2: Stress
    allResults.push({ phase: 'Stress', results: await runStressTests() });

    // Fase 3: Spike
    allResults.push({ phase: 'Spike', results: await runSpikeTest() });

    // Fase 4: Soak (opcional)
    const soakResults = await runSoakTest();
    if (soakResults.length > 0) {
        allResults.push({ phase: 'Soak', results: soakResults });
    }

    // Reporte
    generateReport(allResults);

    console.log('\n✅ Benchmark completado');
}

main().catch(err => {
    console.error('❌ Error fatal:', err.message);
    console.error(err.stack);
    process.exit(1);
});