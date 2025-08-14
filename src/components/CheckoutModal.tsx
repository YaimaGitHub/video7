import React, { useState, useEffect } from 'react';
import { X, User, Phone, MapPin, Copy, RefreshCw, AlertTriangle, CheckCircle, CreditCard } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (orderData: OrderData) => void;
}

export interface CustomerInfo {
  fullName: string;
  idCard?: string;
  email: string;
  phone: string;
  address: string;
}

export interface OrderData {
  orderId: string;
  customerInfo: CustomerInfo;
  deliveryZone: string;
  deliveryCost: number;
  items: any[];
  subtotal: number;
  transferFee: number;
  total: number;
}

// Datos completos de Cuba con provincias, municipios y barrios
const cubaLocations = {
  'Pinar del Río': {
    'Consolación del Sur': ['Centro', 'La Palma', 'Alonso de Rojas'],
    'Guane': ['Centro', 'Cortés', 'Hato del Medio'],
    'La Palma': ['Centro', 'Las Ovas', 'Pueblo Nuevo'],
    'Los Palacios': ['Centro', 'Paso Real de San Diego', 'Río Hondo'],
    'Mantua': ['Centro', 'Guayabo', 'Santa Lucía'],
    'Minas de Matahambre': ['Centro', 'Sumidero', 'Santa Teresa'],
    'Pinar del Río': ['Centro', 'Briones Montoto', 'Ceferino Fernández', 'Hermanos Cruz'],
    'San Juan y Martínez': ['Centro', 'Juan González', 'Punta de Cartas'],
    'San Luis': ['Centro', 'Descanso', 'Portales'],
    'Sandino': ['Centro', 'La Fe', 'Entronque de Herradura'],
    'Viñales': ['Centro', 'Puerto Esperanza', 'La Palma']
  },
  'Artemisa': {
    'Alquízar': ['Centro', 'Pueblo Nuevo', 'Hoyo Colorado'],
    'Artemisa': ['Centro', 'Las Cañas', 'Pueblo Nuevo'],
    'Bauta': ['Centro', 'Cangrejeras', 'El Cano'],
    'Caimito': ['Centro', 'Guatao', 'Pueblo Nuevo'],
    'Guanajay': ['Centro', 'Vereda Nueva', 'Cayajabos'],
    'Güira de Melena': ['Centro', 'El Rosario', 'Pueblo Nuevo'],
    'Mariel': ['Centro', 'Cabañas', 'Pueblo Nuevo'],
    'San Antonio de los Baños': ['Centro', 'Ariguanabo', 'Pueblo Nuevo'],
    'San Cristóbal': ['Centro', 'Los Palacios', 'Candelaria'],
    'Bahía Honda': ['Centro', 'Mulata', 'Pueblo Nuevo'],
    'Candelaria': ['Centro', 'Artemisa', 'Pueblo Nuevo']
  },
  'La Habana': {
    'Arroyo Naranjo': ['Víbora Park', 'Los Pinos', 'Poey', 'Mantilla', 'Párraga'],
    'Boyeros': ['Santiago de las Vegas', 'Wajay', 'Calabazar', 'Altahabana'],
    'Centro Habana': ['Cayo Hueso', 'Los Sitios', 'Pueblo Nuevo', 'Dragones'],
    'Cerro': ['Cerro', 'Palatino', 'Pilar', 'Latinoamericano'],
    'Cotorro': ['Cotorro', 'San Pedro', 'Lotería'],
    'Diez de Octubre': ['Luyanó', 'Jesús del Monte', 'Lawton', 'Santos Suárez'],
    'Guanabacoa': ['Guanabacoa', 'Minas', 'Campo Florido', 'Peñas Altas'],
    'Habana del Este': ['Alamar', 'Guanabo', 'Cojímar', 'Campo Florido'],
    'Habana Vieja': ['Habana Vieja', 'Tallapiedra', 'Jesús María', 'San Isidro'],
    'La Lisa': ['La Lisa', 'Alturas de La Lisa', 'Versalles'],
    'Marianao': ['Marianao', 'Pocito', 'Libertad', 'Carlos III'],
    'Playa': ['Miramar', 'Siboney', 'Atabey', 'Buena Vista'],
    'Plaza de la Revolución': ['Vedado', 'Nuevo Vedado', 'Plaza', 'Rampa'],
    'Regla': ['Regla', 'Loma Modelo', 'Electroquímica'],
    'San Miguel del Padrón': ['San Miguel', 'Diezmero', 'Rocafort']
  },
  'Mayabeque': {
    'Batabanó': ['Centro', 'Surgidero de Batabanó', 'Pueblo Nuevo'],
    'Bejucal': ['Centro', 'Pueblo Nuevo', 'San José'],
    'Güines': ['Centro', 'Catalina de Güines', 'Pueblo Nuevo'],
    'Jaruco': ['Centro', 'Casiguas', 'Pueblo Nuevo'],
    'Madruga': ['Centro', 'Pueblo Nuevo', 'San José'],
    'Melena del Sur': ['Centro', 'Pueblo Nuevo', 'Ceiba del Agua'],
    'Nueva Paz': ['Centro', 'Pueblo Nuevo', 'San José'],
    'Quivicán': ['Centro', 'Pueblo Nuevo', 'San Antonio'],
    'San José de las Lajas': ['Centro', 'Pueblo Nuevo', 'Tapaste'],
    'San Nicolás': ['Centro', 'Pueblo Nuevo', 'Palos'],
    'Santa Cruz del Norte': ['Centro', 'Jibacoa', 'Pueblo Nuevo']
  },
  'Matanzas': {
    'Calimete': ['Centro', 'Navajas', 'Pueblo Nuevo'],
    'Cárdenas': ['Centro', 'Varadero', 'Cantel'],
    'Ciénaga de Zapata': ['Australia', 'Playa Larga', 'Jagüey Grande'],
    'Colón': ['Centro', 'Perico', 'Pueblo Nuevo'],
    'Jagüey Grande': ['Centro', 'Australia', 'Pueblo Nuevo'],
    'Jovellanos': ['Centro', 'Pedro Betancourt', 'Pueblo Nuevo'],
    'Limonar': ['Centro', 'Pueblo Nuevo', 'San José'],
    'Los Arabos': ['Centro', 'Pueblo Nuevo', 'Sabanilla'],
    'Martí': ['Centro', 'Pueblo Nuevo', 'Máximo Gómez'],
    'Matanzas': ['Centro', 'Versalles', 'Pueblo Nuevo', 'Simpson'],
    'Pedro Betancourt': ['Centro', 'Pueblo Nuevo', 'Unión de Reyes'],
    'Perico': ['Centro', 'Pueblo Nuevo', 'Colón'],
    'Unión de Reyes': ['Centro', 'Pueblo Nuevo', 'Alacranes']
  },
  'Villa Clara': {
    'Caibarién': ['Centro', 'Remedios', 'Pueblo Nuevo'],
    'Camajuaní': ['Centro', 'Vueltas', 'Pueblo Nuevo'],
    'Cifuentes': ['Centro', 'Pueblo Nuevo', 'Santo Domingo'],
    'Corralillo': ['Centro', 'Pueblo Nuevo', 'Sagua la Grande'],
    'Encrucijada': ['Centro', 'Pueblo Nuevo', 'Camajuaní'],
    'Manicaragua': ['Centro', 'Pueblo Nuevo', 'Jibacoa'],
    'Placetas': ['Centro', 'Pueblo Nuevo', 'Camajuaní'],
    'Quemado de Güines': ['Centro', 'Pueblo Nuevo', 'Sagua la Grande'],
    'Ranchuelo': ['Centro', 'Pueblo Nuevo', 'Manicaragua'],
    'Remedios': ['Centro', 'Caibarién', 'Pueblo Nuevo'],
    'Sagua la Grande': ['Centro', 'Quemado de Güines', 'Pueblo Nuevo'],
    'San Juan de los Remedios': ['Centro', 'Pueblo Nuevo', 'Caibarién'],
    'Santa Clara': ['Centro', 'Condado', 'José Martí', 'Chiqui Gómez', 'Virginia']
  },
  'Cienfuegos': {
    'Abreus': ['Centro', 'Pueblo Nuevo', 'Jagua'],
    'Aguada de Pasajeros': ['Centro', 'Pueblo Nuevo', 'Rodas'],
    'Cienfuegos': ['Centro', 'Punta Gorda', 'Pueblo Nuevo', 'Reina'],
    'Cruces': ['Centro', 'Pueblo Nuevo', 'Lajas'],
    'Cumanayagua': ['Centro', 'Pueblo Nuevo', 'El Nicho'],
    'Lajas': ['Centro', 'Pueblo Nuevo', 'Cruces'],
    'Palmira': ['Centro', 'Pueblo Nuevo', 'Cienfuegos'],
    'Rodas': ['Centro', 'Pueblo Nuevo', 'Aguada de Pasajeros']
  },
  'Sancti Spíritus': {
    'Cabaiguán': ['Centro', 'Pueblo Nuevo', 'Jatibonico'],
    'Fomento': ['Centro', 'Pueblo Nuevo', 'Trinidad'],
    'Jatibonico': ['Centro', 'Pueblo Nuevo', 'Cabaiguán'],
    'La Sierpe': ['Centro', 'Pueblo Nuevo', 'Sancti Spíritus'],
    'Sancti Spíritus': ['Centro', 'Jesús Menéndez', 'Pueblo Nuevo'],
    'Taguasco': ['Centro', 'Pueblo Nuevo', 'Cabaiguán'],
    'Trinidad': ['Centro', 'Casilda', 'Pueblo Nuevo'],
    'Yaguajay': ['Centro', 'Pueblo Nuevo', 'Mayajigua']
  },
  'Ciego de Ávila': {
    'Baraguá': ['Centro', 'Pueblo Nuevo', 'Jucaro'],
    'Bolivia': ['Centro', 'Pueblo Nuevo', 'Primero de Enero'],
    'Chambas': ['Centro', 'Pueblo Nuevo', 'Morón'],
    'Ciego de Ávila': ['Centro', 'José Martí', 'Pueblo Nuevo'],
    'Ciro Redondo': ['Centro', 'Pueblo Nuevo', 'Ciego de Ávila'],
    'Florencia': ['Centro', 'Pueblo Nuevo', 'Majagua'],
    'Majagua': ['Centro', 'Pueblo Nuevo', 'Ciego de Ávila'],
    'Morón': ['Centro', 'Pueblo Nuevo', 'Chambas'],
    'Primero de Enero': ['Centro', 'Pueblo Nuevo', 'Bolivia'],
    'Venezuela': ['Centro', 'Pueblo Nuevo', 'Baraguá']
  },
  'Camagüey': {
    'Camagüey': ['Centro', 'La Caridad', 'Pueblo Nuevo', 'Vista Hermosa'],
    'Carlos Manuel de Céspedes': ['Centro', 'Pueblo Nuevo', 'Camagüey'],
    'Esmeralda': ['Centro', 'Pueblo Nuevo', 'Santa Cruz del Sur'],
    'Florida': ['Centro', 'Pueblo Nuevo', 'Camagüey'],
    'Guáimaro': ['Centro', 'Pueblo Nuevo', 'Sibanicú'],
    'Jimaguayú': ['Centro', 'Pueblo Nuevo', 'Sierra de Cubitas'],
    'Minas': ['Centro', 'Pueblo Nuevo', 'Nuevitas'],
    'Najasa': ['Centro', 'Pueblo Nuevo', 'Camagüey'],
    'Nuevitas': ['Centro', 'Pueblo Nuevo', 'Minas'],
    'Santa Cruz del Sur': ['Centro', 'Pueblo Nuevo', 'Esmeralda'],
    'Sibanicú': ['Centro', 'Pueblo Nuevo', 'Camagüey'],
    'Sierra de Cubitas': ['Centro', 'Pueblo Nuevo', 'Minas'],
    'Vertientes': ['Centro', 'Pueblo Nuevo', 'Camagüey']
  },
  'Las Tunas': {
    'Amancio': ['Centro', 'Pueblo Nuevo', 'Las Tunas'],
    'Colombia': ['Centro', 'Pueblo Nuevo', 'Jobabo'],
    'Jesús Menéndez': ['Centro', 'Pueblo Nuevo', 'Manatí'],
    'Jobabo': ['Centro', 'Pueblo Nuevo', 'Colombia'],
    'Las Tunas': ['Centro', 'Aurora', 'Pueblo Nuevo'],
    'Majibacoa': ['Centro', 'Pueblo Nuevo', 'Las Tunas'],
    'Manatí': ['Centro', 'Pueblo Nuevo', 'Puerto Padre'],
    'Puerto Padre': ['Centro', 'Pueblo Nuevo', 'Jesús Menéndez']
  },
  'Holguín': {
    'Antilla': ['Centro', 'Pueblo Nuevo', 'Banes'],
    'Báguanos': ['Centro', 'Pueblo Nuevo', 'Holguín'],
    'Banes': ['Centro', 'Pueblo Nuevo', 'Antilla'],
    'Cacocum': ['Centro', 'Pueblo Nuevo', 'Holguín'],
    'Calixto García': ['Centro', 'Pueblo Nuevo', 'Holguín'],
    'Cueto': ['Centro', 'Pueblo Nuevo', 'Mayarí'],
    'Frank País': ['Centro', 'Pueblo Nuevo', 'Sagua de Tánamo'],
    'Gibara': ['Centro', 'Pueblo Nuevo', 'Holguín'],
    'Holguín': ['Centro', 'El Llano', 'Pueblo Nuevo', 'Vista Alegre'],
    'Mayarí': ['Centro', 'Pueblo Nuevo', 'Cueto'],
    'Moa': ['Centro', 'Pueblo Nuevo', 'Sagua de Tánamo'],
    'Rafael Freyre': ['Centro', 'Pueblo Nuevo', 'Banes'],
    'Sagua de Tánamo': ['Centro', 'Pueblo Nuevo', 'Frank País'],
    'Urbano Noris': ['Centro', 'Pueblo Nuevo', 'Holguín']
  },
  'Granma': {
    'Bartolomé Masó': ['Centro', 'Pueblo Nuevo', 'Yara'],
    'Bayamo': ['Centro', 'Pueblo Nuevo', 'José Martí'],
    'Buey Arriba': ['Centro', 'Pueblo Nuevo', 'Yara'],
    'Campechuela': ['Centro', 'Pueblo Nuevo', 'Niquero'],
    'Cauto Cristo': ['Centro', 'Pueblo Nuevo', 'Jiguaní'],
    'Guisa': ['Centro', 'Pueblo Nuevo', 'Bayamo'],
    'Jiguaní': ['Centro', 'Pueblo Nuevo', 'Bayamo'],
    'Manzanillo': ['Centro', 'Pueblo Nuevo', 'Campechuela'],
    'Media Luna': ['Centro', 'Pueblo Nuevo', 'Niquero'],
    'Niquero': ['Centro', 'Pueblo Nuevo', 'Campechuela'],
    'Pilón': ['Centro', 'Pueblo Nuevo', 'Niquero'],
    'Río Cauto': ['Centro', 'Pueblo Nuevo', 'Cauto Cristo'],
    'Yara': ['Centro', 'Pueblo Nuevo', 'Bayamo']
  },
  'Santiago de Cuba': {
    'Contramaestre': ['Centro', 'Pueblo Nuevo', 'Palma Soriano'],
    'Guamá': ['Centro', 'Pueblo Nuevo', 'Chivirico'],
    'Mella': ['Centro', 'Pueblo Nuevo', 'San Luis'],
    'Palma Soriano': ['Centro', 'Pueblo Nuevo', 'Contramaestre'],
    'San Luis': ['Centro', 'Pueblo Nuevo', 'Santiago de Cuba'],
    'Santiago de Cuba': [
      // Barrios del centro histórico
      'Centro Histórico', 'Catedral', 'Plaza de Armas', 'San Francisco',
      // Barrios tradicionales
      'Vista Alegre', 'Sueño', 'Los Olmos', 'Altamira', 'Ampliación de Terrazas',
      'Chicharrones', 'Flores', 'Guilera', 'José Martí', 'Mariana Grajales',
      'Micro 70', 'Micro 9', 'Micro Distrito José Martí', 'Nuevo Vista Alegre',
      'Reparto Sueño', 'Santa Bárbara', 'Terrazas', 'Villa Alegre',
      // Barrios periféricos
      'Abel Santamaría', 'Antonio Maceo', 'Boniato', 'Caney', 'Ciudamar',
      'El Cobre', 'Ferreiro', 'Jutaí', 'La Maya', 'Leyte Vidal',
      'Los Pinos', 'Micro Distrito Abel Santamaría', 'Micro Distrito Antonio Maceo',
      'Micro Distrito Camilo Cienfuegos', 'Micro Distrito Frank País',
      'Micro Distrito Patricio Lumumba', 'Micro Distrito René Ramos Latour',
      'Micro Distrito Siboney', 'Micro Distrito Versalles', 'Nuevo Caney',
      'Nuevo Versalles', 'Palma', 'Paraíso', 'Pastorita', 'Puerto Boniato',
      'Quintero', 'Reparto Flores', 'Reparto Micro', 'Reparto Oriente',
      'Reparto Patricio Lumumba', 'Reparto Siboney', 'Reparto Versalles',
      'San Agustín', 'San Pedrito', 'Siboney', 'Sorribe', 'Versalles'
    ],
    'Segundo Frente': ['Centro', 'Pueblo Nuevo', 'Mayarí Arriba'],
    'Songo-La Maya': ['Centro', 'Pueblo Nuevo', 'Santiago de Cuba'],
    'Tercero Frente': ['Centro', 'Pueblo Nuevo', 'Cruce de los Baños']
  },
  'Guantánamo': {
    'Baracoa': ['Centro', 'Pueblo Nuevo', 'Maisí'],
    'Caimanera': ['Centro', 'Pueblo Nuevo', 'Guantánamo'],
    'El Salvador': ['Centro', 'Pueblo Nuevo', 'Guantánamo'],
    'Guantánamo': ['Centro', 'Pueblo Nuevo', 'Jamaica'],
    'Imías': ['Centro', 'Pueblo Nuevo', 'Maisí'],
    'Maisí': ['Centro', 'Pueblo Nuevo', 'Baracoa'],
    'Manuel Tames': ['Centro', 'Pueblo Nuevo', 'Yateras'],
    'Niceto Pérez': ['Centro', 'Pueblo Nuevo', 'Guantánamo'],
    'San Antonio del Sur': ['Centro', 'Pueblo Nuevo', 'Imías'],
    'Yateras': ['Centro', 'Pueblo Nuevo', 'Guantánamo']
  },
  'Isla de la Juventud': {
    'Nueva Gerona': ['Centro', 'Pueblo Nuevo', 'Chacón', 'Micro I', 'Micro II', 'Micro III']
  }
};

