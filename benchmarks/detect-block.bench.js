// benchmarks/detectar-bloqueos.js
const { monitorEventLoopDelay, performance } = require('perf_hooks');
const os = require('os');

// ============================================
// DETECTOR DE BLOQUEOS DEL EVENT LOOP
// ============================================
// Este script monitorea el event loop de Node.js para detectar
// bloqueos causados por operaciones síncronas pesadas (bcrypt, 
// operaciones de MongoDB sin índices, etc.)

const h = monitorEventLoopDelay({ resolution: 10 });
h.enable();

let alertCount = 0;
const MAX_ALERTS = 5; // Limitar alertas para no saturar la consola

const interval = setInterval(() => {
    h.disable();

    const maxMs = h.max / 1e6;
    const meanMs = h.mean / 1e6;
    const p50Ms = h.percentile(50) / 1e6;
    const p99Ms = h.percentile(99) / 1e6;

    const timestamp = new Date().toISOString();

    console.log(`\n[${timestamp}] Event Loop Delay:`);
    console.log(`  Min:     ${(h.min / 1e6).toFixed(3)} ms`);
    console.log(`  Max:     ${maxMs.toFixed(3)} ms`);
    console.log(`  Mean:    ${meanMs.toFixed(3)} ms`);
    console.log(`  Stddev:  ${(h.stddev / 1e6).toFixed(3)} ms`);
    console.log(`  p50:     ${p50Ms.toFixed(3)} ms`);
    console.log(`  p99:     ${p99Ms.toFixed(3)} ms`);

    // Alertas basadas en umbrales
    if (maxMs > 100) {
        alertCount++;
        console.warn(`⚠️  ALERTA #${alertCount}: Event loop bloqueado > 100ms (${maxMs.toFixed(2)}ms)`);

        if (alertCount <= MAX_ALERTS) {
            console.warn('   Posibles causas:');
            console.warn('   • Operaciones bcrypt síncronas (compareSync, hashSync)');
            console.warn('   • Consultas MongoDB sin índices en colecciones grandes');
            console.warn('   • Operaciones de archivo síncronas (fs.readFileSync)');
            console.warn('   • JSON.parse/stringify con payloads grandes');
            console.warn('   • Bucle síncrono pesado en algún middleware');
        }

        if (alertCount === MAX_ALERTS) {
            console.warn('   (Alertas limitadas a 5 para no saturar la consola)');
        }
    }

    // Alerta severa
    if (maxMs > 1000) {
        console.error('🚨 CRÍTICO: Event loop bloqueado > 1 segundo! El servidor está congelado.');
    }

    // Info de sistema
    const loadAvg = os.loadavg();
    const freeMem = (os.freemem() / 1024 / 1024).toFixed(0);
    const totalMem = (os.totalmem() / 1024 / 1024).toFixed(0);
    console.log(`  [Sistema] CPU load: ${loadAvg.map(v => v.toFixed(2)).join(', ')} | Mem: ${freeMem}/${totalMem} MB libre`);

    h.reset();
    h.enable();
}, 5000);

// Manejar cierre graceful
process.on('SIGINT', () => {
    console.log('\n👋 Deteniendo monitor de event loop...');
    clearInterval(interval);
    h.disable();
    process.exit(0);
});

process.on('SIGTERM', () => {
    clearInterval(interval);
    h.disable();
    process.exit(0);
});

console.log('🔍 Monitor de bloqueos del Event Loop iniciado');
console.log('   Intervalo: 5 segundos');
console.log('   Umbral de alerta: 100ms');
console.log('   Presiona Ctrl+C para detener\n');