import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  RefreshCw, 
  Home, 
  Bug, 
  Shield, 
  Activity,
  XCircle,
  Info
} from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  errorId: string | null;
}

export class ModernErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `ERR_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Here you could send error to external service like Sentry
    // this.reportErrorToService(error, errorInfo);
  }

  private reportErrorToService = (error: Error, errorInfo: ErrorInfo) => {
    // Example implementation for error reporting service
    const errorReport = {
      errorId: this.state.errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Send to your error reporting service
    console.log('Error Report:', errorReport);
  };

  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null
    });
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default modern error UI
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl border-0 shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <XCircle className="w-8 h-8 text-red-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Algo salió mal
              </CardTitle>
              <p className="text-gray-600">
                Hemos detectado un error inesperado en el sistema
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Error Details */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Bug className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Detalles del Error (Solo Desarrollo)</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <span className="text-xs font-medium text-gray-500">Mensaje:</span>
                      <p className="text-sm text-gray-900 font-mono bg-white p-2 rounded border">
                        {this.state.error.message}
                      </p>
                    </div>
                    {this.state.errorId && (
                      <div>
                        <span className="text-xs font-medium text-gray-500">ID del Error:</span>
                        <p className="text-sm text-gray-900 font-mono bg-white p-2 rounded border">
                          {this.state.errorId}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* System Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-medium text-green-700">Sistema Operativo</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm font-medium text-blue-700">IA Activa</span>
                </div>
                <div className="flex items-center gap-2 p-3 bg-yellow-50 rounded-lg">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-yellow-700">Error Detectado</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={this.handleRetry}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reintentar
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <Home className="w-4 h-4" />
                  Ir al Inicio
                </Button>
                <Button 
                  variant="outline"
                  onClick={this.handleReload}
                  className="flex-1 flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Recargar
                </Button>
              </div>

              {/* Support Information */}
              <div className="text-center pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-500">¿Necesitas ayuda?</span>
                </div>
                <p className="text-xs text-gray-400">
                  Si el problema persiste, contacta al equipo de soporte técnico
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

// Hook para usar en componentes funcionales
export const useErrorHandler = () => {
  const [error, setError] = React.useState<Error | null>(null);

  const handleError = React.useCallback((error: Error) => {
    setError(error);
    console.error('Error caught by hook:', error);
  }, []);

  const clearError = React.useCallback(() => {
    setError(null);
  }, []);

  return { error, handleError, clearError };
};

// Componente de error para componentes específicos
export const ComponentErrorFallback = ({ 
  error, 
  resetErrorBoundary 
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) => (
  <Card className="border border-red-200 bg-red-50">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="w-5 h-5 text-red-600" />
        <span className="font-medium text-red-800">Error en Componente</span>
      </div>
      <p className="text-sm text-red-700 mb-3">
        {error.message}
      </p>
      <Button 
        size="sm" 
        variant="outline"
        onClick={resetErrorBoundary}
        className="text-red-600 border-red-300 hover:bg-red-100"
      >
        Reintentar
      </Button>
    </CardContent>
  </Card>
); 