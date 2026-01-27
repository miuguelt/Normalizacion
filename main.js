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
            description: "Una tabla con datos repetidos. Juan ve dos materias, y repetimos el nombre del profesor cada vez.",
            table: `
                <table>
                    <thead>
                        <tr><th>Estudiante</th><th>Materia</th><th>Profesor</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Juan Pérez</td><td>Bases de Datos</td><td>Ing. Gomez</td></tr>
                        <tr><td>Juan Pérez</td><td>Redes</td><td>Ing. Gomez</td></tr>
                        <tr><td>Maria Lopez</td><td>Programación</td><td>Ing. Ruiz</td></tr>
                    </tbody>
                </table>
            `
        },
        {
            title: "1FN: Primera Forma Normal",
            description: "Aseguramos atomicidad. En este caso los datos ya son atómicos, pero notamos la redundancia: 'Ing. Gomez' se repite.",
            table: `
                <table>
                    <thead>
                        <tr><th>Estudiante</th><th>Materia</th><th>Profesor</th></tr>
                    </thead>
                    <tbody>
                        <tr><td>Juan Pérez</td><td>Bases de Datos</td><td>Ing. Gomez</td></tr>
                        <tr><td>Juan Pérez</td><td>Redes</td><td>Ing. Gomez</td></tr>
                        <tr><td>Maria Lopez</td><td>Programación</td><td>Ing. Ruiz</td></tr>
                    </tbody>
                </table>
            `
        },
        {
            title: "2FN: Segunda Forma Normal",
            description: "Separamos los datos que dependen solo de la materia (Profesor) de los que dependen del estudiante (Inscripción).",
            table: `
                <div class="multi-table" style="display: flex; gap: 1rem; flex-wrap: wrap;">
                    <div>
                        <strong>Inscripciones</strong>
                        <table>
                            <tr><th>Estudiante</th><th>Materia</th></tr>
                            <tr><td>Juan Pérez</td><td>Bases de Datos</td></tr>
                            <tr><td>Juan Pérez</td><td>Redes</td></tr>
                            <tr><td>Maria Lopez</td><td>Programación</td></tr>
                        </table>
                    </div>
                    <div>
                        <strong>Materias (Catálogo)</strong>
                        <table>
                            <tr><th>Materia</th><th>Profesor</th></tr>
                            <tr><td>Bases de Datos</td><td>Ing. Gomez</td></tr>
                            <tr><td>Redes</td><td>Ing. Gomez</td></tr>
                            <tr><td>Programación</td><td>Ing. Ruiz</td></tr>
                        </table>
                    </div>
                </div>
            `
        },
        {
            title: "3FN: Tercera Forma Normal",
            description: "Creamos entidades independientes para evitar duplicidad de nombres (Estudiantes, Profesores) y usamos IDs. ¡Cero redundancia de texto!",
            table: `
                <div class="multi-table" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <strong>Estudiantes</strong>
                        <table><tr><th>ID</th><th>Nombre</th></tr><tr><td>1</td><td>Juan Pérez</td></tr><tr><td>2</td><td>Maria Lopez</td></tr></table>
                    </div>
                    <div>
                        <strong>Profesores</strong>
                        <table><tr><th>ID</th><th>Nombre</th></tr><tr><td>10</td><td>Ing. Gomez</td></tr><tr><td>20</td><td>Ing. Ruiz</td></tr></table>
                    </div>
                    <div>
                        <strong>Materias</strong>
                        <table><tr><th>ID</th><th>Nombre</th><th>Prof_ID</th></tr><tr><td>A</td><td>BD</td><td>10</td></tr><tr><td>B</td><td>Redes</td><td>10</td></tr><tr><td>C</td><td>Progra</td><td>20</td></tr></table>
                    </div>
                    <div>
                        <strong>Inscripciones</strong>
                        <table><tr><th>Est_ID</th><th>Mat_ID</th></tr><tr><td>1</td><td>A</td></tr><tr><td>1</td><td>B</td></tr><tr><td>2</td><td>C</td></tr></table>
                    </div>
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
