
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Accessibility } from 'lucide-react';
import AccessibilityPanel from './AccessibilityPanel';
import { useAccessibility } from './AccessibilityProvider';

const FloatingAccessibilityButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { announceToScreenReader } = useAccessibility();

  const handleToggle = () => {
    setIsOpen(!isOpen);
    announceToScreenReader(isOpen ? 'Panel de accesibilidad cerrado' : 'Panel de accesibilidad abierto');
  };

  return (
    <>
      <Button
        onClick={handleToggle}
        className="fixed bottom-20 right-4 z-40 bg-blue-600 hover:bg-blue-700 text-white rounded-full w-14 h-14 shadow-2xl border-2 border-white"
        aria-label="Abrir configuraciones de accesibilidad"
        title="Configuraciones de Accesibilidad (Alt + A)"
      >
        <Accessibility className="w-6 h-6" />
      </Button>
      
      <AccessibilityPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
};

export default FloatingAccessibilityButton;
