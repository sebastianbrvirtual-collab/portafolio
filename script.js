/* =========================================================
   SEBASTIAN BERNAL - PORTAFOLIO BILINGUE
   Navegacion por vistas + selector ES / EN
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {
    const navbar = document.getElementById('navbar');
    const menuToggle = document.getElementById('menuToggle');
    const primaryNav = document.getElementById('primaryNav');
    const navLinks = [...document.querySelectorAll('.nav-link')];
    const sections = [...document.querySelectorAll('main section[id]')];
    const footer = document.querySelector('.footer');

    if (!sections.length) {
        console.warn('No se encontraron secciones dentro de <main>.');
        return;
    }

    const sectionsById = new Map(sections.map(section => [section.id, section]));
    let currentSectionId = '';
    let navigationToken = 0;
    let currentLanguage = 'es';

    document.body.classList.add('single-view');

    function closeMenu() {
        if (!menuToggle || !primaryNav) return;
        primaryNav.classList.remove('open');
        menuToggle.classList.remove('is-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', currentLanguage === 'en' ? 'Open menu' : 'Abrir menú');
        document.body.classList.remove('menu-open');
    }

    function updateActiveLink(sectionId) {
        navLinks.forEach(link => {
            const active = link.getAttribute('href') === `#${sectionId}`;
            link.classList.toggle('active', active);
            if (active) link.setAttribute('aria-current', 'page');
            else link.removeAttribute('aria-current');
        });
    }

    function displaySection(sectionId, { animate = true } = {}) {
        const target = sectionsById.get(sectionId);
        if (!target) return false;

        sections.forEach(section => {
            const active = section === target;
            section.hidden = !active;
            section.classList.toggle('view-active', active);
            section.classList.remove('view-exit', 'view-enter');
            section.setAttribute('aria-hidden', String(!active));
        });

        if (footer) footer.hidden = false;
        currentSectionId = sectionId;
        updateActiveLink(sectionId);
        closeMenu();
        if (animate) target.classList.add('view-enter');
        window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
        return true;
    }

    function navigateTo(sectionId, { updateHistory = true, animate = true } = {}) {
        if (!sectionsById.has(sectionId)) return;
        if (sectionId === currentSectionId) {
            closeMenu();
            return;
        }

        const token = ++navigationToken;
        const current = sectionsById.get(currentSectionId);

        if (animate && current && !current.hidden) {
            current.classList.remove('view-enter');
            current.classList.add('view-exit');
            window.setTimeout(() => {
                if (token !== navigationToken) return;
                displaySection(sectionId, { animate: true });
            }, 150);
        } else {
            displaySection(sectionId, { animate });
        }

        if (updateHistory) {
            const nextUrl = `${window.location.pathname}${window.location.search}#${sectionId}`;
            window.history.pushState({ section: sectionId }, '', nextUrl);
        }
    }

    document.addEventListener('click', event => {
        const link = event.target.closest('a[href^="#"]');
        if (!link) return;
        const sectionId = link.getAttribute('href').slice(1);
        if (!sectionsById.has(sectionId)) return;
        event.preventDefault();
        navigateTo(sectionId);
    });

    if (menuToggle && primaryNav) {
        menuToggle.addEventListener('click', () => {
            const open = primaryNav.classList.toggle('open');
            menuToggle.classList.toggle('is-open', open);
            menuToggle.setAttribute('aria-expanded', String(open));
            menuToggle.setAttribute('aria-label', open ? (currentLanguage === 'en' ? 'Close menu' : 'Cerrar menú') : (currentLanguage === 'en' ? 'Open menu' : 'Abrir menú'));
            document.body.classList.toggle('menu-open', open);
        });
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') {
            closeMenu();
            closeLanguageMenu();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth > 820) closeMenu();
    });

    window.addEventListener('popstate', () => {
        const requested = window.location.hash.slice(1);
        navigationToken++;
        displaySection(sectionsById.has(requested) ? requested : sections[0].id);
    });

    function updateNavbar() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 18);
    }
    window.addEventListener('scroll', updateNavbar, { passive: true });
    updateNavbar();

    const revealItems = document.querySelectorAll('.pillar-card, .experience-card, .project-card, .skill-card, .education-item');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08 });
        revealItems.forEach(item => {
            item.classList.add('reveal');
            observer.observe(item);
        });
    } else {
        revealItems.forEach(item => item.classList.add('is-visible'));
    }

    const yearElement = document.getElementById('currentYear');
    if (yearElement) yearElement.textContent = new Date().getFullYear();

    const initial = window.location.hash.slice(1);
    const first = sectionsById.has(initial) ? initial : sections[0].id;
    displaySection(first, { animate: false });
    if (!window.location.hash) {
        window.history.replaceState({ section: first }, '', `#${first}`);
    }

    /* -------------------- LANGUAGE SWITCHER -------------------- */
    const languageSwitcher = document.getElementById('languageSwitcher');
    const languageToggle = document.getElementById('languageToggle');
    const languageMenu = document.getElementById('languageMenu');
    const currentLanguageLabel = document.getElementById('currentLanguage');
    const languageOptions = [...document.querySelectorAll('.language-option')];

    const translations = {"en":{"INGENIERO DE SISTEMAS · BOGOTÁ, COLOMBIA":"SYSTEMS ENGINEER · BOGOTÁ, COLOMBIA","Conecto":"I connect","datos, tecnología":"data, technology","y soluciones.":"and solutions.","Ingeniero de Sistemas con experiencia como Analista Junior en proyectos del sector financiero, operaciones transaccionales y soporte tecnológico. También desarrollo soluciones web y flujos de automatización.":"Systems Engineer with experience as a Junior Analyst on financial-sector projects, transaction operations, and technical support. I also build web solutions and process automation workflows.","Conocer mi experiencia":"Explore my experience","Ver proyectos":"View projects","Experiencia en proyectos empresariales del sector financiero":"Experience in enterprise projects within the financial sector","INFORMACIÓN · ANÁLISIS":"INFORMATION · ANALYSIS","Completitud · Validez":"Completeness · Validity","Consulta y análisis":"Querying and analysis","SELECCIONA UNA SECCIÓN PARA CONOCER MÁS":"SELECT A SECTION TO LEARN MORE","Inicio":"Home","Perfil":"About","Experiencia":"Experience","Proyectos":"Projects","Competencias":"Skills","Formación":"Training","Contacto":"Contact","Descargar CV":"Download CV","INGENIERO DE SISTEMAS":"SYSTEMS ENGINEER","Abrir menú":"Open menu","Cerrar menú":"Close menu","01 · PERFIL PROFESIONAL":"01 · PROFESSIONAL PROFILE","Una visión integral de la":"A comprehensive view of","tecnología.":"technology.","Soy Ingeniero de Sistemas con experiencia como Analista Junior en proyectos empresariales, operaciones transaccionales, gestión de información, soporte tecnológico y desarrollo de soluciones digitales.":"I am a Systems Engineer with experience as a Junior Analyst on enterprise projects, transaction operations, information management, technical support, and digital solution development.","A través de Inetum participé en proyectos del sector financiero relacionados con gestión y calidad de datos, catalogación de metadatos, trazabilidad, conciliaciones y análisis de información. Complemento esta experiencia con desarrollo web y automatización de procesos.":"Through Inetum, I contributed to financial-sector projects involving data management and quality, metadata cataloging, traceability, reconciliations, and information analysis. I complement this experience with web development and process automation.","Hablemos de oportunidades":"Let's discuss opportunities","Datos y análisis":"Data & Analytics","Gobierno, calidad, catalogación, SQL y análisis de información.":"Data governance, quality, cataloging, SQL, and information analysis.","Desarrollo y automatización":"Development & Automation","Soluciones web, integración de herramientas y flujos automatizados.":"Web solutions, tool integration, and automated workflows.","Operaciones y soporte":"Operations & Support","Procesos transaccionales, soporte N1/N2 y gestión de incidentes.":"Transaction processes, Tier 1/2 support, and incident management.","02 · TRAYECTORIA":"02 · CAREER HISTORY","profesional.":"experience.","Experiencia en entornos empresariales, proyectos tecnológicos y atención de requerimientos.":"Experience in business environments, technology projects, and request management.","ENE 2024 — NOV 2026":"JAN 2024 — NOV 2026","Proyectos para el sector financiero · BBVA":"Financial-sector projects · BBVA","Analista Junior · Proyecto de Gobierno de Datos":"Junior Analyst · Data Governance Project","AGO 2025 — NOV 2026":"AUG 2025 — NOV 2026","Identificación y articulación de Data Owners y Data Stewards por dominio y entidad de negocio.":"Identified and coordinated Data Owners and Data Stewards by business domain and entity.","Diseño e implementación de reglas de calidad de datos: completitud, validez, consistencia y unicidad.":"Designed and implemented data quality rules covering completeness, validity, consistency, and uniqueness.","Estructuración de diccionarios de datos y catalogación de metadatos, incluyendo definiciones conceptuales, técnicas y de linaje.":"Structured data dictionaries and cataloged metadata, including business, technical, and lineage definitions.","Ejecución de cargues masivos y consolidación de trazabilidad de iniciativas, responsables y matrices de gobernanza.":"Executed bulk data loads and consolidated traceability for initiatives, stakeholders, and governance matrices.","Seguimiento a lineamientos y políticas corporativas de gobierno de información.":"Monitored compliance with corporate information governance guidelines and policies.","Analista Transaccional":"Transaction Analyst","ENE 2024 — AGO 2025":"JAN 2024 — AUG 2025","Monitoreo, validación y procesamiento de transacciones financieras.":"Monitored, validated, and processed financial transactions.","Conciliaciones bancarias y revisión de saldos para identificar discrepancias operativas.":"Performed bank reconciliations and balance reviews to identify operational discrepancies.","Extracción y consolidación de datos mediante SQL para reportes, auditoría y tableros de control.":"Extracted and consolidated data with SQL for reporting, audits, and control dashboards.","Análisis de anomalías transaccionales y coordinación con equipos de TI para identificar causas raíz.":"Analyzed transaction anomalies and coordinated with IT teams to identify root causes.","FEB 2023 — DIC 2023":"FEB 2023 — DEC 2023","Independiente / Freelance":"Independent / Freelance","Desarrollo y soluciones digitales":"Development & Digital Solutions","Desarrollador web y consultor en automatización con IA":"Web Developer & AI Automation Consultant","Diseño, desarrollo y publicación de sitios web responsivos con JavaScript, HTML5 y CSS3.":"Designed, developed, and published responsive websites using JavaScript, HTML5, and CSS3.","Construcción de flujos con Make, integrando plataformas SaaS, CRM y formularios.":"Built workflows with Make, integrating SaaS platforms, CRMs, and forms.","Integración de modelos de IA mediante APIs para clasificación de solicitudes y optimización de procesos.":"Integrated AI models through APIs to classify requests and optimize processes.","Levantamiento de requerimientos y elaboración de documentación técnica y manuales de usuario.":"Gathered requirements and prepared technical documentation and user manuals.","AGO 2022 — FEB 2023":"AUG 2022 — FEB 2023","Soporte y atención de requerimientos":"Technical Support & Request Handling","Especialista en Soporte Técnico (N1 / N2)":"Technical Support Specialist (Tier 1 / Tier 2)","Diagnóstico, solución y escalamiento de incidentes de conectividad y redes LAN/WLAN.":"Diagnosed, resolved, and escalated connectivity and LAN/WLAN network incidents.","Configuración de módems y routers, y gestión de casos mediante mesa de ayuda.":"Configured modems and routers and managed cases through the service desk.","Seguimiento de acuerdos de nivel de servicio (SLA) y documentación de soluciones para la base de conocimiento.":"Monitored service-level agreements (SLAs) and documented solutions for the knowledge base.","AGO 2021 — JUL 2022":"AUG 2021 — JUL 2022","Gestión de información":"Information Management","Auxiliar de Datos y Gestión Documental":"Data & Document Management Assistant","Captura, validación y actualización de registros de inventario, compras y producción.":"Captured, validated, and updated inventory, purchasing, and production records.","Depuración de inconsistencias para preservar la integridad, exactitud y trazabilidad de los datos.":"Resolved inconsistencies to preserve data integrity, accuracy, and traceability.","La experiencia en BBVA corresponde a proyectos desarrollados a través de Inetum.":"My BBVA experience was gained through projects delivered via Inetum.","03 · TRABAJO APLICADO":"03 · SELECTED WORK","aplicaciones.":"applications.","Una selección de trabajos web y ejercicios técnicos. Los proyectos de práctica están identificados como tales.":"A selection of web projects and technical exercises. Practice projects are clearly identified as such.","INICIO PRODUCTOS ACABADOS CONTACTO":"HOME PRODUCTS FINISHES CONTACT","DISEÑO Y OPTIMIZACIÓN DE ESPACIOS":"SPACE DESIGN AND OPTIMIZATION","Muebles diseñados":"Custom-designed","a tu medida":"furniture","Diseño · Funcionalidad · Calidad":"Design · Functionality · Quality","PROYECTO WEB":"WEB PROJECT","Publicado":"Published","Desarrollo de un sitio web para un negocio de diseño y fabricación de muebles personalizados, con presentación de servicios y contenido adaptable a distintos dispositivos.":"Developed a website for a custom furniture design and manufacturing business, presenting its services through a responsive layout for different devices.","Visitar proyecto":"Visit project","BASES DE DATOS":"DATABASES","Práctica":"Practice","Análisis relacional con SQL":"Relational Data Analysis with SQL","Base de datos de práctica con clientes, productos y ventas para consultar, relacionar y resumir información mediante SQL, Excel y Power BI.":"Practice database covering customers, products, and sales, used to query, join, and summarize information with SQL, Excel, and Power BI.","Agregaciones":"Aggregations","Proyecto de aprendizaje aplicado":"Applied learning project","GOBIERNO DE DATOS":"DATA GOVERNANCE","Caso demostrativo":"Demonstration case","Modelo de responsabilidades y calidad":"Data Ownership & Quality Model","Propuesta demostrativa para organizar Data Owners, Data Stewards, metadatos y reglas de calidad en un dominio de información.":"A demonstration model for organizing Data Owners, Data Stewards, metadata, and quality rules within an information domain.","Ejemplo conceptual; no contiene información de clientes":"Conceptual example; contains no customer information","04 · CONOCIMIENTOS":"04 · EXPERTISE","técnicas.":"technical.","Herramientas y áreas de conocimiento presentes en mi experiencia y formación.":"Tools and areas of knowledge developed through my professional experience and training.","Gobierno y calidad de datos":"Data Governance & Quality","Experiencia aplicada":"Applied experience","Catalogación de metadatos":"Metadata cataloging","Diccionarios de datos":"Data dictionaries","Data Quality y trazabilidad":"Data quality & traceability","Bases de datos y SQL":"Databases & SQL","Experiencia y formación":"Experience & training","SQL y modelado relacional":"SQL & relational modeling","PostgreSQL en formación práctica":"PostgreSQL · Practical training","Extracción y consolidación":"Data extraction & consolidation","HTML5 · CSS3 · JavaScript ES6+":"HTML5 · CSS3 · JavaScript ES6+","APIs REST y webhooks":"REST APIs & webhooks","COBOL y procesamiento Batch":"COBOL & batch processing","Operaciones y soporte TI":"IT Operations & Support","Operaciones transaccionales":"Transaction operations","Conciliaciones financieras":"Financial reconciliations","Soporte N1/N2 · SLA · ITIL":"Tier 1/2 support · SLA · ITIL","Calidad y pruebas":"Quality & Testing","Conocimientos técnicos":"Technical knowledge","Integridad referencial":"Referential integrity","Pruebas unitarias en Java":"Java unit testing","Atención y documentación":"Customer Support & Documentation","Experiencia profesional":"Professional experience","Atención de requerimientos":"Request handling","Gestión de incidentes":"Incident management","Documentación técnica":"Technical documentation","Manuales y base de conocimiento":"User manuals & knowledge base","EN FORMACIÓN":"CURRENTLY LEARNING","Ampliando conocimientos en análisis de bases de datos.":"Expanding my knowledge of database analysis.","Actualmente fortaleciendo SQL, fundamentos de bases de datos y modelado relacional. También continúo aprendiendo Excel y automatización.":"Currently strengthening my SQL, database fundamentals, and relational modeling skills while continuing to learn Excel and automation.","05 · FORMACIÓN":"05 · EDUCATION","Formación y":"Education &","aprendizaje.":"training.","Base académica y formación técnica complementaria.":"Academic background and complementary technical training.","Ingeniería en Sistemas":"Systems Engineering","Técnico Analista de Programación, Redes y Bases de Datos":"Technical Diploma in Programming, Networking & Databases","Especialización técnica en COBOL, Batch, DB2, SQL y pruebas unitarias en Java":"Technical training in COBOL, Batch, DB2, SQL, and Java unit testing","Actual":"Current","Análisis de Bases de Datos":"Database Analysis","Formación complementaria · En curso":"Additional training · In progress","Fundamentos y Automatización de Procesos con IA":"AI Fundamentals & Process Automation","IDIOMAS":"LANGUAGES","Español":"Spanish","Nativo":"Native","Inglés":"English","Intermedio / técnico · Lectura e interpretación de documentación de software":"Intermediate / technical · Reading and understanding software documentation","06 · CONTACTO":"06 · CONTACT","Conversemos sobre tu":"Let's talk about your","próximo proyecto.":"next project.","Estoy abierto a oportunidades profesionales en datos, tecnología, operaciones y desarrollo de soluciones digitales.":"I am open to professional opportunities in data, technology, operations, and digital solution development.","Enviar un correo":"Send an email","CORREO":"EMAIL","TELÉFONO":"PHONE","WHATSAPP":"WHATSAPP","Enviar mensaje":"Send a message","Sebastian Bernal. Portafolio profesional.":"Sebastian Bernal. Professional portfolio."}};

    function closeLanguageMenu() {
        if (!languageMenu || !languageToggle) return;
        languageMenu.hidden = true;
        languageToggle.setAttribute('aria-expanded', 'false');
    }

    function openLanguageMenu() {
        if (!languageMenu || !languageToggle) return;
        languageMenu.hidden = false;
        languageToggle.setAttribute('aria-expanded', 'true');
    }

    function applyLanguage(language) {
        const selected = language === 'en' ? 'en' : 'es';
        const spanishTranslations = Object.fromEntries(
            Object.entries(translations.en).map(([spanish, english]) => [english, spanish])
        );
        const dictionary = selected === 'en' ? translations.en : spanishTranslations;
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        while (walker.nextNode()) nodes.push(walker.currentNode);

        nodes.forEach(node => {
            const original = node.nodeValue;
            const trimmed = original.trim();
            if (!trimmed) return;

            const translated = dictionary[trimmed];
            if (translated) {
                const leading = original.match(/^\s*/)?.[0] || '';
                const trailing = original.match(/\s*$/)?.[0] || '';
                node.nodeValue = leading + translated + trailing;
            }
        });

        // Translate interface attributes and document metadata.
        document.documentElement.lang = selected;
        document.title = selected === 'en'
            ? 'Sebastián Bernal | Systems Engineer · Data & Technology'
            : 'Sebastián Bernal | Ingeniero de Sistemas · Datos y Tecnología';

        const description = document.querySelector('meta[name="description"]');
        if (description) {
            description.content = selected === 'en'
                ? 'Professional portfolio of Sebastián Bernal Ramírez, Systems Engineer with experience as a Junior Analyst on financial-sector projects, transaction operations, web development, and technical support.'
                : 'Portafolio profesional de Sebastián Bernal Ramírez, Ingeniero de Sistemas con experiencia como Analista Junior en proyectos del sector financiero, operaciones transaccionales, desarrollo web y soporte tecnológico.';
        }

        const brand = document.querySelector('.brand');
        if (brand) brand.setAttribute('aria-label', selected === 'en' ? 'Sebastian Bernal, go to home' : 'Sebastian Bernal, ir al inicio');
        const primaryNavigation = document.getElementById('primaryNav');
        if (primaryNavigation) primaryNavigation.setAttribute('aria-label', selected === 'en' ? 'Primary navigation' : 'Navegación principal');

        if (menuToggle) {
            const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
            menuToggle.setAttribute('aria-label', expanded
                ? (selected === 'en' ? 'Close menu' : 'Cerrar menú')
                : (selected === 'en' ? 'Open menu' : 'Abrir menú'));
        }

        if (languageToggle) {
            languageToggle.setAttribute('aria-label', selected === 'en' ? 'Change language' : 'Cambiar idioma');
        }

        const educationNavLink = document.querySelector('.nav-link[href="#formacion"]');
        if (educationNavLink) educationNavLink.textContent = selected === 'en' ? 'Education' : 'Formación';

        if (currentLanguageLabel) currentLanguageLabel.textContent = selected.toUpperCase();
        languageOptions.forEach(option => {
            const active = option.dataset.language === selected;
            option.classList.toggle('active', active);
            option.setAttribute('aria-current', active ? 'true' : 'false');
        });

        currentLanguage = selected;
        try { localStorage.setItem('sebastianPortfolioLanguage', selected); } catch (_) {}
        closeLanguageMenu();
    }

    if (languageToggle && languageMenu) {
        languageToggle.addEventListener('click', event => {
            event.stopPropagation();
            if (languageMenu.hidden) openLanguageMenu();
            else closeLanguageMenu();
        });

        languageOptions.forEach(option => {
            option.addEventListener('click', () => applyLanguage(option.dataset.language));
        });

        document.addEventListener('click', event => {
            if (languageSwitcher && !languageSwitcher.contains(event.target)) closeLanguageMenu();
        });
    }

    let savedLanguage = 'es';
    try {
        const stored = localStorage.getItem('sebastianPortfolioLanguage');
        if (stored === 'en' || stored === 'es') savedLanguage = stored;
    } catch (_) {}
    applyLanguage(savedLanguage);
});
