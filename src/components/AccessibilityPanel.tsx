
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAccessibility } from './AccessibilityProvider';
import { 
  Accessibility, 
  Eye, 
  Type, 
  MousePointer, 
  Keyboard, 
  Volume2,
  Palette,
  Settings,
  X,
  Check
} from 'lucide-react';

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const AccessibilityPanel = ({ isOpen, onClose }: AccessibilityPanelProps) => {
  const { settings, updateSetting, announceToScreenReader } = useAccessibility();

  if (!isOpen) return null;

  const handleToggle = (key: keyof typeof settings, value: boolean) => {
    updateSetting(key, value);
    announceToScreenReader(`${key} ${value ? 'activado' : 'desactivado'}`);
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Accessibility className="w-6 h-6" />
              Accesibilidad
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
              aria-label="Cerrar panel de accesibilidad"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Configuraciones Visuales */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900">
              <Eye className="w-5 h-5" />
              Configuraciones Visuales
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="high-contrast">Alto Contraste</Label>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(value) => handleToggle('highContrast', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="large-text">Texto Grande</Label>
                <Switch
                  id="large-text"
                  checked={settings.largeText}
                  onCheckedChange={(value) => handleToggle('largeText', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="reduce-motion">Reducir Movimiento</Label>
                <Switch
                  id="reduce-motion"
                  checked={settings.reduceMotion}
                  onCheckedChange={(value) => handleToggle('reduceMotion', value)}
                />
              </div>
            </div>
          </div>

          {/* Tamaño de Fuente */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900">
              <Type className="w-5 h-5" />
              Tamaño de Texto
            </h3>
            
            <Select 
              value={settings.fontSize} 
              onValueChange={(value) => updateSetting('fontSize', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tamaño" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Pequeño</SelectItem>
                <SelectItem value="medium">Mediano</SelectItem>
                <SelectItem value="large">Grande</SelectItem>
                <SelectItem value="xl">Extra Grande</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tema de Color */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900">
              <Palette className="w-5 h-5" />
              Tema de Color
            </h3>
            
            <Select 
              value={settings.colorTheme} 
              onValueChange={(value) => updateSetting('colorTheme', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar tema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Predeterminado</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="high-contrast">Alto Contraste</SelectItem>
                <SelectItem value="protanopia">Protanopia</SelectItem>
                <SelectItem value="deuteranopia">Deuteranopia</SelectItem>
                <SelectItem value="tritanopia">Tritanopia</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Configuraciones de Navegación */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 font-semibold text-gray-900">
              <MousePointer className="w-5 h-5" />
              Navegación
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="keyboard-nav">Navegación por Teclado</Label>
                <Switch
                  id="keyboard-nav"
                  checked={settings.keyboardNavigation}
                  onCheckedChange={(value) => handleToggle('keyboardNavigation', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="screen-reader">Lector de Pantalla</Label>
                <Switch
                  id="screen-reader"
                  checked={settings.screenReader}
                  onCheckedChange={(value) => handleToggle('screenReader', value)}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="voice-control">Control por Voz</Label>
                <Switch
                  id="voice-control"
                  checked={settings.voiceControl}
                  onCheckedChange={(value) => handleToggle('voiceControl', value)}
                />
              </div>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => {
                // Restablecer a configuraciones predeterminadas
                Object.keys(settings).forEach(key => {
                  const defaultValue = typeof settings[key as keyof typeof settings] === 'boolean' ? false : 
                                     key === 'fontSize' ? 'medium' : 'default';
                  updateSetting(key as keyof typeof settings, defaultValue);
                });
                announceToScreenReader('Configuraciones de accesibilidad restablecidas');
              }}
              variant="outline"
              className="flex-1"
            >
              Restablecer
            </Button>
            
            <Button
              onClick={onClose}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <Check className="w-4 h-4 mr-2" />
              Aplicar
            </Button>
          </div>

          {/* Información de Atajos */}
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2 flex items-center gap-2">
              <Keyboard className="w-4 h-4" />
              Atajos de Teclado
            </h4>
            <div className="text-sm text-blue-800 space-y-1">
              <div><kbd className="bg-white px-2 py-1 rounded text-xs">Alt + A</kbd> - Abrir panel de accesibilidad</div>
              <div><kbd className="bg-white px-2 py-1 rounded text-xs">Tab</kbd> - Navegar entre elementos</div>
              <div><kbd className="bg-white px-2 py-1 rounded text-xs">Enter</kbd> - Activar elemento</div>
              <div><kbd className="bg-white px-2 py-1 rounded text-xs">Esc</kbd> - Cerrar panel</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AccessibilityPanel;
