import React from 'react';
import { ModernNavigation } from './ModernNavigation';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Settings, 
  Download, 
  Share2, 
  MoreHorizontal,
  Brain,
  Zap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface ModernPageLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  icon?: React.ComponentType<any>;
  actions?: Array<{
    label: string;
    icon: React.ComponentType<any>;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  }>;
  showBackButton?: boolean;
  className?: string;
}

export const ModernPageLayout: React.FC<ModernPageLayoutProps> = ({
  children,
  title,
  subtitle,
  icon: Icon,
  actions = [],
  showBackButton = false,
  className = ""
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ModernNavigation />
      
      <main className="flex-1 overflow-auto">
        <div className={`p-6 ${className}`}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {showBackButton && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(-1)}
                    className="p-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </Button>
                )}
                
                <div className="flex items-center gap-3">
                  {Icon && (
                    <div className="p-3 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl">
                      <Icon className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-1">
                      {title}
                    </h1>
                    {subtitle && (
                      <p className="text-gray-600">
                        {subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Acciones */}
              {actions.length > 0 && (
                <div className="flex items-center gap-2">
                  {actions.map((action, index) => {
                    const ActionIcon = action.icon;
                    return (
                      <Button
                        key={index}
                        variant={action.variant || 'outline'}
                        size="sm"
                        onClick={action.onClick}
                        className="flex items-center gap-2"
                      >
                        <ActionIcon className="w-4 h-4" />
                        {action.label}
                      </Button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Contenido */}
          <div className="space-y-6">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// Componente de sección moderna
export const ModernSection = ({ 
  title, 
  children, 
  icon: Icon,
  className = "" 
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ComponentType<any>;
  className?: string;
}) => (
  <Card className={`border-0 shadow-lg ${className}`}>
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        {Icon && <Icon className="w-5 h-5 text-blue-600" />}
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {children}
    </CardContent>
  </Card>
);

// Componente de estadística moderna
export const ModernStat = ({ 
  title, 
  value, 
  change, 
  icon: Icon,
  color = "blue" 
}: {
  title: string;
  value: string | number;
  change?: string;
  icon?: React.ComponentType<any>;
  color?: string;
}) => (
  <Card className="border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        {Icon && (
          <div className={`p-3 rounded-xl bg-${color}-100`}>
            <Icon className={`w-6 h-6 text-${color}-600`} />
          </div>
        )}
        {change && (
          <Badge 
            variant={change.startsWith('+') ? 'default' : 'secondary'}
            className="text-xs"
          >
            {change}
          </Badge>
        )}
      </div>
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-1">{value}</h3>
        <p className="text-sm text-gray-600">{title}</p>
      </div>
    </CardContent>
  </Card>
);

// Componente de estado del sistema
export const SystemStatusIndicator = ({ 
  status, 
  service 
}: {
  status: 'online' | 'warning' | 'error';
  service: string;
}) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${
      status === 'online' ? 'bg-green-500' : 
      status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
    }`} />
    <span className="text-sm font-medium capitalize">{service}</span>
    <Badge 
      variant={status === 'online' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}
      className="text-xs"
    >
      {status}
    </Badge>
  </div>
); 