// Costos específicos para barrios de Santiago de Cuba
const santiagoCosts = {
  // Centro histórico - más caro por accesibilidad
  'Centro Histórico': 150, 'Catedral': 150, 'Plaza de Armas': 150, 'San Francisco': 150,
  
  // Barrios tradicionales - costo medio
  'Vista Alegre': 300, 'Sueño': 250, 'Los Olmos': 500, 'Altamira': 300, 
  'Ampliación de Terrazas': 500, 'Chicharrones': 500, 'Flores': 500, 'Guilera': 300,
  'José Martí': 100, 'Mariana Grajales': 150, 'Micro 7': 150, 'Micro 9': 150,
  'Micro Distrito José Martí': 150, 'Nuevo Vista Alegre': 100, 'Reparto Sueño': 250,
  'Santa Bárbara': 300, 'Terrazas': 300, 'Villa Alegre': 200,
  
  // Barrios periféricos - costo variable según distancia
  'Abel Santamaría': 60, 'Antonio Maceo': 65, 'Boniato': 140, 'Caney': 50,
  'Ciudamar': 180, 'El Cobre': 200, 'Ferreiro': 45, 'Jutaí': 55, 'La Maya': 160,
  'Leyte Vidal': 70, 'Los Pinos': 75, 'Micro Distrito Abel Santamaría': 65,
  'Micro Distrito Antonio Maceo': 70, 'Micro Distrito Camilo Cienfuegos': 60,
  'Micro Distrito Frank País': 55, 'Micro Distrito Patricio Lumumba': 65,
  'Micro Distrito René Ramos Latour': 70, 'Micro Distrito Siboney': 150,
  'Micro Distrito Versalles': 80, 'Nuevo Caney': 55, 'Nuevo Versalles': 85,
  'Palma': 170, 'Paraíso': 90, 'Pastorita': 100, 'Puerto Boniato': 145,
  'Quintero': 85, 'Reparto Flores': 90, 'Reparto Micro': 75, 'Reparto Oriente': 80,
  'Reparto Patricio Lumumba': 70, 'Reparto Siboney': 155, 'Reparto Versalles': 85,
  'San Agustín': 95, 'San Pedrito': 105, 'Siboney': 1000, 'Sorribe': 110, 'Versalles': 80
};

