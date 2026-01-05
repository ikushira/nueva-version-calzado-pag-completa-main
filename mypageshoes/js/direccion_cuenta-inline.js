/**
 * direccion_cuenta-inline.js
 * Script extraído de direccion_cuenta.html
 * Convertido de script inline a archivo separado
 */

(function() {
    'use strict';
    
    // Código original del script inline
    // Listado completo de municipios por departamento de Colombia
const municipiosPorDepartamento = {
  "Amazonas": ["Leticia", "Puerto Nariño"],
  "Antioquia": ["Medellín", "Abejorral", "Abriaquí", "Alejandría", "Amagá", "Amalfi", "Andes", "Angelópolis", "Angostura", "Anorí", "Santafé de Antioquia", "Anza", "Apartadó", "Arboletes", "Argelia", "Armenia", "Barbosa", "Bello", "Betania", "Betulia", "Ciudad Bolívar", "Briceño", "Buriticá", "Cáceres", "Caicedo", "Caldas", "Campamento", "Cañasgordas", "Caracolí", "Caramanta", "Carepa", "El Carmen de Viboral", "Carolina", "Caucasia", "Chigorodó", "Cisneros", "Cocorná", "Concepción", "Concordia", "Copacabana", "Dabeiba", "Donmatías", "Ebéjico", "El Bagre", "Entrerríos", "Envigado", "Fredonia", "Frontino", "Giraldo", "Girardota", "Gómez Plata", "Granada", "Guadalupe", "Guarne", "Guatapé", "Heliconia", "Hispania", "Itagüí", "Ituango", "Jardín", "Jericó", "La Ceja", "La Estrella", "La Pintada", "La Unión", "Liborina", "Maceo", "Marinilla", "Montebello", "Murindó", "Mutatá", "Nariño", "Nechí", "Olaya", "Peñol", "Peque", "Pueblorrico", "Puerto Berrío", "Puerto Nare", "Puerto Triunfo", "Remedios", "Retiro", "Rionegro", "Sabanalarga", "Sabaneta", "Salgar", "San Andrés de Cuerquia", "San Carlos", "San Francisco", "San Jerónimo", "San José de la Montaña", "San Juan de Urabá", "San Luis", "San Pedro", "San Pedro de Urabá", "San Rafael", "San Roque", "San Vicente", "Santa Bárbara", "Santa Rosa de Osos", "Santo Domingo", "El Santuario", "Segovia", "Sonsón", "Sopetrán", "Támesis", "Tarazá", "Tarso", "Titiribí", "Toledo", "Turbo", "Uramita", "Urrao", "Valdivia", "Valparaíso", "Vegachí", "Venecia", "Vigía del Fuerte", "Yalí", "Yarumal", "Yolombó", "Yondó", "Zaragoza"],
  "Arauca": ["Arauca", "Arauquita", "Cravo Norte", "Fortul", "Puerto Rondón", "Saravena", "Tame"],
  "Atlántico": ["Barranquilla", "Baranoa", "Campo de la Cruz", "Candelaria", "Galapa", "Juan de Acosta", "Luruaco", "Malambo", "Manatí", "Palmar de Varela", "Piojó", "Polonuevo", "Ponedera", "Puerto Colombia", "Repelón", "Sabanagrande", "Sabanalarga", "Santa Lucía", "Santo Tomás", "Soledad", "Suan", "Tubará", "Usiacurí"],
  "Bolívar": ["Cartagena", "Achí", "Altos del Rosario", "Arenal", "Arjona", "Arroyohondo", "Barranco de Loba", "Calamar", "Cantagallo", "Cicuco", "Córdoba", "Clemencia", "El Guamo", "El Peñón", "Hatillo de Loba", "Magangué", "Mahates", "Margarita", "María la Baja", "Mompós", "Montecristo", "Morales", "Norosí", "Pinillos", "Regidor", "Río Viejo", "San Cristóbal", "San Estanislao", "San Fernando", "San Jacinto", "San Jacinto del Cauca", "San Juan Nepomuceno", "San Martín de Loba", "San Pablo", "Santa Catalina", "Santa Rosa", "Santa Rosa del Sur", "Simití", "Soplaviento", "Talaigua Nuevo", "Tiquisio", "Turbaco", "Turbaná", "Villanueva", "Zambrano"],
  "Boyacá": ["Tunja", "Almeida", "Aquitania", "Arcabuco", "Belén", "Berbeo", "Betéitiva", "Boavita", "Boyacá", "Briceño", "Buenavista", "Busbanzá", "Caldas", "Campohermoso", "Cerinza", "Chinavita", "Chiquinquirá", "Chiscas", "Chita", "Chitaraque", "Chivatá", "Ciénega", "Cómbita", "Coper", "Corrales", "Covarachía", "Cubará", "Cucaita", "Cuítiva", "Duitama", "El Cocuy", "El Espino", "Firavitoba", "Floresta", "Gachantivá", "Gámeza", "Garagoa", "Guacamayas", "Guateque", "Guayatá", "Güicán", "Iza", "Jenesano", "Jericó", "La Capilla", "La Uvita", "La Victoria", "La Virgen", "Macanal", "Maripí", "Miraflores", "Mongua", "Monguí", "Moniquirá", "Motavita", "Muzo", "Nobsa", "Nuevo Colón", "Oicatá", "Otanche", "Pachavita", "Páez", "Paipa", "Pajarito", "Panqueba", "Pauna", "Paya", "Paz de Río", "Pesca", "Pisba", "Puerto Boyacá", "Quípama", "Ramiriquí", "Ráquira", "Rondón", "Saboyá", "Sáchica", "Samacá", "San Eduardo", "San José de Pare", "San Luis de Gaceno", "San Mateo", "San Miguel de Sema", "San Pablo de Borbur", "Santa María", "Santa Rosa de Viterbo", "Santa Sofía", "Santana", "Sativanorte", "Sativasur", "Siachoque", "Soatá", "Socha", "Socotá", "Sogamoso", "Somondoco", "Sora", "Soracá", "Sotaquirá", "Susacón", "Sutamarchán", "Sutatenza", "Tasco", "Tenza", "Tibaná", "Tibasosa", "Tinjacá", "Tipacoque", "Toca", "Togüí", "Tópaga", "Tota", "Tununguá", "Turmequé", "Tuta", "Tutazá", "Úmbita", "Ventaquemada", "Villa de Leyva", "Viracachá", "Zetaquira"],
  "Caldas": ["Manizales", "Aguadas", "Anserma", "Aranzá", "Belalcázar", "Chinchiná", "Dosquebradas", "Filadelfia", "La Dorada", "La Merced", "Manzanares", "Marmato", "Marquetalia", "Neira", "Páez", "Palestina", "Pensilvania", "Riosucio", "Salamina", "San Carlos", "San Félix", "San José", "Supía", "Victoria"],
  "Caquetá": ["Florencia", "Albania", "Belén de los Andaquies", "Cartagena del Chairá", "Curillo", "El Doncello", "El Paujil", "La Montañita", "Milán", "Morelia", "Puerto Rico", "San José del Fragua", "Solano", "Valparaíso"],
  "Casanare": ["Yopal", "Aguazul", "Chámeza", "Hato Corozal", "La Salina", "Maní", "Monterrey", "Nunchía", "Paz de Ariporo", "Pore", "Recetor", "Sácama", "San Luis de Palenque", "Támara", "Trinidad"],
  "Cauca": ["Popayán", "Almaguer", "Argelia", "Balboa", "Bolívar", "Cajibío", "Caloto", "El Bordo", "El Tambo", "Florencia", "Guachené", "La Sierra", "La Vega", "Mercaderes", "Miranda", "Paez", "Páez", "Popayán", "Puerto Tejada", "Santander de Quilichao", "Silvia", "Sotara", "Sucre", "Timbío", "Timbiquí", "Toribío", "Villa Rica"],
  "Cesar": ["Valledupar", "Aguachica", "Agustín Codazzi", "Becerril", "Bosconia", "Chimichagua", "Chiriguaná", "Codazzi", "El Copey", "El Paso", "Gamarra", "La Gloria", "La Jagua de Ibirico", "La Paz", "Manaure", "Pailitas", "Pelaya", "San Alberto", "San Diego", "San Martín", "Tamalameque", "Valledupar", "Villanueva"],
  "Chocó": ["Quibdó", "Acandí", "Alto Baudó", "Atrato", "Bagadó", "Bahía Solano", "Bajo Baudó", "Bojayá", "Cértegui", "Condoto", "El Cantón del San Pablo", "El Litoral del San Juan", "Istmina", "Jurado", "Lloró", "Medio Atrato", "Medio San Juan", "Nóvita", "Riosucio", "San José del Palmar", "Sipí", "Tadó", "Unión Panamericana"],
  "Córdoba": ["Montería", "Aguazul", "Albania", "Ayapel", "Cereté", "Chimá", "Chinú", "Ciénaga de Oro", "Coloso", "El Campano", "El Cienaga", "El Porvenir", "La Apartada", "La Doctrina", "La Gloria", "La Mano de Dios", "La Montañita", "La Palma", "La Pila", "La Unión", "Lorica", "Los Córdobas", "Los Garzones", "Moñitos", "Planeta Rica", "Puerto Escondido", "Purísima", "Sahagún", "San Andrés Sotavento", "San Antero", "San Bernardo del Viento", "San Carlos", "San Pelayo", "Santa Cruz de Lorica", "Tierralta", "Tuchín", "Valencia"],
  "Cundinamarca": ["Bogotá", "Soacha", "Chía", "Zipaquirá", "Facatativá", "Girardot", "Fusagasugá", "Mosquera", "Cajicá", "La Calera", "Madrid", "Tabio"],
  "Guainía": ["Inírida", "Barranco Minas", "El Guainía", "La Guadalupe", "Mapiripana", "San Felipe", "Puerto Colombia", "Cacahual", "Pana Pana", "Morichal", "La Esmeralda", "La Unión"],
  "Guaviare": ["San José del Guaviare", "Calamar", "El Retorno", "Miraflores", "Puerto Concordia", "Puerto Gaitán", "Sáname", "San Juanito", "La Primavera", "Cumaribo", "Cachicamo", "Cumaribo"],
  "Huila": ["Neiva", "Aipe", "Algeciras", "Campoalegre", "Colombia", "Elías", "Garzón", "Gigante", "Hobo", "Isnos", "La Argentina", "La Plata", "Nátaga", "Pitalito", "Rivera", "Saladoblanco", "San Agustín", "Santa María", "Suaza", "Tarqui", "Tesalia", "Timaná", "Villavieja"],
  "La Guajira": ["Riohacha", "Albania", "Barrancas", "Dibulla", "Distracción", "El Molino", "Fonseca", "Hatonuevo", "La Jagua del Pilar", "Maicao", "Manaure", "San Juan del Cesar", "Uribia", "Urumita", "Villanueva"],
  "Magdalena": ["Santa Marta", "Algarrobo", "Aracataca", "Ciénaga", "El Banco", "El Piñón", "Guamal", "Nueva Granada", "Pivijay", "Plato", "Salamina", "San Sebastián de Buenavista", "Santa Ana", "Santa Bárbara de Pinto", "Sitionuevo", "Zona Bananera"],
  "Meta": ["Villavicencio", "Acacías", "Barranca de Upía", "Cabuyaro", "Castillo", "Cubarral", "El Dorado", "El Castillo", "La Macarena", "La Uribe", "Lejanías", "Mapiripán", "Mesetas", "Puerto Concordia", "Puerto Gaitán", "Puerto López", "Restrepo", "San Carlos de Guaroa", "San Juan de Arama", "San Martín de los Llanos", "Vistahermosa"],
  "Nariño": ["Pasto", "Albán", "Aldana", "Ancuya", "Arboleda", "El Contadero", "El Peñol", "Funes", "Guachucal", "Ipiales", "La Cruz", "La Florida", "La Llanada", "La Tola", "Leiva", "Los Andes", "Magüí Payán", "Mallama", "Mosquera", "Nariño", "Potosí", "Providencia", "Ricaurte", "San Bernardo", "San Lorenzo", "San Pablo", "Santa Bárbara", "Santacruz", "Sapuyes", "Taminango", "Tumaco", "Yacuanquer"],
  "Norte de Santander": ["Cúcuta", "Ábrego", "Chinácota", "Durania", "El Tarra", "El Zulia", "Gramalote", "Hacarí", "La Esperanza", "La Playa de Belén", "Los Patios", "Puerto Santander", "Ragonvalia", "Salazar de Las Palmas", "San Calixto", "Santiago", "Tibú", "Villa Caro", "Villa de Rosario"],
  "Putumayo": ["Mocoa", "Colón", "Orito", "San Francisco", "San Miguel", "Santiago", "Villagarzón"],
  "Quindío": ["Armenia", "Calarcá", "Circasia", "Córdoba", "Filandia", "La Tebaida", "Montenegro", "Pereira", "Quimbaya", "Salento"],
  "Risaralda": ["Pereira", "Dosquebradas", "Santa Rosa de Cabal", "La Virginia", "Belén de Umbría", "Guática", "Marsella", "Mistrató", "Pueblo Rico", "Santuario"],
  "San Andrés y Providencia": ["San Andrés", "Providencia"],
  "Santander": ["Bucaramanga", "Barrancabermeja", "Floridablanca", "Girón", "Piedecuesta", "San Gil", "Socorro", "Lebrija", "Rionegro", "El Socorro", "Vélez", "Zapatoca"],
  "Sucre": ["Sincelejo", "Buenavista", "Caimito", "Colosó", "Corozal", "El Roble", "La Unión", "Los Palmitos", "Majagual", "Morroa", "Ovejas", "Sampués", "San Benito Abad", "San Jorge", "San Onofre", "Sucre", "Toluviejo"],
  "Tolima": ["Ibagué", "Alvarado", "Ambalema", "Anzoátegui", "Ataco", "Cajamarca", "Campín", "Chaparral", "Coello", "El Espinal", "El Líbano", "Falan", "Fresno", "Guamo", "Herveo", "Honda", "Ibagué", "Icononzo", "Lérida", "Mariquita", "Melgar", "Murillo", "Natagaima", "Ortega", "Palocabildo", "Piedras", "Planadas", "Prado", "Purificación", "Rioblanco", "Roncesvalles", "Saldaña", "San Antonio", "San Luis", "Santa Isabel", "Suárez", "Valle de San Juan", "Venadillo", "Villarrica"],
  "Valle del Cauca": ["Cali", "Alcalá", "Andalucía", "Buga", "Buenaventura", "Candelaria", "Cartago", "Dagua", "El Águila", "El Cerrito", "El Dovio", "Florida", "Ginebra", "Guacarí", "Jamundí", "La Cumbre", "La Unión", "Palmira", "Pradera", "Restrepo", "Roldanillo", "San Pedro", "Santiago de Cali", "Tuluá", "Versalles", "Vijes", "Yumbo"],
  "Vaupés": ["Mitú", "Carimagua", "Pacoa", "Papunaua", "Raudal", "Taraira", "Yavaraté"],
  "Vichada": ["Puerto Carreño", "Puerto Concordia", "Santa Rosalía", "La Primavera", "Cumaribo", "El Retorno", "San José de Ocune", "San Juan de Arama", "Tame"],
};
const departamentoSelect = document.getElementById('departamento');
const municipioSelect = document.getElementById('municipio');
departamentoSelect.addEventListener('change', function() {
  const depto = departamentoSelect.value;
  municipioSelect.innerHTML = '<option value="">Seleccione un municipio</option>';
  if (municipiosPorDepartamento[depto]) {
    municipiosPorDepartamento[depto].forEach(function(mun) {
      const opt = document.createElement('option');
      opt.value = mun;
      opt.textContent = mun;
      municipioSelect.appendChild(opt);
    });
  }
});
    
})();