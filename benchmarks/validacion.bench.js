// benchmarks/validacion.bench.js
const Benchmark = require('benchmark');

// ============================================
// MICRO-BENCHMARKS DE FUNCIONES INTERNAS
// ============================================
// Estos benchmarks miden funciones puras del backend.
// Útil para optimizar validaciones, transformaciones, etc.

const suite = new Benchmark.Suite();

// ─── 1. Validación de etiquetas (simula validarEtiquetas del backend) ───
function validarEtiquetas(etiquetas) {
    if (!Array.isArray(etiquetas)) return false;
    if (etiquetas.length === 0) return false;
    return etiquetas.every(tag => 
        typeof tag === 'string' && 
        tag.length > 0 && 
        tag.length <= 50
    );
}

// ─── 2. Validación de correo electrónico (simula validación de login.js) ───
function validarCorreo(correo) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(correo);
}

// ─── 3. Simulación de bcrypt compareSync (operación CPU-intensive) ───
// Nota: Esto es una simulación. Para benchmark real de bcrypt,
// requiere importar bcryptjs y usar hashes reales.
function simularBcryptCompare(password, hash) {
    // Simula el costo computacional (bcrypt con salt rounds = 10)
    // En producción: bcryptjs.compareSync(password, hash)
    let result = 0;
    for (let i = 0; i < 10000; i++) {
        result += password.charCodeAt(i % password.length);
    }
    return result === hash.length; // dummy
}

// ─── 4. Validación de ObjectId de MongoDB (simula isMongoId) ───
function validarObjectId(id) {
    const objectIdRegex = /^[0-9a-fA-F]{24}$/;
    return objectIdRegex.test(id);
}

// ─── 5. Sanitización de texto de comentarios ───
function sanitizarComentario(texto) {
    if (typeof texto !== 'string') return '';
    return texto
        .trim()
        .substring(0, 500) // límite de 500 chars
        .replace(/[<>]/g, ''); // previene XSS básico
}

// ─── 6. Construcción de query de búsqueda (simula buscarCoincidencias) ───
function construirQueryBusqueda(termino) {
    if (!termino || typeof termino !== 'string') return {};
    return {
        etiquetas: { 
            $regex: termino.trim(), 
            $options: 'i' 
        }
    };
}

// ─── 7. Validación de campos de ficha (simula validarFicha) ───
function validarCamposFicha(ficha) {
    const errores = [];
    if (!ficha.nombre_comun || ficha.nombre_comun.length < 2) {
        errores.push('nombre_comun inválido');
    }
    if (!ficha.nombre_cientifico || ficha.nombre_cientifico.length < 2) {
        errores.push('nombre_cientifico inválido');
    }
    if (!ficha.descripcion || ficha.descripcion.length < 10) {
        errores.push('descripción muy corta');
    }
    if (!ficha.usuario_creo || !/^[0-9a-fA-F]{24}$/.test(ficha.usuario_creo)) {
        errores.push('ID de usuario inválido');
    }
    return errores;
}

// ─── Datos de prueba ───
const etiquetas5 = ['suculenta', 'interior', 'fácil', 'decorativa', 'regalo'];
const etiquetas20 = Array(20).fill('etiqueta');
const etiquetas100 = Array(100).fill('x').map((_, i) => `tag${i}`);
const correoValido = 'usuario@ejemplo.com';
const correoInvalido = 'no-es-correo';
const objectIdValido = '64a1b2c3d4e5f6a7b8c9d0e1';
const objectIdInvalido = 'no-es-un-id';
const comentarioLargo = 'Este es un comentario muy largo ' + 'x'.repeat(1000);
const fichaValida = {
    nombre_comun: 'Suculenta',
    nombre_cientifico: 'Echeveria elegans',
    descripcion: 'Planta ornamental de interior muy popular',
    usuario_creo: '64a1b2c3d4e5f6a7b8c9d0e1'
};

console.log('🏃 Ejecutando micro-benchmarks...\n');

suite
    // Validación de etiquetas
    .add('validarEtiquetas - 5 tags', () => {
        validarEtiquetas(etiquetas5);
    })
    .add('validarEtiquetas - 20 tags', () => {
        validarEtiquetas(etiquetas20);
    })
    .add('validarEtiquetas - 100 tags', () => {
        validarEtiquetas(etiquetas100);
    })

    // Validación de correo
    .add('validarCorreo - válido', () => {
        validarCorreo(correoValido);
    })
    .add('validarCorreo - inválido', () => {
        validarCorreo(correoInvalido);
    })

    // ObjectId
    .add('validarObjectId - válido', () => {
        validarObjectId(objectIdValido);
    })
    .add('validarObjectId - inválido', () => {
        validarObjectId(objectIdInvalido);
    })

    // Sanitización
    .add('sanitizarComentario - corto', () => {
        sanitizarComentario('Buena ficha!');
    })
    .add('sanitizarComentario - largo (>500)', () => {
        sanitizarComentario(comentarioLargo);
    })

    // Query de búsqueda
    .add('construirQueryBusqueda', () => {
        construirQueryBusqueda('suculenta');
    })

    // Validación de ficha completa
    .add('validarCamposFicha - válida', () => {
        validarCamposFicha(fichaValida);
    })
    .add('validarCamposFicha - inválida', () => {
        validarCamposFicha({ nombre_comun: 'A', descripcion: 'x' });
    })

    // Simulación de bcrypt (CPU-intensive)
    .add('simularBcryptCompare', () => {
        simularBcryptCompare('password123', '$2a$10$...hash...');
    })

    .on('cycle', (event) => {
        console.log(String(event.target));
    })
    .on('complete', function() {
        console.log('\n📊 RESULTADOS:');
        console.log('Más rápido: ' + this.filter('fastest').map('name'));
        console.log('Más lento:  ' + this.filter('slowest').map('name'));

        // Análisis de rendimiento
        const results = this.map(bench => ({
            name: bench.name,
            hz: Math.round(bench.hz),
            rme: bench.stats.rme.toFixed(2),
            samples: bench.stats.sample.length
        }));

        console.log('\n📋 Tabla de resultados:');
        console.table(results);

        // Recomendaciones
        console.log('\n💡 RECOMENDACIONES:');
        const bcryptBench = this.find({ name: 'simularBcryptCompare' });
        if (bcryptBench && bcryptBench.hz < 100) {
            console.log('   • bcrypt es muy lento. Considera usar bcrypt.compare (async) en lugar de compareSync');
            console.log('   • O aumenta los workers de Node.js con CLUSTER_MODE');
        }

        const tagBench = this.find({ name: 'validarEtiquetas - 100 tags' });
        if (tagBench && tagBench.hz < 1000000) {
            console.log('   • Validación de etiquetas con muchos elementos podría optimizarse');
        }
    })
    .run({ async: true });