export default function CheckoutModal({ isOpen, onClose, onConfirm }: CheckoutModalProps) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    idCard: '',
    email: '',
    phone: '',
    address: ''
  });
  
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedMunicipality, setSelectedMunicipality] = useState('');
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');
  const [deliveryCost, setDeliveryCost] = useState(0);
  const [showNonSantiagoAlert, setShowNonSantiagoAlert] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState('');
  const [showOrderCopied, setShowOrderCopied] = useState(false);

  // Generar ID de orden único
  useEffect(() => {
    if (isOpen) {
      const newOrderId = `TVCart-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      setOrderId(newOrderId);
    }
  }, [isOpen]);

  // Manejar cambio de provincia
  const handleProvinceChange = (province: string) => {
    setSelectedProvince(province);
    setSelectedMunicipality('');
    setSelectedNeighborhood('');
    setDeliveryCost(0);
    setShowNonSantiagoAlert(false);
  };

  // Manejar cambio de municipio
  const handleMunicipalityChange = (municipality: string) => {
    setSelectedMunicipality(municipality);
    setSelectedNeighborhood('');
    setDeliveryCost(0);
    
    // Mostrar alerta si no es Santiago de Cuba
    if (selectedProvince !== 'Santiago de Cuba' || municipality !== 'Santiago de Cuba') {
      setShowNonSantiagoAlert(true);
    } else {
      setShowNonSantiagoAlert(false);
    }
  };

  // Manejar cambio de barrio
  const handleNeighborhoodChange = (neighborhood: string) => {
    setSelectedNeighborhood(neighborhood);
    
    if (selectedProvince === 'Santiago de Cuba' && selectedMunicipality === 'Santiago de Cuba') {
      const cost = santiagoCosts[neighborhood as keyof typeof santiagoCosts] || 100;
      setDeliveryCost(cost);
      setShowNonSantiagoAlert(false);
    } else {
      setDeliveryCost(0);
      setShowNonSantiagoAlert(true);
    }
  };

  // Copiar ID de orden
  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId);
      setShowOrderCopied(true);
      setTimeout(() => setShowOrderCopied(false), 2000);
    } catch (err) {
      console.error('Error copiando ID de orden:', err);
    }
  };

  // Regenerar ID de orden
  const regenerateOrderId = () => {
    const newOrderId = `TVCart-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setOrderId(newOrderId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (showNonSantiagoAlert) {
      return; // No permitir envío si no es Santiago de Cuba
    }
    
    setIsProcessing(true);
    
    try {
      const deliveryZone = `${selectedProvince} > ${selectedMunicipality} > ${selectedNeighborhood}`;
      
      const orderData: OrderData = {
        orderId,
        customerInfo,
        deliveryZone,
        deliveryCost,
        items: [],
        subtotal: 0,
        transferFee: 0,
        total: 0
      };
      
      await onConfirm(orderData);
      onClose();
    } catch (error) {
      console.error('Error en checkout:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleInputChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  if (!isOpen) return null;

  const municipalities = selectedProvince ? Object.keys(cubaLocations[selectedProvince as keyof typeof cubaLocations] || {}) : [];
  const neighborhoods = selectedMunicipality && selectedProvince 
    ? cubaLocations[selectedProvince as keyof typeof cubaLocations]?.[selectedMunicipality] || []
    : [];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold flex items-center">
                <CreditCard className="mr-3 h-7 w-7" />
                Finalizar Pedido
              </h2>
              <p className="text-blue-100 mt-1">Complete sus datos para procesar el pedido</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* ID de Orden */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-green-800 flex items-center">
                <span className="mr-2">🎫</span>
                ID de Orden
              </h3>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={copyOrderId}
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition-colors"
                  title="Copiar ID"
                >
                  <Copy className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={regenerateOrderId}
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                  title="Regenerar ID"
                >
                  <RefreshCw className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg p-3 border border-green-300">
              <code className="text-green-700 font-mono text-sm break-all">{orderId}</code>
            </div>
            {showOrderCopied && (
              <div className="mt-2 flex items-center text-green-600 text-sm">
                <CheckCircle className="h-4 w-4 mr-1" />
                ID copiado al portapapeles
              </div>
            )}
          </div>

          {/* Información Personal */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <User className="mr-2 h-5 w-5 text-blue-600" />
              Información Personal
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  value={customerInfo.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ingrese su nombre completo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Carnet de Identidad
                </label>
                <input
                  type="text"
                  value={customerInfo.idCard || ''}
                  onChange={(e) => handleInputChange('idCard', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ej: 12345678901"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4 inline mr-1" />
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={customerInfo.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Ej: +53 5X XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={customerInfo.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="ejemplo@correo.com"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="w-4 h-4 inline mr-1" />
                Dirección Completa *
              </label>
              <textarea
                required
                value={customerInfo.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                rows={3}
                placeholder="Ingrese su dirección completa con referencias"
              />
            </div>
          </div>

          {/* Zona de Entrega */}
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MapPin className="mr-2 h-5 w-5 text-green-600" />
              Zona de Entrega
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Provincia */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Provincia *
                </label>
                <select
                  required
                  value={selectedProvince}
                  onChange={(e) => handleProvinceChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">Seleccionar provincia</option>
                  {Object.keys(cubaLocations).map((province) => (
                    <option key={province} value={province}>
                      {province}
                    </option>
                  ))}
                </select>
              </div>

              {/* Municipio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Municipio *
                </label>
                <select
                  required
                  value={selectedMunicipality}
                  onChange={(e) => handleMunicipalityChange(e.target.value)}
                  disabled={!selectedProvince}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccionar municipio</option>
                  {municipalities.map((municipality) => (
                    <option key={municipality} value={municipality}>
                      {municipality}
                    </option>
                  ))}
                </select>
              </div>

              {/* Barrio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Barrio/Zona *
                </label>
                <select
                  required
                  value={selectedNeighborhood}
                  onChange={(e) => handleNeighborhoodChange(e.target.value)}
                  disabled={!selectedMunicipality}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <option value="">Seleccionar barrio</option>
                  {neighborhoods.map((neighborhood) => (
                    <option key={neighborhood} value={neighborhood}>
                      {neighborhood}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Costo de entrega */}
            {selectedNeighborhood && !showNonSantiagoAlert && (
              <div className="mt-4 bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <span className="text-green-700 font-medium">Costo de entrega:</span>
                  <span className="text-2xl font-bold text-green-800">${deliveryCost} CUP</span>
                </div>
              </div>
            )}

            {/* Alerta para zonas fuera de Santiago de Cuba */}
            {showNonSantiagoAlert && (
              <div className="mt-4 bg-orange-50 rounded-lg p-4 border border-orange-200">
                <div className="flex items-start">
                  <AlertTriangle className="h-6 w-6 text-orange-500 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-orange-800 mb-2">
                      Zona de Entrega No Disponible
                    </h4>
                    <p className="text-orange-700 mb-3">
                      Actualmente solo realizamos entregas en Santiago de Cuba ciudad. 
                      Para otras zonas, contacte directamente con nosotros para coordinar la entrega.
                    </p>
                    <div className="bg-white rounded-lg p-3 border border-orange-300">
                      <p className="text-sm font-medium text-orange-800 mb-1">
                        📱 Contacto para coordinación:
                      </p>
                      <p className="text-orange-700 font-mono">
                        WhatsApp: +53 5469 0878
                      </p>
                      <p className="text-xs text-orange-600 mt-1">
                        TV a la Carta - Entregas especiales
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex gap-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isProcessing || showNonSantiagoAlert}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium flex items-center justify-center"
            >
              {isProcessing ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              ) : (
                <CreditCard className="w-5 h-5 mr-2" />
              )}
              {isProcessing ? 'Procesando...' : 'Finalizar Pedido'}
            </button>
          </div>

          {/* Información adicional */}
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <p className="text-sm text-blue-700 text-center flex items-center justify-center">
              <span className="mr-2">🔒</span>
              Sus datos están seguros y solo se utilizarán para procesar su pedido
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}