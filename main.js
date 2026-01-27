// Normalization Guide Logic

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initNormalizationExample();
    initScrollAnimations();
});

function initNavigation() {
    const sections = document.querySelectorAll('.guide-section');
    const navLinks = document.querySelectorAll('.side-nav a');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= sectionTop - 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
}

function initNormalizationExample() {
    const container = document.getElementById('normalization-steps');

    const steps = [
        {
            title: "Estado Inicial: No Normalizado",
            description: "Una sola tabla con grupos repetidos y datos atómicos mezclados. ¡Un desastre!",
            table: `
                <table>
                    <thead>
                        <tr><th>Estudiante</th><th>Materias</th><th>Profesor</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Juan</td><td>BD, Redes</td><td>Ing. Gomez</td></tr>
                        <tr><td>Maria</td><td>Programación</td><td>Ing. Ruiz</td></tr>
                    </tbody>
                </table>
            `
        },
        {
            title: "1FN: Primera Forma Normal",
            description: "Eliminamos grupos repetidos. Ahora cada celda es atómica. Sin embargo, hay mucha redundancia, ya que repetimos información del estudiante para cada materia.",
            table: `
                <table>
                    <thead>
                        <tr><th>Estudiante</th><th>Materia</th><th>Profesor</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Juan</td><td>BD</td><td>Ing. Gomez</td></tr>
                        <tr><td>Juan</td><td>Redes</td><td>Ing. Gomez</td></tr>
                        <tr><td>Maria</td><td>Programación</td><td>Ing. Ruiz</td></tr>
                    </tbody>
                </table>
            `
        },
        {
            title: "2FN: Segunda Forma Normal",
            description: "Separamos en tablas según la dependencia de la llave primaria. La tabla 'Materias' ahora solo contiene información de la materia, eliminando la redundancia de repetir el profesor en cada registro de estudiante.",
            table: `
                <div class="multi-table" style="display: flex; gap: 1rem;">
                    <div>
                        <strong>Tabla Estudiantes-Materias</strong>
                        <table>
                            <tr><th>Est_ID</th><th>Mat_ID</th></tr>
                            <tr><td>1</td><td>A</td></tr>
                            <tr><td>1</td><td>B</td></tr>
                        </table>
                    </div>
                    <div>
                        <strong>Tabla Materias</strong>
                        <table>
                            <tr><th>Mat_ID</th><th>Nombre</th><th>Profesor</th></tr>
                            <tr><td>A</td><td>BD</td><td>Ing. Gomez</td></tr>
                        </table>
                    </div>
                </div>
            `
        },
        {
            title: "3FN: Tercera Forma Normal",
            description: "Eliminamos dependencias transitivas. El profesor está asignado a la materia, independientemente de qué estudiante la tome. Si cambia el profesor de 'BD', solo actualizamos un registro. ¡Modelo Optimizado!",
            table: `
                <div class="multi-table" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div><strong>Estudiantes</strong><table><tr><th>ID</th><th>Nom</th></tr></table></div>
                    <div><strong>Materias</strong><table><tr><th>ID</th><th>Nom</th></tr></table></div>
                    <div><strong>Inscripciones</strong><table><tr><th>EstID</th><th>MatID</th></tr></table></div>
                    <div><strong>Profesores</strong><table><tr><th>ID</th><th>Nom</th></tr></table></div>
                </div>
            `
        }
    ];

    let currentStep = 0;

    function renderStep(index) {
        const step = steps[index];
        container.innerHTML = `
            <div class="step-container">
                <div class="step-header">
                    <span class="step-badge">Paso ${index}</span>
                    <h5>${step.title}</h5>
                </div>
                <p class="step-description">${step.description}</p>
                <div class="table-container">
                    ${step.table}
                </div>
                <div class="step-controls" style="margin-top: 1.5rem; display: flex; gap: 1rem;">
                    <button id="prev-btn" class="btn-primary" style="background: #333; color: #fff" ${index === 0 ? 'disabled' : ''}>Anterior</button>
                    <button id="next-btn" class="btn-primary" ${index === steps.length - 1 ? 'disabled' : ''}>Siguiente</button>
                </div>
            </div>
        `;

        document.getElementById('next-btn')?.addEventListener('click', () => {
            if (currentStep < steps.length - 1) {
                currentStep++;
                renderStep(currentStep);
            }
        });

        document.getElementById('prev-btn')?.addEventListener('click', () => {
            if (currentStep > 0) {
                currentStep--;
                renderStep(currentStep);
            }
        });
    }

    renderStep(currentStep);
}

function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.guide-section, .activity-block').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
}
