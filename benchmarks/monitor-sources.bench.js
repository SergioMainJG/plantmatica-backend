// benchmarks/monitor-recursos.js
const os = require('os');
const v8 = require('v8');
const fs = require('fs');

// ============================================
// MONITOR DE RECURSOS DEL SISTEMA
// ============================================
// Monitorea CPU, memoria, heap y sistema durante los benchmarks

let lastCpuUsage = process.cpuUsage();
let lastTime = process.hrtime.bigint();

function logRecursos() {
    const now = process.hrtime.bigint();
    const elapsedNs = Number(now - lastTime);
    const elapsedSec = elapsedNs / 1e9;

    const currentCpu = process.cpuUsage();
    const mem = process.memoryUsage();

    // Calcular delta de CPU (en microsegundos)
    const userDelta = currentCpu.user - lastCpuUsage.user;
    const systemDelta = currentCpu.system - lastCpuUsage.system;
    const totalDelta = userDelta + systemDelta;

    // Calcular % CPU (aproximado, basado en un core)
    const cpuPercent = ((totalDelta / 1e6) / elapsedSec * 100).toFixed(2);
    const userPercent = ((userDelta / 1e6) / elapsedSec * 100).toFixed(2);
    const systemPercent = ((systemDelta / 1e6) / elapsedSec * 100).toFixed(2);

    // Heap stats
    const heapStats = v8.getHeapStatistics();
    const heapUsedMB = (mem.heapUsed / 1024 / 1024).toFixed(2);
    const heapTotalMB = (mem.heapTotal / 1024 / 1024).toFixed(2);
    const heapLimitMB = (heapStats.heap_size_limit / 1024 / 1024).toFixed(2);
    const rssMB = (mem.rss / 1024 / 1024).toFixed(2);
    const externalMB = (mem.external / 1024 / 1024).toFixed(2);
    const arrayBuffersMB = (mem.arrayBuffers / 1024 / 1024).toFixed(2);

    // Heap space stats (detalle de generaciones)
    const heapSpaceStats = v8.getHeapSpaceStatistics();
    const newSpace = heapSpaceStats.find(s => s.space_name === 'new_space');
    const oldSpace = heapSpaceStats.find(s => s.space_name === 'old_space');

    // Sistema
    const loadAvg = os.loadavg();
    const freeMemMB = (os.freemem() / 1024 / 1024).toFixed(0);
    const totalMemMB = (os.totalmem() / 1024 / 1024).toFixed(0);
    const memPercent = ((os.totalmem() - os.freemem()) / os.totalmem() * 100).toFixed(1);

    // Uptime
    const uptime = process.uptime().toFixed(0);

    const timestamp = new Date().toISOString();

    console.log(`\n[${timestamp}] ─── Recursos del Proceso ───`);
    console.log(`  CPU:`);
    console.log(`    Total: ${cpuPercent}% | User: ${userPercent}% | System: ${systemPercent}%`);
    console.log(`  Memoria:`);
    console.log(`    RSS:        ${rssMB} MB`);
    console.log(`    Heap usado: ${heapUsedMB} MB / ${heapTotalMB} MB (límite: ${heapLimitMB} MB)`);
    console.log(`    External:   ${externalMB} MB | ArrayBuffers: ${arrayBuffersMB} MB`);
    if (newSpace && oldSpace) {
        console.log(`    New Space:  ${(newSpace.space_used_size / 1024 / 1024).toFixed(2)} MB`);
        console.log(`    Old Space:  ${(oldSpace.space_used_size / 1024 / 1024).toFixed(2)} MB`);
    }
    console.log(`  Sistema:`);
    console.log(`    Load avg:   ${loadAvg.map(v => v.toFixed(2)).join(', ')}`);
    console.log(`    Memoria OS: ${memPercent}% usada (${freeMemMB}/${totalMemMB} MB libre)`);
    console.log(`    Uptime:     ${uptime}s`);

    // Alertas de memoria
    const heapUsagePercent = (mem.heapUsed / heapStats.heap_size_limit * 100);
    if (heapUsagePercent > 80) {
        console.warn(`⚠️  ALERTA: Heap usage > 80% (${heapUsagePercent.toFixed(1)}%) - Posible memory leak`);
    }
    if (parseFloat(rssMB) > 1024) {
        console.warn(`⚠️  ALERTA: RSS > 1GB (${rssMB} MB) - Revisa memory leaks`);
    }

    // Actualizar referencias
    lastCpuUsage = currentCpu;
    lastTime = now;
}

// Ejecutar cada 5 segundos
const interval = setInterval(logRecursos, 5000);

// Primera ejecución inmediata
logRecursos();

// Manejar cierre graceful
process.on('SIGINT', () => {
    console.log('\n👋 Deteniendo monitor de recursos...');
    clearInterval(interval);
    process.exit(0);
});

process.on('SIGTERM', () => {
    clearInterval(interval);
    process.exit(0);
});

console.log('📊 Monitor de recursos iniciado');
console.log('   Intervalo: 5 segundos');
console.log('   Presiona Ctrl+C para detener\n');