
/*
 * Copyright © 2025 sademarquezDLL. Todos los derechos reservados.
 */

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MapPin, 
  AlertTriangle, 
  Users, 
  Vote,
  Heart,
  Phone,
  MessageCircle,
  Share2,
  Calendar,
  Trophy,
  Target,
  Star,
  Navigation,
  Zap,
  Globe,
  Sparkles,
  TrendingUp
} from 'lucide-react';

interface Territory {
  id: string;
  name: string;
  type: string;
  coordinates: any;
  population: number;
}

interface Alert {
  id: string;
  title: string;
  description: string;
  type: string;
  priority: string;
  coordinates: any;
  created_at: string;
}

interface Candidate {
  id: string;
  user_name: string;
  position: string;
  photo_url: string;
  slogan: string;
  proposals: string[];
  vote_count: number;
  party?: string;
}

// Mock data optimizado para captura de leads en Colombia
const mockTerritories: Territory[] = [
  { id: '1', name: 'Bogotá D.C.', type: 'capital', coordinates: { lat: 4.7110, lng: -74.0721 }, population: 7412566 },
  { id: '2', name: 'Medellín', type: 'ciudad', coordinates: { lat: 6.2442, lng: -75.5812 }, population: 2508452 },
  { id: '3', name: 'Cali', type: 'ciudad', coordinates: { lat: 3.3792, lng: -76.5225 }, population: 2227642 },
  { id: '4', name: 'Barranquilla', type: 'ciudad', coordinates: { lat: 10.9639, lng: -74.7964 }, population: 1274250 },
  { id: '5', name: 'Cartagena', type: 'ciudad', coordinates: { lat: 10.3910, lng: -75.4794 }, population: 1028736 },
  { id: '6', name: 'Soacha', type: 'municipio', coordinates: { lat: 4.5928, lng: -74.2280 }, population: 729895 },
  { id: '7', name: 'Soledad', type: 'municipio', coordinates: { lat: 10.9185, lng: -74.7641 }, population: 686598 },
  { id: '8', name: 'Bucaramanga', type: 'ciudad', coordinates: { lat: 7.1193, lng: -73.1227 }, population: 613400 }
];

const mockAlerts: { [key: string]: Alert[] } = {
  '1': [
    {
      id: '1',
      title: 'Oportunidad Electoral: Zona Norte',
      description: 'Alto interés político detectado en Suba y Usaquén. Momento ideal para contacto.',
      type: 'opportunity',
      priority: 'high',
      coordinates: { lat: 4.7110, lng: -74.0721 },
      created_at: new Date().toISOString()
    }
  ],
  '2': [
    {
      id: '2',
      title: 'Campaña Activa: Comuna 1',
      description: 'Actividad electoral intensa. Oportunidad para engagement ciudadano.',
      type: 'campaign',
      priority: 'medium',
      coordinates: { lat: 6.2442, lng: -75.5812 },
      created_at: new Date().toISOString()
    }
  ]
};

const mockCandidates: { [key: string]: Candidate[] } = {
  '1': [
    {
      id: '1',
      user_name: 'María González',
      position: 'Alcalde de Bogotá',
      photo_url: '/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png',
      slogan: '¡Bogotá que Avanza!',
      proposals: [
        '🏥 Sistema de salud universal y gratuito',
        '🎓 Educación técnica y universitaria accesible',
        '🚌 TransMilenio expandido y eficiente', 
        '🌳 Un parque por cada barrio de Bogotá',
        '💼 100,000 empleos dignos para jóvenes'
      ],
      vote_count: 245420,
      party: 'Movimiento Ciudadano'
    }
  ],
  '2': [
    {
      id: '2',
      user_name: 'Carlos Medina',
      position: 'Alcalde de Medellín',
      photo_url: '/lovable-uploads/83527a7a-6d3b-4edb-bdfc-312894177818.png',
      slogan: 'Medellín Innovadora',
      proposals: [
        '🚡 Metro expandido a toda la ciudad',
        '💡 Hub tecnológico latinoamericano',
        '🏠 Vivienda digna para todos',
        '🎭 Cultura y deporte en cada comuna'
      ],
      vote_count: 198750,
      party: 'Alianza por el Progreso'
    }
  ]
};

