
import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'critical';
export type LogCategory = 'auth' | 'ui' | 'api' | 'database' | 'security' | 'performance' | 'system' | 'n8n' | 'user_action';

interface LogEntry {
  id?: string;
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  message: string;
  details?: any;
  userId?: string;
  sessionId?: string;
  userAgent?: string;
  stackTrace?: string;
  resolved?: boolean;
}

interface LogMetrics {
  totalLogs: number;
  errorCount: number;
  warningCount: number;
  criticalCount: number;
  lastLogTime: string | null;
}

export const useSystemLogger = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<LogMetrics>({
    totalLogs: 0,
    errorCount: 0,
    warningCount: 0,
    criticalCount: 0,
    lastLogTime: null
  });
  const [isLogging, setIsLogging] = useState(false);
  const sessionId = useRef<string>(generateSessionId());

  // Generar ID de sesión único
  function generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Obtener información del contexto
  const getContext = useCallback(() => {
    return {
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
      sessionId: sessionId.current
    };
  }, []);

  // Log genérico con persistencia en Supabase
  const log = useCallback(async (
    level: LogLevel, 
    category: LogCategory, 
    message: string, 
    details?: any,
    stackTrace?: string
  ) => {
    const context = getContext();
    const logEntry: LogEntry = {
      timestamp: context.timestamp,
      level,
      category,
      message,
      details: details ? JSON.stringify(details) : null,
      sessionId: context.sessionId,
      userAgent: context.userAgent,
      stackTrace,
      resolved: false
    };

    // Log en consola con formato mejorado
    const consolePrefix = `[${level.toUpperCase()}] [${category.toUpperCase()}] ${context.timestamp}`;
    const consoleStyle = getConsoleStyle(level);
    
    console.log(`%c${consolePrefix}`, consoleStyle, message, details || '');
    
    if (stackTrace) {
      console.log(`%cStack Trace:`, 'color: #666; font-style: italic;', stackTrace);
    }

    // Actualizar estado local
    setLogs(prev => [logEntry, ...prev.slice(0, 999)]); // Mantener solo los últimos 1000 logs
    
    // Actualizar métricas
    setMetrics(prev => ({
      totalLogs: prev.totalLogs + 1,
      errorCount: prev.errorCount + (level === 'error' || level === 'critical' ? 1 : 0),
      warningCount: prev.warningCount + (level === 'warn' ? 1 : 0),
      criticalCount: prev.criticalCount + (level === 'critical' ? 1 : 0),
      lastLogTime: context.timestamp
    }));

    // Persistir en Supabase si es importante
    if (['error', 'critical', 'warn'].includes(level)) {
      try {
        setIsLogging(true);
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.functions.invoke('log-system-event', {
          body: {
            ...logEntry,
            userId: user?.id,
            ipAddress: await getClientIP(),
          }
        });
      } catch (error) {
        console.error('Error al persistir log:', error);
      } finally {
        setIsLogging(false);
      }
    }
  }, []);

  // Funciones específicas de logging
  const logDebug = useCallback((category: LogCategory, message: string, details?: any) => {
    log('debug', category, message, details);
  }, [log]);

  const logInfo = useCallback((category: LogCategory, message: string, details?: any) => {
    log('info', category, message, details);
  },  [log]);

  const logWarning = useCallback((category: LogCategory, message: string, details?: any) => {
    log('warn', category, message, details);
  }, [log]);

  const logError = useCallback((category: LogCategory, message: string, error?: Error, details?: any) => {
    const stackTrace = error?.stack || new Error().stack;
    log('error', category, message, { ...details, error: error?.message }, stackTrace);
  }, [log]);

  const logCritical = useCallback((category: LogCategory, message: string, error?: Error, details?: any) => {
    const stackTrace = error?.stack || new Error().stack;
    log('critical', category, message, { ...details, error: error?.message }, stackTrace);
  }, [log]);

  // Log de acciones de usuario
  const logUserAction = useCallback((action: string, details?: any) => {
    logInfo('user_action', `User action: ${action}`, details);
  }, [logInfo]);

  // Log de rendimiento
  const logPerformance = useCallback((operation: string, duration: number, details?: any) => {
    const level: LogLevel = duration > 5000 ? 'warn' : duration > 2000 ? 'info' : 'debug';
    log(level, 'performance', `${operation} took ${duration}ms`, details);
  }, [log]);

  // Obtener IP del cliente (aproximada)
  const getClientIP = async (): Promise<string> => {
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      const data = await response.json();
      return data.ip;
    } catch {
      return 'unknown';
    }
  };

  // Obtener logs filtrados
  const getFilteredLogs = useCallback((
    level?: LogLevel, 
    category?: LogCategory, 
    limit?: number
  ) => {
    let filteredLogs = logs;
    
    if (level) {
      filteredLogs = filteredLogs.filter(log => log.level === level);
    }
    
    if (category) {
      filteredLogs = filteredLogs.filter(log => log.category === category);
    }
    
    if (limit) {
      filteredLogs = filteredLogs.slice(0, limit);
    }
    
    return filteredLogs;
  }, [logs]);

  // Limpiar logs antiguos
  const clearLogs = useCallback(() => {
    setLogs([]);
    setMetrics({
      totalLogs: 0,
      errorCount: 0,
      warningCount: 0,
      criticalCount: 0,
      lastLogTime: null
    });
    logInfo('system', 'Logs cleared by user');
  }, [logInfo]);

  // Exportar logs
  const exportLogs = useCallback((format: 'json' | 'csv' = 'json') => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `system-logs-${timestamp}.${format}`;
    
    let content: string;
    
    if (format === 'json') {
      content = JSON.stringify(logs, null, 2);
    } else {
      const headers = ['timestamp', 'level', 'category', 'message', 'details'];
      const csvContent = [
        headers.join(','),
        ...logs.map(log => [
          log.timestamp,
          log.level,
          log.category,
          `"${log.message.replace(/"/g, '""')}"`,
          `"${log.details ? log.details.replace(/"/g, '""') : ''}"`
        ].join(','))
      ].join('\n');
      content = csvContent;
    }
    
    const blob = new Blob([content], { type: format === 'json' ? 'application/json' : 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
    
    logInfo('system', `Logs exported as ${format}`, { filename, logCount: logs.length });
  }, [logs, logInfo]);

  return {
    // Funciones de logging
    logDebug,
    logInfo,
    logWarning,
    logError,
    logCritical,
    logUserAction,
    logPerformance,
    
    // Gestión de logs
    logs,
    metrics,
    isLogging,
    getFilteredLogs,
    clearLogs,
    exportLogs,
    
    // Utilidades
    sessionId: sessionId.current
  };
};

// Estilos para consola
function getConsoleStyle(level: LogLevel): string {
  switch (level) {
    case 'debug':
      return 'color: #6B7280; background: #F9FAFB; padding: 2px 6px; border-radius: 3px;';
    case 'info':
      return 'color: #1D4ED8; background: #DBEAFE; padding: 2px 6px; border-radius: 3px;';
    case 'warn':
      return 'color: #D97706; background: #FEF3C7; padding: 2px 6px; border-radius: 3px;';
    case 'error':
      return 'color: #DC2626; background: #FEE2E2; padding: 2px 6px; border-radius: 3px;';
    case 'critical':
      return 'color: #FFFFFF; background: #DC2626; padding: 2px 6px; border-radius: 3px; font-weight: bold;';
    default:
      return 'color: #374151; background: #F3F4F6; padding: 2px 6px; border-radius: 3px;';
  }
}

export default useSystemLogger;
