
import { useCallback } from 'react';
import { useSystemLogger, LogCategory } from './useSystemLogger';
import { toast } from '@/hooks/use-toast';

interface ErrorContext {
  category?: LogCategory;
  severity?: 'low' | 'medium' | 'high' | 'critical';
  userFriendly?: boolean;
  showToast?: boolean;
  metadata?: Record<string, any>;
}

interface ErrorAnalysis {
  type: 'network' | 'validation' | 'permission' | 'system' | 'user' | 'unknown';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userMessage: string;
  developerMessage: string;
  suggestedAction?: string;
}

export const useErrorHandler = () => {
  const { logError, logCritical, logWarning } = useSystemLogger();

  // Analizar error para determinar tipo y severidad
  const analyzeError = useCallback((error: Error | unknown): ErrorAnalysis => {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    // Análisis basado en patrones comunes
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('NETWORK_ERROR')) {
      return {
        type: 'network',
        severity: 'medium',
        userMessage: 'Problema de conexión. Verifica tu internet e intenta nuevamente.',
        developerMessage: errorMessage,
        suggestedAction: 'Retry operation'
      };
    }

    if (errorMessage.includes('401') || errorMessage.includes('unauthorized')) {
      return {
        type: 'permission',
        severity: 'high',
        userMessage: 'Tu sesión ha expirado. Por favor inicia sesión nuevamente.',
        developerMessage: errorMessage,
        suggestedAction: 'Redirect to login'
      };
    }

    if (errorMessage.includes('403') || errorMessage.includes('forbidden')) {
      return {
        type: 'permission',
        severity: 'high',
        userMessage: 'No tienes permisos para realizar esta acción.',
        developerMessage: errorMessage,
        suggestedAction: 'Check user permissions'
      };
    }

    if (errorMessage.includes('validation') || errorMessage.includes('invalid')) {
      return {
        type: 'validation',
        severity: 'low',
        userMessage: 'Los datos proporcionados no son válidos. Revisa los campos.',
        developerMessage: errorMessage,
        suggestedAction: 'Validate input data'
      };
    }

    if (errorMessage.includes('database') || errorMessage.includes('SQL') || errorMessage.includes('constraint')) {
      return {
        type: 'system',
        severity: 'critical',
        userMessage: 'Error interno del sistema. El equipo técnico ha sido notificado.',
        developerMessage: errorMessage,
        suggestedAction: 'Check database connection and constraints'
      };
    }

    if (errorMessage.includes('timeout') || errorMessage.includes('TIMEOUT')) {
      return {
        type: 'network',
        severity: 'medium',
        userMessage: 'La operación tardó demasiado. Intenta nuevamente.',
        developerMessage: errorMessage,
        suggestedAction: 'Optimize operation or increase timeout'
      };
    }

    // Error desconocido
    return {
      type: 'unknown',
      severity: 'medium',
      userMessage: 'Ocurrió un error inesperado. Intenta nuevamente.',
      developerMessage: errorMessage,
      suggestedAction: 'Investigate error pattern'
    };
  }, []);

  // Manejar error con contexto completo
  const handleError = useCallback((
    error: Error | unknown,
    operation: string,
    context: ErrorContext = {}
  ) => {
    const analysis = analyzeError(error);
    const {
      category = 'system',
      severity = analysis.severity,
      userFriendly = true,
      showToast = true,
      metadata = {}
    } = context;

    // Preparar detalles del error
    const errorDetails = {
      operation,
      analysis,
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: new Date().toISOString(),
        ...metadata
      },
      originalError: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : { value: String(error) }
    };

    // Log basado en severidad
    if (severity === 'critical') {
      logCritical(category, `${operation}: ${analysis.developerMessage}`, error as Error, errorDetails);
    } else if (severity === 'high') {
      logError(category, `${operation}: ${analysis.developerMessage}`, error as Error, errorDetails);
    } else {
      logWarning(category, `${operation}: ${analysis.developerMessage}`, errorDetails);
    }

    // Mostrar toast al usuario si está habilitado
    if (showToast && userFriendly) {
      toast({
        title: "Error",
        description: analysis.userMessage,
        variant: severity === 'critical' || severity === 'high' ? 'destructive' : 'default',
        duration: severity === 'critical' ? 8000 : 5000
      });
    }

    // Para errores críticos, se podría enviar notificación adicional
    if (severity === 'critical') {
      // Aquí se podría integrar con servicios de monitoreo externos
      console.error('🚨 CRITICAL ERROR DETECTED 🚨', errorDetails);
    }

    return analysis;
  }, [analyzeError, logCritical, logError, logWarning]);

  // Wrapper para promesas async
  const handleAsyncError = useCallback((
    promise: Promise<any>,
    operation: string,
    context: ErrorContext = {}
  ) => {
    return promise.catch((error) => {
      handleError(error, operation, context);
      throw error; // Re-throw para que el caller pueda manejar si necesario
    });
  }, [handleError]);

  // Boundary de error global
  const createErrorBoundary = useCallback((
    operation: string,
    context: ErrorContext = {}
  ) => {
    return (error: Error, errorInfo: any) => {
      handleError(error, `Error Boundary: ${operation}`, {
        ...context,
        metadata: {
          ...context.metadata,
          errorInfo,
          componentStack: errorInfo.componentStack
        }
      });
    };
  }, [handleError]);

  // Recuperación automática para operaciones
  const withRetry = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string,
    maxRetries: number = 3,
    delay: number = 1000,
    context: ErrorContext = {}
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;
        
        if (attempt === maxRetries) {
          handleError(error, `${operationName} (final attempt ${attempt}/${maxRetries})`, {
            ...context,
            metadata: {
              ...context.metadata,
              attempt,
              maxRetries
            }
          });
          throw error;
        }
        
        handleError(error, `${operationName} (attempt ${attempt}/${maxRetries})`, {
          ...context,
          severity: 'low',
          showToast: false,
          metadata: {
            ...context.metadata,
            attempt,
            maxRetries,
            willRetry: true
          }
        });
        
        // Esperar antes del siguiente intento
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
    
    throw lastError!;
  }, [handleError]);

  // Validador de datos
  const validateAndHandle = useCallback(<T>(
    data: T,
    validator: (data: T) => boolean | string,
    operation: string,
    context: ErrorContext = {}
  ): T => {
    const validationResult = validator(data);
    
    if (typeof validationResult === 'string') {
      const error = new Error(validationResult);
      handleError(error, `Validation failed for ${operation}`, {
        ...context,
        category: 'system', // Changed from 'validation' to 'system'
        metadata: {
          ...context.metadata,
          data: typeof data === 'object' ? JSON.stringify(data) : String(data)
        }
      });
      throw error;
    }
    
    if (!validationResult) {
      const error = new Error(`Validation failed for ${operation}`);
      handleError(error, `Validation failed for ${operation}`, {
        ...context,
        category: 'system' // Changed from 'validation' to 'system'
      });
      throw error;
    }
    
    return data;
  }, [handleError]);

  return {
    handleError,
    handleAsyncError,
    createErrorBoundary,
    withRetry,
    validateAndHandle,
    analyzeError
  };
};

export default useErrorHandler;