const VisitorFunnel = () => {
  const [selectedTerritory, setSelectedTerritory] = useState<string>('');
  const [sessionId] = useState(() => `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [showCandidateInfo, setShowCandidateInfo] = useState(false);
  const [voteIntention, setVoteIntention] = useState<string>('');
  const [leadCaptured, setLeadCaptured] = useState(false);
  const [engagementScore, setEngagementScore] = useState(0);

  const territories = mockTerritories;
  const alerts = selectedTerritory ? mockAlerts[selectedTerritory] || [] : [];
  const candidates = selectedTerritory ? mockCandidates[selectedTerritory] || [] : [];

  // Sistema de captura de leads mejorado
  const captureLeadData = async (type: string, data: any = {}) => {
    try {
      const leadData = {
        session_id: sessionId,
        interaction_type: type,
        timestamp: new Date().toISOString(),
        territory_id: selectedTerritory,
        user_data: {
          engagement_score: engagementScore,
          vote_probability: type === 'candidate_view' ? Math.random() * 100 : null,
          interests: data.interests || [],
          location: territories.find(t => t.id === selectedTerritory)?.name,
          contact_readiness: leadCaptured ? 'high' : 'medium'
        },
        gemini_analysis: {
          demographic_prediction: {
            age_range: '25-54',
            political_interest: 'high',
            engagement_level: engagementScore > 50 ? 'high' : 'medium'
          },
          lead_quality: leadCaptured ? 'qualified' : 'potential',
          next_action_recommended: type === 'vote_intention' ? 'contact_direct' : 'nurture_content'
        }
      };

      console.log(`🎯 Lead capturado: ${type}`, leadData);
      console.log(`📊 N8N Workflow: lead_${type}_${Date.now()}`);
      
      setEngagementScore(prev => Math.min(prev + 10, 100));
    } catch (error) {
      console.error('Error capturando lead:', error);
    }
  };

  // Auto-mostrar candidatos después de engagement
  useEffect(() => {
    if (selectedTerritory && alerts.length > 0 && !showCandidateInfo) {
      const timer = setTimeout(() => {
        setShowCandidateInfo(true);
        captureLeadData('candidate_auto_show', { triggered_by: 'engagement' });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [selectedTerritory, alerts.length, showCandidateInfo]);

  const handleTerritorySelect = (territoryId: string) => {
    setSelectedTerritory(territoryId);
    setShowCandidateInfo(false);
    captureLeadData('territory_select', { territory_id: territoryId });
  };

  const handleVoteIntention = async (candidateId: string, intention: string) => {
    setVoteIntention(`${intention}_${candidateId}`);
    setLeadCaptured(true);
    await captureLeadData('vote_intention', { 
      candidate_id: candidateId, 
      intention: intention,
      lead_qualified: true 
    });
  };

  const handleContactRequest = (candidateId: string) => {
    setLeadCaptured(true);
    captureLeadData('contact_request', { 
      candidate_id: candidateId, 
      contact_method: 'whatsapp',
      lead_qualified: true 
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto p-4">
      {/* Header Principal Optimizado */}
      <div className="relative bg-gradient-to-r from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-8 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.1\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"
        }}></div>
        
        <div className="relative z-10 text-center">
          <div className="flex justify-center items-center gap-3 mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center animate-pulse">
              <Vote className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold">¡Tu Voz Cuenta!</h1>
          </div>
          
          <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
            Descubre propuestas, conoce candidatos y participa en la democracia de tu región
          </p>
          
          <div className="flex justify-center items-center gap-6 flex-wrap">
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Globe className="w-5 h-5 text-green-400" />
              <span className="font-semibold">Colombia Democrática</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="font-semibold">IA Electoral</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <TrendingUp className="w-5 h-5 text-blue-400" />
              <span className="font-semibold">Engagement: {engagementScore}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de Territorio Mejorado */}
      <Card className="border-2 border-blue-200 shadow-xl bg-gradient-to-br from-white to-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-800 text-xl">
            <Navigation className="w-6 h-6" />
            Selecciona tu Ciudad o Región
            <Badge className="bg-blue-100 text-blue-800 ml-auto">
              <Zap className="w-3 h-3 mr-1" />
              Sistema Inteligente
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={selectedTerritory} onValueChange={handleTerritorySelect}>
            <SelectTrigger className="w-full h-16 text-lg border-2 border-blue-300 focus:border-blue-600 bg-white">
              <SelectValue placeholder="🗺️ ¿En qué ciudad vives? Encuentra tu información electoral..." />
            </SelectTrigger>
            <SelectContent>
              {territories.map((territory) => (
                <SelectItem key={territory.id} value={territory.id}>
                  <div className="flex items-center gap-4 py-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{territory.name}</div>
                      <div className="text-sm text-gray-600 capitalize">{territory.type}</div>
                      <div className="text-xs text-blue-600 font-semibold">
                        {territory.population?.toLocaleString()} habitantes
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          {selectedTerritory && (
            <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl">
              <div className="flex items-center gap-3 text-green-800">
                <Target className="w-6 h-6" />
                <div>
                  <span className="font-bold text-lg">
                    {territories.find(t => t.id === selectedTerritory)?.name} Activa
                  </span>
                  <p className="text-green-700 text-sm">
                    🤖 IA analizando tu región... Cargando propuestas personalizadas
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Contenido Principal */}
      {selectedTerritory && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mapa Inteligente de Oportunidades */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-orange-200">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                  Oportunidades Electorales
                  <Badge className="bg-orange-100 text-orange-800 ml-2">
                    {alerts.length} detectadas
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {alerts.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Trophy className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-800 mb-3">¡Región Próspera!</h3>
                    <p className="text-green-600 text-lg">
                      Tu zona está estable. Perfecto momento para conocer propuestas de futuro.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {alerts.map((alert) => (
                      <div 
                        key={alert.id} 
                        className="border-2 rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer hover:border-blue-400 bg-gradient-to-r from-white to-blue-50"
                        onClick={() => captureLeadData('alert_engagement', { alert_id: alert.id })}
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                            <Zap className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-xl text-gray-900 mb-2">{alert.title}</h4>
                            <p className="text-gray-700 text-lg mb-4">{alert.description}</p>
                            <div className="flex items-center gap-4">
                              <Badge className="bg-blue-100 text-blue-800 text-sm px-3 py-1">
                                {alert.type}
                              </Badge>
                              <span className="text-sm text-gray-500">
                                {new Date(alert.created_at).toLocaleDateString('es-CO')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Panel de Candidatos Optimizado */}
          <div className="space-y-6">
            {showCandidateInfo && candidates.length > 0 && (
              <Card className="border-2 border-purple-300 shadow-2xl bg-gradient-to-br from-white to-purple-50">
                <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
                  <CardTitle className="text-center flex items-center justify-center gap-2 text-lg">
                    <Vote className="w-6 h-6 text-yellow-300" />
                    Candidatos en tu Región
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  {candidates.slice(0, 2).map((candidate) => (
                    <div key={candidate.id} className="space-y-6 border-b pb-6 last:border-b-0">
                      {/* Foto y Info Básica */}
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-purple-300 shadow-lg">
                          <img 
                            src={candidate.photo_url} 
                            alt={candidate.user_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <h3 className="text-xl font-bold text-purple-900 mt-3">{candidate.user_name}</h3>
                        <p className="text-purple-700 font-semibold">{candidate.position}</p>
                        {candidate.party && (
                          <Badge className="mt-1 bg-purple-100 text-purple-800">{candidate.party}</Badge>
                        )}
                        <p className="text-purple-600 italic mt-2 text-lg">&quot;{candidate.slogan}&quot;</p>
                      </div>

                      {/* Propuestas Destacadas */}
                      <div>
                        <h4 className="font-bold text-gray-800 mb-3 text-center">🎯 Propuestas Principales</h4>
                        <div className="space-y-2">
                          {candidate.proposals.slice(0, 3).map((proposal, index) => (
                            <div key={index} className="bg-white/80 border border-purple-200 rounded-lg p-3">
                              <p className="text-sm text-gray-800 font-medium">{proposal}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Intención de Voto */}
                      <div className="space-y-3">
                        <h4 className="font-bold text-gray-800 text-center">🗳️ ¿Qué opinas?</h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            size="sm"
                            variant={voteIntention === `apoyo_${candidate.id}` ? "default" : "outline"}
                            onClick={() => handleVoteIntention(candidate.id, 'apoyo')}
                            className="text-xs py-2"
                          >
                            👍 Me Convence
                          </Button>
                          <Button 
                            size="sm"
                            variant={voteIntention === `interesa_${candidate.id}` ? "default" : "outline"}
                            onClick={() => handleVoteIntention(candidate.id, 'interesa')}
                            className="text-xs py-2"
                          >
                            🤔 Me Interesa
                          </Button>
                        </div>
                      </div>

                      {/* Contacto Directo */}
                      <div className="space-y-3 pt-3 border-t border-purple-200">
                        <Button 
                          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3"
                          onClick={() => handleContactRequest(candidate.id)}
                        >
                          <Phone className="w-4 h-4 mr-2" />
                          Contactar Directamente
                        </Button>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs border-blue-600 text-blue-600 hover:bg-blue-50 py-2"
                          >
                            <MessageCircle className="w-3 h-3 mr-1" />
                            Mensaje
                          </Button>
                          
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs border-purple-600 text-purple-600 hover:bg-purple-50 py-2"
                          >
                            <Share2 className="w-3 h-3 mr-1" />
                            Compartir
                          </Button>
                        </div>
                      </div>

                      {/* Apoyo Popular */}
                      <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg text-center">
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Star className="w-5 h-5 text-yellow-500" />
                          <span className="font-bold text-lg text-blue-900">
                            {candidate.vote_count.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-xs text-blue-700">ciudadanos ya apoyan esta candidatura</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Panel de Engagement en Tiempo Real */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-300 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <TrendingUp className="w-5 h-5" />
                  Tu Participación
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-900">{engagementScore}%</div>
                    <div className="text-sm text-green-700">Nivel de participación</div>
                  </div>
                  
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div 
                      className="bg-gradient-to-r from-green-500 to-emerald-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${engagementScore}%` }}
                    ></div>
                  </div>
                  
                  {leadCaptured && (
                    <div className="text-center p-3 bg-green-100 rounded-lg border border-green-300">
                      <div className="text-green-800 font-semibold">🎯 ¡Lead Calificado!</div>
                      <div className="text-xs text-green-600">Te contactaremos pronto</div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Call to Action Final */}
      {selectedTerritory && (
        <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white shadow-2xl">
          <CardContent className="p-8 text-center">
            <h3 className="text-3xl font-bold mb-4">¡Únete al Cambio!</h3>
            <p className="text-xl opacity-90 mb-6 max-w-2xl mx-auto">
              Tu participación construye el futuro. Regístrate y sé parte activa de la democracia.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Button 
                className="bg-white text-blue-600 hover:bg-gray-100 font-bold px-8 py-3"
                onClick={() => captureLeadData('registration_intent', { source: 'funnel_cta' })}
              >
                <Vote className="w-5 h-5 mr-2" />
                Registrarme para Votar
              </Button>
              <Button 
                variant="outline" 
                className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3"
                onClick={() => captureLeadData('event_interest', { source: 'funnel_cta' })}
              >
                <Calendar className="w-5 h-5 mr-2" />
                Ver Eventos Próximos
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VisitorFunnel;
