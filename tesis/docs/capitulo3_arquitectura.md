# Capítulo 3: Diseño y Arquitectura del Sistema "Agora"

## 3.1 Mapa Sinóptico de la Arquitectura General

```mermaid
graph TD
    subgraph "Usuario Final (PWA en Netlify)"
        A[Estratega / Líder / Candidato]
    end

    A -- HTTPS --> B(Proxy Inverso en VPS)

    subgraph "Infraestructura VPS (Hostinger con Docker)"
        B -- Peticiones API / WebSockets --> C{n8n - Orquestador}
        C -- Lee/Escribe Estado, Tareas, Caché --> D[(Redis - Memoria Central)]
        C -- Consultas de Razonamiento --> E((API de Google Gemini))
        C -- Persistencia de Flujos --> F[(PostgreSQL)]
    end

    subgraph "Ecosistema Externo"
        E
        G((APIs de Google Workspace))
    end

    C -- Sincronización --> G

    style A fill:#cde4ff
    style B fill:#f9f9f9
    style C fill:#90ee90
    style D fill:#ff6347
    style E fill:#f0e68c
    style F fill:#add8e6
```

**Descripción:**
Este mapa sinóptico ilustra la arquitectura de alto nivel. El usuario interactúa con la PWA, cuyas peticiones son dirigidas por un proxy al contenedor de n8n. n8n actúa como el cerebro de operaciones, utilizando Redis como su memoria de trabajo, PostgreSQL para su propia persistencia, y llamando a APIs externas como Gemini y Google Workspace para inteligencia y sincronización.

---

## 3.2 Flujograma del Proceso de Autenticación y Enrutamiento Basado en Roles

```mermaid
flowchart TD
    Start[Usuario ingresa credenciales en la PWA] --> A{PWA envía POST a /auth/login};
    A --> B[Flujo n8n 'Auth' se activa];
    B --> C{Verificar credenciales contra BBDD};
    C -- Exitoso --> D[Consultar Rol del Usuario];
    C -- Fallido --> E[Devolver Error 401];
    D --> F[Generar JSON Web Token (JWT) con Rol];
    F --> G[Devolver JWT a la PWA];
    G --> H{PWA guarda JWT y lee el Rol};
    H --> I{Switch (Rol)};
    I -- Rol: Líder --> J[Redirigir a /dashboard/lider];
    I -- Rol: Candidato --> K[Redirigir a /dashboard/candidato];
    I -- Rol: Estratega --> L[Redirigir a /dashboard/estrategia];
    E --> End[Mostrar mensaje de error en PWA];
    J & K & L --> EndOK[Usuario ve su dashboard personalizado];
```

**Descripción:**
Este flujograma detalla el proceso seguro de inicio de sesión. Muestra cómo n8n centraliza la lógica de autenticación y cómo la PWA utiliza el rol contenido en el JWT para dirigir al usuario a la interfaz correcta, garantizando una experiencia personalizada y segura.

---

## 3.5 Flujograma del Bucle de Auto-Mejora de Agora

```mermaid
flowchart TD
    A(Inicio: CRON Job diario en n8n) --> B{Paso 1: Recopilar KPIs};
    B --> C[Leer métricas de rendimiento de todos los agentes desde Hashes en Redis];
    C --> D{Paso 2: Análisis y Razonamiento};
    D --> E[Enviar métricas a Gemini con Meta-Prompt de optimización];
    E --> F{Paso 3: Obtener Sugerencias};
    F --> G[Recibir de Gemini un análisis y sugerencias de mejora en formato JSON];
    G --> H{Paso 4: Aplicar Mejoras};
    H --> I[Parsear el JSON y actualizar los prompts/configuraciones de los agentes en Redis];
    I --> J(Fin: Agentes operan con estrategia optimizada);
    J --> A;
```

**Descripción:**
Este es el corazón del sistema adaptativo. El flujograma visualiza el proceso autónomo mediante el cual Agora evalúa el rendimiento, utiliza la IA para razonar sobre posibles mejoras, y modifica dinámicamente el comportamiento de sus agentes subordinados para mejorar la eficacia de la campaña. 