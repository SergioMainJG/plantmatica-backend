// benchmarks/stress-test.js
const autocannon = require('autocannon');

async function run() {
    console.log('🏃 Iniciando stress test contra Plantmatica Backend...');
    console.log('URL: http://localhost:8080');
    console.log('Conexiones: 100 | Duración: 30s\n');

    const result = await autocannon({
        url: 'http://localhost:8080',
        connections: 100,        // 100 conexiones concurrentes
        duration: 30,            // 30 segundos
        pipelining: 1,
        // Warmup: 2 segundos para calentar antes de medir
        warmup: {
            connections: 10,
            duration: 2
        },
        requests: [
            // GET /ficha - Listar todas las fichas aceptadas (público, no requiere auth)
            { method: 'GET', path: '/ficha' },

            // GET /ficha/:id - Obtener ficha específica (público)
            { method: 'GET', path: '/ficha/64a1b2c3d4e5f6a7b8c9d0e1' },

            // GET /ficha/buscar/etiquetas - Listar etiquetas (público)
            { method: 'GET', path: '/ficha/buscar/etiquetas' },

            // POST /login - Login de usuario (público, sin auth)
            {
                method: 'POST',
                path: '/login',
                headers: { 'content-type': 'application/json' },
                body: JSON.stringify({
                    correo: 'test@example.com',
                    password: 'password123'
                })
            },

            // GET /user/:id - Obtener usuario (requiere JWT, usar token real)
            // Nota: Para endpoints con auth, necesitas un token válido
            // { method: 'GET', path: '/user/64a1b2c3d4e5f6a7b8c9d0e1', headers: { 'x-token': 'TU_TOKEN_AQUI' } },

            // POST /ficha - Crear ficha (requiere JWT + body completo)
            // {
            //     method: 'POST',
            //     path: '/ficha',
            //     headers: { 
            //         'content-type': 'application/json',
            //         'x-token': 'TU_TOKEN_AQUI'
            //     },
            //     body: JSON.stringify({
            //         nombre_comun: 'Suculenta Test',
            //         nombre_cientifico: 'Echeveria elegans',
            //         descripcion: 'Planta de interior fácil de cuidar',
            //         complemento: 'Planta ornamental',
            //         usuario_creo: '64a1b2c3d4e5f6a7b8c9d0e1',
            //         etiquetas: ['suculenta', 'interior'],
            //         origen_distribucion: 'México',
            //         usos_medicinales: 'Ninguno',
            //         consumo: 'No comestible',
            //         fuentes: 'Wikipedia',
            //         caracteristicas_especiales: 'Resistente a sequía',
            //         polemica: false
            //     })
            // }
        ]
    });

    console.log('\n=== RESULTADOS DEL STRESS TEST ===');
    console.log(`Requests/sec (avg):     ${result.requests.average}`);
    console.log(`Requests/sec (min):     ${result.requests.min}`);
    console.log(`Requests/sec (max):     ${result.requests.max}`);
    console.log(`Latency avg:            ${result.latency.average} ms`);
    console.log(`Latency p50:            ${result.latency.p50} ms`);
    console.log(`Latency p75:            ${result.latency.p75} ms`);
    console.log(`Latency p99:            ${result.latency.p99} ms`);
    console.log(`Latency max:            ${result.latency.max} ms`);
    console.log(`Throughput:             ${(result.throughput.average / 1024).toFixed(2)} KB/sec`);
    console.log(`Errors:                 ${result.errors}`);
    console.log(`Timeouts:               ${result.timeouts}`);
    console.log(`2xx responses:          ${result['2xx']}`);
    console.log(`3xx responses:          ${result['3xx']}`);
    console.log(`4xx responses:          ${result['4xx']}`);
    console.log(`5xx responses:          ${result['5xx']}`);
    console.log(`Non-2xx/3xx:            ${result.non2xx}`);
    console.log(`Total requests:          ${result.requests.sent}`);

    // Alertas automáticas
    if (result.errors > 0) {
        console.warn('\n⚠️  ALERTA: Se detectaron errores durante el test');
    }
    if (result.latency.p99 > 1000) {
        console.warn('⚠️  ALERTA: Latencia P99 > 1s - posible degradación de rendimiento');
    }
    if (result['5xx'] > 0) {
        console.warn('⚠️  ALERTA: Errores 5xx detectados - el servidor está fallando bajo carga');
    }
}

run().catch(err => {
    console.error('❌ Error en el benchmark:', err.message);
    console.error('Asegúrate de que el servidor esté corriendo en http://localhost:8080');
    process.exit(1);
});