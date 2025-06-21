# Guía de Ejecución Multiplataforma - Agora Pro

Este documento proporciona una guía detallada para instalar, configurar y ejecutar la aplicación en diferentes plataformas: Web, Android y iOS.

## 1. Análisis del Sistema

- **Framework**: React con Vite y TypeScript.
- **UI**: Tailwind CSS y Shadcn/ui.
- **Multiplataforma**: Capacitor para la compilación nativa en Android e iOS.
- **Backend**: Integración con Supabase.

## 2. Prerrequisitos de Software

Asegúrate de tener instalado el siguiente software:

- **Node.js (v18 o superior)**: Incluye npm. [Descargar](https://nodejs.org/)
- **Android Studio**: Para compilación en Android. [Descargar](https://developer.android.com/studio)
- **Xcode (solo macOS)**: Para compilación en iOS. (Desde la Mac App Store)
- **CocoaPods (solo macOS)**: Gestor de dependencias para iOS. Se instala con `sudo gem install cocoapods`.

## 3. Pasos de Instalación Inicial

1.  **Clonar el repositorio** (si aplica).
2.  **Abrir una terminal** en la raíz del proyecto.
3.  **Instalar dependencias de Node.js**:
    ```bash
    npm install
    ```

## 4. Ejecución en la Web

### Modo Desarrollo
Ideal para programar y ver cambios en tiempo real.

```bash
npm run dev
```
Luego, abre tu navegador en la URL que se muestra en la terminal (usualmente `http://localhost:5173`).

### Modo Producción
Para desplegar la aplicación en un servidor web.

1.  **Compilar la aplicación**:
    ```bash
    npm run build
    ```
2.  El comando creará una carpeta `dist`. Sube el contenido de esta carpeta a tu proveedor de hosting (Netlify, Vercel, etc.).

## 5. Ejecución en Android

1.  **Sincronizar los recursos web**:
    Cada vez que hagas cambios significativos en el código web, ejecuta este comando para copiarlos al proyecto nativo.
    ```bash
    npm run build
    npx cap sync android
    ```

2.  **Abrir en Android Studio**:
    ```bash
    npx cap open android
    ```

3.  **Ejecutar la App**:
    - Dentro de Android Studio, espera a que el proyecto se sincronice (Gradle Sync).
    - Selecciona un dispositivo virtual (AVD) o uno físico conectado.
    - Haz clic en el botón **Run 'app'** (icono de play verde).

## 6. Ejecución en iOS (Solo en macOS)

1.  **Sincronizar los recursos web**:
    ```bash
    npm run build
    npx cap sync ios
    ```

2.  **Actualizar dependencias de iOS (CocoaPods)**:
    Este comando es importante y debe ejecutarse si hay cambios en los plugins nativos.
    ```bash
    npx cap update ios
    ```

3.  **Abrir en Xcode**:
    ```bash
    npx cap open ios
    ```

4.  **Ejecutar la App**:
    - Dentro de Xcode, selecciona un Simulador o un dispositivo físico conectado.
    - Asegúrate de haber configurado un **Development Team** en la sección "Signing & Capabilities" del target `App`.
    - Haz clic en el botón de **Run** (icono de play).
