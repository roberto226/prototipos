import type {
  Agent,
  AgentStats,
  Commission,
  CommissionStatus,
  ClientType,
  DashboardFilters,
  InviteLink,
  OlimpoProgram,
  Prospect,
  ReferralStatus,
  StatusHistoryEntry,
  Transaction,
} from '@/lib/types'

// ---------------------------------------------------------------------------
// Agents (10)
// ---------------------------------------------------------------------------

export const agents: Agent[] = [
  {
    id: 'agent-001',
    name: 'Diego Mendoza Flores',
    email: 'diego.mendoza@olimpo.mx',
    phone: '+52 55 1234 5678',
    avatarUrl: undefined,
    status: 'active',
    permissions: {
      canReferVIP: true,
      canReferStandard: true,
      canGrantCredit: true,
      maxCreditLineAmount: 500000,
    },
    createdAt: '2025-10-15T10:00:00Z',
  },
  {
    id: 'agent-002',
    name: 'Mariana Torres Guzmán',
    email: 'mariana.torres@olimpo.mx',
    phone: '+52 55 2345 6789',
    avatarUrl: undefined,
    status: 'active',
    permissions: {
      canReferVIP: true,
      canReferStandard: true,
      canGrantCredit: true,
      maxCreditLineAmount: 350000,
    },
    createdAt: '2025-10-18T14:30:00Z',
  },
  {
    id: 'agent-003',
    name: 'José Luis Ramírez Herrera',
    email: 'joseluis.ramirez@olimpo.mx',
    phone: '+52 33 3456 7890',
    avatarUrl: undefined,
    status: 'active',
    permissions: {
      canReferVIP: false,
      canReferStandard: true,
      canGrantCredit: true,
      maxCreditLineAmount: 150000,
    },
    createdAt: '2025-10-20T09:15:00Z',
  },
  {
    id: 'agent-004',
    name: 'Ana Gabriela Salazar Peña',
    email: 'ana.salazar@olimpo.mx',
    phone: '+52 81 4567 8901',
    avatarUrl: undefined,
    status: 'active',
    permissions: {
      canReferVIP: true,
      canReferStandard: true,
      canGrantCredit: true,
      maxCreditLineAmount: 400000,
    },
    createdAt: '2025-10-22T11:00:00Z',
  },
  {
    id: 'agent-005',
    name: 'Fernando Castillo Ortega',
    email: 'fernando.castillo@olimpo.mx',
    phone: '+52 55 5678 9012',
    avatarUrl: undefined,
    status: 'active',
    permissions: {
      canReferVIP: false,
      canReferStandard: true,
      canGrantCredit: false,
      maxCreditLineAmount: 0,
    },
    createdAt: '2025-11-01T08:45:00Z',
  },
  {
    id: 'agent-006',
    name: 'Lucía Hernández Morales',
    email: 'lucia.hernandez@olimpo.mx',
    phone: '+52 33 6789 0123',
    avatarUrl: undefined,
    status: 'active',
    permissions: {
      canReferVIP: true,
      canReferStandard: true,
      canGrantCredit: true,
      maxCreditLineAmount: 250000,
    },
    createdAt: '2025-11-05T16:20:00Z',
  },
  {
    id: 'agent-007',
    name: 'Diego Vargas Navarro',
    email: 'diego.vargas@olimpo.mx',
    phone: '+52 81 7890 1234',
    avatarUrl: undefined,
    status: 'inactive',
    permissions: {
      canReferVIP: false,
      canReferStandard: true,
      canGrantCredit: true,
      maxCreditLineAmount: 100000,
    },
    createdAt: '2025-11-08T13:00:00Z',
  },
  {
    id: 'agent-008',
    name: 'Sofía Delgado Ríos',
    email: 'sofia.delgado@olimpo.mx',
    phone: '+52 55 8901 2345',
    avatarUrl: undefined,
    status: 'active',
    permissions: {
      canReferVIP: false,
      canReferStandard: true,
      canGrantCredit: true,
      maxCreditLineAmount: 120000,
    },
    createdAt: '2025-11-10T10:30:00Z',
  },
  {
    id: 'agent-009',
    name: 'Carlos Alberto Mejía Luna',
    email: 'carlos.mejia@olimpo.mx',
    phone: '+52 33 9012 3456',
    avatarUrl: undefined,
    status: 'inactive',
    permissions: {
      canReferVIP: true,
      canReferStandard: true,
      canGrantCredit: false,
      maxCreditLineAmount: 0,
    },
    createdAt: '2025-11-12T15:45:00Z',
  },
  {
    id: 'agent-010',
    name: 'Valentina Rojas Espinoza',
    email: 'valentina.rojas@olimpo.mx',
    phone: '+52 81 0123 4567',
    avatarUrl: undefined,
    status: 'active',
    permissions: {
      canReferVIP: true,
      canReferStandard: true,
      canGrantCredit: true,
      maxCreditLineAmount: 300000,
    },
    createdAt: '2025-11-15T12:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Helper: build status history
// ---------------------------------------------------------------------------

function buildStatusHistory(
  finalStatus: ReferralStatus,
  baseDate: string
): StatusHistoryEntry[] {
  const order: ReferralStatus[] = ['invited', 'registered', 'active', 'churn']
  const idx = order.indexOf(finalStatus)
  const base = new Date(baseDate)
  const history: StatusHistoryEntry[] = []

  for (let i = 0; i <= idx; i++) {
    const d = new Date(base)
    d.setDate(d.getDate() + i * 3 + Math.floor(Math.random() * 3))
    d.setHours(9 + Math.floor(Math.random() * 10), Math.floor(Math.random() * 60))
    history.push({ status: order[i], timestamp: d.toISOString() })
  }

  return history
}

// ---------------------------------------------------------------------------
// Prospects (35)
// ---------------------------------------------------------------------------

export const prospects: Prospect[] = [
  // --- agent-001 (Diego) - 6 prospects ---
  {
    id: 'prospect-001',
    name: 'Alejandro Vega Soto',
    phone: '+52 55 1111 0001',
    email: 'alejandro.vega@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 300000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-001',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-05'),
    createdAt: '2025-11-05T10:20:00Z',
  },
  {
    id: 'prospect-002',
    name: 'Gabriela Muñoz Ibarra',
    phone: '+52 55 1111 0002',
    email: 'gabriela.munoz@hotmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 250000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-001',
    referralMethod: 'invite_link',
    inviteLinkId: 'link-001',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-12'),
    createdAt: '2025-11-12T14:35:00Z',
  },
  {
    id: 'prospect-003',
    name: 'Roberto Pacheco Aguilar',
    phone: '+52 55 1111 0003',
    email: 'roberto.pacheco@outlook.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 80000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-001',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-20'),
    createdAt: '2025-11-20T09:10:00Z',
  },
  {
    id: 'prospect-004',
    name: 'Isabel Contreras Duarte',
    phone: '+52 55 1111 0004',
    email: 'isabel.contreras@gmail.com',
    clientType: 'standard',
    creditAvailable: false,
    creditLineAmount: 0,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-001',
    referralMethod: 'direct',
    status: 'registered',
    statusHistory: buildStatusHistory('registered', '2025-12-01'),
    createdAt: '2025-12-01T11:45:00Z',
  },
  {
    id: 'prospect-005',
    name: 'Miguel Ángel Fuentes Reyes',
    phone: '+52 55 1111 0005',
    email: 'miguel.fuentes@yahoo.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 500000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-001',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-12-10'),
    createdAt: '2025-12-10T16:00:00Z',
  },
  {
    id: 'prospect-006',
    name: 'Patricia Lozano Cervantes',
    phone: '+52 55 1111 0006',
    email: 'patricia.lozano@gmail.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 50000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-001',
    referralMethod: 'invite_link',
    inviteLinkId: 'link-002',
    status: 'invited',
    statusHistory: buildStatusHistory('invited', '2026-01-15'),
    createdAt: '2026-01-15T08:30:00Z',
  },

  // --- agent-002 (Mariana) - 5 prospects ---
  {
    id: 'prospect-007',
    name: 'Héctor Jiménez Orozco',
    phone: '+52 33 2222 0001',
    email: 'hector.jimenez@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 350000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-002',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-08'),
    createdAt: '2025-11-08T13:20:00Z',
  },
  {
    id: 'prospect-008',
    name: 'Claudia Medina Trejo',
    phone: '+52 33 2222 0002',
    email: 'claudia.medina@outlook.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 100000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-002',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-18'),
    createdAt: '2025-11-18T10:05:00Z',
  },
  {
    id: 'prospect-009',
    name: 'Enrique Domínguez Ponce',
    phone: '+52 33 2222 0003',
    email: 'enrique.dominguez@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 200000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-002',
    referralMethod: 'invite_link',
    inviteLinkId: 'link-003',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-12-02'),
    createdAt: '2025-12-02T15:40:00Z',
  },
  {
    id: 'prospect-010',
    name: 'Teresa Esquivel Montes',
    phone: '+52 33 2222 0004',
    email: 'teresa.esquivel@hotmail.com',
    clientType: 'standard',
    creditAvailable: false,
    creditLineAmount: 0,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-002',
    referralMethod: 'direct',
    status: 'invited',
    statusHistory: buildStatusHistory('invited', '2026-01-20'),
    createdAt: '2026-01-20T09:55:00Z',
  },
  {
    id: 'prospect-011',
    name: 'Raúl Sandoval Bautista',
    phone: '+52 33 2222 0005',
    email: 'raul.sandoval@gmail.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 75000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-002',
    referralMethod: 'direct',
    status: 'registered',
    statusHistory: buildStatusHistory('registered', '2026-02-01'),
    createdAt: '2026-02-01T12:10:00Z',
  },

  // --- agent-003 (José Luis) - 4 prospects ---
  {
    id: 'prospect-012',
    name: 'Laura Beatriz Campos Ávila',
    phone: '+52 33 3333 0001',
    email: 'laura.campos@gmail.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 120000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-003',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-10'),
    createdAt: '2025-11-10T08:00:00Z',
  },
  {
    id: 'prospect-013',
    name: 'Óscar Guillermo Nava Solís',
    phone: '+52 33 3333 0002',
    email: 'oscar.nava@outlook.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 60000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-003',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-12-05'),
    createdAt: '2025-12-05T14:25:00Z',
  },
  {
    id: 'prospect-014',
    name: 'Mónica Estrada Villalobos',
    phone: '+52 33 3333 0003',
    email: 'monica.estrada@gmail.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 90000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-003',
    referralMethod: 'invite_link',
    inviteLinkId: 'link-004',
    status: 'registered',
    statusHistory: buildStatusHistory('registered', '2026-01-08'),
    createdAt: '2026-01-08T11:30:00Z',
  },
  {
    id: 'prospect-015',
    name: 'Sergio Ramos Gutiérrez',
    phone: '+52 33 3333 0004',
    email: 'sergio.ramos@yahoo.com',
    clientType: 'standard',
    creditAvailable: false,
    creditLineAmount: 0,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-003',
    referralMethod: 'direct',
    status: 'invited',
    statusHistory: buildStatusHistory('invited', '2026-02-05'),
    createdAt: '2026-02-05T17:00:00Z',
  },

  // --- agent-004 (Ana Gabriela) - 5 prospects ---
  {
    id: 'prospect-016',
    name: 'Adrián Mora Becerra',
    phone: '+52 81 4444 0001',
    email: 'adrian.mora@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 400000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-004',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-07'),
    createdAt: '2025-11-07T09:45:00Z',
  },
  {
    id: 'prospect-017',
    name: 'Carmen Leticia Zavala Díaz',
    phone: '+52 81 4444 0002',
    email: 'carmen.zavala@hotmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 280000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-004',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-25'),
    createdAt: '2025-11-25T15:10:00Z',
  },
  {
    id: 'prospect-018',
    name: 'Jorge Alfredo Peña Rosales',
    phone: '+52 81 4444 0003',
    email: 'jorge.pena@gmail.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 150000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-004',
    referralMethod: 'invite_link',
    inviteLinkId: 'link-005',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-12-08'),
    createdAt: '2025-12-08T10:55:00Z',
  },
  {
    id: 'prospect-019',
    name: 'Verónica Sánchez Paredes',
    phone: '+52 81 4444 0004',
    email: 'veronica.sanchez@outlook.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 70000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-004',
    referralMethod: 'direct',
    status: 'registered',
    statusHistory: buildStatusHistory('registered', '2026-01-12'),
    createdAt: '2026-01-12T08:20:00Z',
  },
  {
    id: 'prospect-020',
    name: 'Arturo Cisneros Valdez',
    phone: '+52 81 4444 0005',
    email: 'arturo.cisneros@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 350000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-004',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2026-01-28'),
    createdAt: '2026-01-28T13:40:00Z',
  },

  // --- agent-005 (Fernando) - 3 prospects ---
  {
    id: 'prospect-021',
    name: 'Rosa María León Castro',
    phone: '+52 55 5555 0001',
    email: 'rosa.leon@gmail.com',
    clientType: 'standard',
    creditAvailable: false,
    creditLineAmount: 0,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-005',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-22'),
    createdAt: '2025-11-22T10:00:00Z',
  },
  {
    id: 'prospect-022',
    name: 'Eduardo Guerrero Mendoza',
    phone: '+52 55 5555 0002',
    email: 'eduardo.guerrero@hotmail.com',
    clientType: 'standard',
    creditAvailable: false,
    creditLineAmount: 0,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-005',
    referralMethod: 'direct',
    status: 'churn',
    statusHistory: buildStatusHistory('churn', '2025-12-15'),
    createdAt: '2025-12-15T14:50:00Z',
  },
  {
    id: 'prospect-023',
    name: 'Diana Kristell Cruz Martínez',
    phone: '+52 55 5555 0003',
    email: 'diana.cruz@gmail.com',
    clientType: 'standard',
    creditAvailable: false,
    creditLineAmount: 0,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-005',
    referralMethod: 'invite_link',
    inviteLinkId: 'link-006',
    status: 'invited',
    statusHistory: buildStatusHistory('invited', '2026-02-10'),
    createdAt: '2026-02-10T09:15:00Z',
  },

  // --- agent-006 (Lucía) - 4 prospects ---
  {
    id: 'prospect-024',
    name: 'Andrés Felipe Ruiz Beltrán',
    phone: '+52 33 6666 0001',
    email: 'andres.ruiz@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 220000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-006',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-14'),
    createdAt: '2025-11-14T11:30:00Z',
  },
  {
    id: 'prospect-025',
    name: 'Paulina Acosta Rangel',
    phone: '+52 33 6666 0002',
    email: 'paulina.acosta@outlook.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 100000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-006',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-12-03'),
    createdAt: '2025-12-03T09:40:00Z',
  },
  {
    id: 'prospect-026',
    name: 'Francisco Javier Bravo Núñez',
    phone: '+52 33 6666 0003',
    email: 'francisco.bravo@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 180000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-006',
    referralMethod: 'invite_link',
    inviteLinkId: 'link-007',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-12-18'),
    createdAt: '2025-12-18T16:15:00Z',
  },
  {
    id: 'prospect-027',
    name: 'Natalia Cordero Villanueva',
    phone: '+52 33 6666 0004',
    email: 'natalia.cordero@yahoo.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 65000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-006',
    referralMethod: 'direct',
    status: 'invited',
    statusHistory: buildStatusHistory('invited', '2026-02-08'),
    createdAt: '2026-02-08T12:00:00Z',
  },

  // --- agent-007 (Diego - inactive) - 2 prospects ---
  {
    id: 'prospect-028',
    name: 'Daniela Olvera Tapia',
    phone: '+52 81 7777 0001',
    email: 'daniela.olvera@gmail.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 80000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-007',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-15'),
    createdAt: '2025-11-15T10:10:00Z',
  },
  {
    id: 'prospect-029',
    name: 'Gustavo Adolfo Barrera Leal',
    phone: '+52 81 7777 0002',
    email: 'gustavo.barrera@outlook.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 45000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-007',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-12-12'),
    createdAt: '2025-12-12T14:20:00Z',
  },

  // --- agent-008 (Sofía) - 2 prospects ---
  {
    id: 'prospect-030',
    name: 'Rafael Ignacio Ayala Coronado',
    phone: '+52 55 8888 0001',
    email: 'rafael.ayala@gmail.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 110000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-008',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-12-01'),
    createdAt: '2025-12-01T13:00:00Z',
  },
  {
    id: 'prospect-031',
    name: 'Alejandra Galván Ochoa',
    phone: '+52 55 8888 0002',
    email: 'alejandra.galvan@hotmail.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 55000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-008',
    referralMethod: 'invite_link',
    inviteLinkId: 'link-008',
    status: 'registered',
    statusHistory: buildStatusHistory('registered', '2026-01-18'),
    createdAt: '2026-01-18T10:50:00Z',
  },

  // --- agent-009 (Carlos - inactive) - 1 prospect ---
  {
    id: 'prospect-032',
    name: 'Irma Susana Maldonado Quiroz',
    phone: '+52 33 9999 0001',
    email: 'irma.maldonado@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 200000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-009',
    referralMethod: 'direct',
    status: 'churn',
    statusHistory: buildStatusHistory('churn', '2025-11-20'),
    createdAt: '2025-11-20T15:30:00Z',
  },

  // --- agent-010 (Valentina) - 3 prospects ---
  {
    id: 'prospect-033',
    name: 'Germán Alonso Palacios Rivera',
    phone: '+52 81 1010 0001',
    email: 'german.palacios@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 300000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-010',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-11-18'),
    createdAt: '2025-11-18T09:00:00Z',
  },
  {
    id: 'prospect-034',
    name: 'Erika Soledad Figueroa Rivas',
    phone: '+52 81 1010 0002',
    email: 'erika.figueroa@outlook.com',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 140000,
    program: 'empresa_eb2',
    referredByAgentId: 'agent-010',
    referralMethod: 'direct',
    status: 'active',
    statusHistory: buildStatusHistory('active', '2025-12-06'),
    createdAt: '2025-12-06T11:20:00Z',
  },
  {
    id: 'prospect-035',
    name: 'Juan Pablo Velasco Arellano',
    phone: '+52 81 1010 0003',
    email: 'juanpablo.velasco@gmail.com',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 250000,
    program: 'empresa_eb1',
    referredByAgentId: 'agent-010',
    referralMethod: 'direct',
    status: 'registered',
    statusHistory: buildStatusHistory('registered', '2026-01-25'),
    createdAt: '2026-01-25T14:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Transactions (70)
// ---------------------------------------------------------------------------

export const transactions: Transaction[] = [
  // -- prospect-001 (Alejandro Vega - agent-001, card_consumption) --
  { id: 'txn-001', prospectId: 'prospect-001', agentId: 'agent-001', type: 'funding', amount: 80000, description: 'Fondeo inicial - transferencia SPEI', createdAt: '2025-11-14T10:30:00Z' },
  { id: 'txn-002', prospectId: 'prospect-001', agentId: 'agent-001', type: 'card_purchase', amount: 4500, description: 'Compra en Liverpool Centro', createdAt: '2025-11-18T14:22:00Z' },
  { id: 'txn-003', prospectId: 'prospect-001', agentId: 'agent-001', type: 'card_purchase', amount: 12800, description: 'Compra en Palacio de Hierro Polanco', createdAt: '2025-12-02T11:15:00Z' },
  { id: 'txn-004', prospectId: 'prospect-001', agentId: 'agent-001', type: 'funding', amount: 50000, description: 'Segundo fondeo - transferencia SPEI', createdAt: '2025-12-20T09:00:00Z' },
  { id: 'txn-005', prospectId: 'prospect-001', agentId: 'agent-001', type: 'card_purchase', amount: 8900, description: 'Compra en Amazon México', createdAt: '2026-01-05T16:40:00Z' },
  { id: 'txn-006', prospectId: 'prospect-001', agentId: 'agent-001', type: 'card_purchase', amount: 2350, description: 'Compra en Costco Satélite', createdAt: '2026-01-22T13:10:00Z' },
  { id: 'txn-007', prospectId: 'prospect-001', agentId: 'agent-001', type: 'card_purchase', amount: 15000, description: 'Compra en Best Buy Perisur', createdAt: '2026-02-08T10:55:00Z' },

  // -- prospect-002 (Gabriela Muñoz - agent-001, funded) --
  { id: 'txn-008', prospectId: 'prospect-002', agentId: 'agent-001', type: 'funding', amount: 100000, description: 'Fondeo inicial - transferencia bancaria', createdAt: '2025-11-22T11:00:00Z' },
  { id: 'txn-009', prospectId: 'prospect-002', agentId: 'agent-001', type: 'funding', amount: 45000, description: 'Segundo fondeo - SPEI', createdAt: '2025-12-18T14:30:00Z' },

  // -- prospect-003 (Roberto Pacheco - agent-001, card_consumption) --
  { id: 'txn-010', prospectId: 'prospect-003', agentId: 'agent-001', type: 'funding', amount: 30000, description: 'Fondeo inicial - SPEI', createdAt: '2025-11-28T09:45:00Z' },
  { id: 'txn-011', prospectId: 'prospect-003', agentId: 'agent-001', type: 'card_purchase', amount: 3200, description: 'Compra en Soriana Híper', createdAt: '2025-12-05T12:30:00Z' },
  { id: 'txn-012', prospectId: 'prospect-003', agentId: 'agent-001', type: 'card_purchase', amount: 7600, description: 'Compra en Home Depot', createdAt: '2025-12-22T15:20:00Z' },
  { id: 'txn-013', prospectId: 'prospect-003', agentId: 'agent-001', type: 'card_purchase', amount: 1450, description: 'Compra en Farmacia Guadalajara', createdAt: '2026-01-10T10:05:00Z' },
  { id: 'txn-014', prospectId: 'prospect-003', agentId: 'agent-001', type: 'funding', amount: 20000, description: 'Fondeo adicional - SPEI', createdAt: '2026-02-03T08:30:00Z' },

  // -- prospect-005 (Miguel Fuentes - agent-001, funded) --
  { id: 'txn-015', prospectId: 'prospect-005', agentId: 'agent-001', type: 'funding', amount: 75000, description: 'Fondeo inicial - transferencia SPEI', createdAt: '2025-12-19T10:00:00Z' },

  // -- prospect-007 (Héctor Jiménez - agent-002, card_consumption) --
  { id: 'txn-016', prospectId: 'prospect-007', agentId: 'agent-002', type: 'funding', amount: 90000, description: 'Fondeo inicial - SPEI', createdAt: '2025-11-16T09:30:00Z' },
  { id: 'txn-017', prospectId: 'prospect-007', agentId: 'agent-002', type: 'card_purchase', amount: 6700, description: 'Compra en Sears Guadalajara', createdAt: '2025-11-25T11:45:00Z' },
  { id: 'txn-018', prospectId: 'prospect-007', agentId: 'agent-002', type: 'card_purchase', amount: 11200, description: 'Compra en Sanborns', createdAt: '2025-12-10T14:00:00Z' },
  { id: 'txn-019', prospectId: 'prospect-007', agentId: 'agent-002', type: 'funding', amount: 60000, description: 'Segundo fondeo - SPEI', createdAt: '2026-01-02T10:15:00Z' },
  { id: 'txn-020', prospectId: 'prospect-007', agentId: 'agent-002', type: 'card_purchase', amount: 3400, description: 'Compra en Chedraui', createdAt: '2026-01-15T12:30:00Z' },
  { id: 'txn-021', prospectId: 'prospect-007', agentId: 'agent-002', type: 'card_purchase', amount: 9500, description: 'Compra en Mercado Libre', createdAt: '2026-02-05T16:20:00Z' },

  // -- prospect-008 (Claudia Medina - agent-002, funded) --
  { id: 'txn-022', prospectId: 'prospect-008', agentId: 'agent-002', type: 'funding', amount: 40000, description: 'Fondeo inicial - SPEI', createdAt: '2025-11-28T13:20:00Z' },
  { id: 'txn-023', prospectId: 'prospect-008', agentId: 'agent-002', type: 'funding', amount: 25000, description: 'Segundo fondeo - transferencia', createdAt: '2026-01-08T09:00:00Z' },

  // -- prospect-009 (Enrique Domínguez - agent-002, card_consumption) --
  { id: 'txn-024', prospectId: 'prospect-009', agentId: 'agent-002', type: 'funding', amount: 55000, description: 'Fondeo inicial - SPEI', createdAt: '2025-12-12T10:30:00Z' },
  { id: 'txn-025', prospectId: 'prospect-009', agentId: 'agent-002', type: 'card_purchase', amount: 4800, description: 'Compra en Suburbia', createdAt: '2025-12-20T15:45:00Z' },
  { id: 'txn-026', prospectId: 'prospect-009', agentId: 'agent-002', type: 'card_purchase', amount: 14200, description: 'Compra en Liverpool Guadalajara', createdAt: '2026-01-18T11:00:00Z' },
  { id: 'txn-027', prospectId: 'prospect-009', agentId: 'agent-002', type: 'card_purchase', amount: 2100, description: 'Compra en Oxxo Pay', createdAt: '2026-02-12T08:40:00Z' },

  // -- prospect-012 (Laura Campos - agent-003, card_consumption) --
  { id: 'txn-028', prospectId: 'prospect-012', agentId: 'agent-003', type: 'funding', amount: 35000, description: 'Fondeo inicial - SPEI', createdAt: '2025-11-20T09:15:00Z' },
  { id: 'txn-029', prospectId: 'prospect-012', agentId: 'agent-003', type: 'card_purchase', amount: 5600, description: 'Compra en Elektra', createdAt: '2025-12-01T12:00:00Z' },
  { id: 'txn-030', prospectId: 'prospect-012', agentId: 'agent-003', type: 'card_purchase', amount: 8300, description: 'Compra en Sam\'s Club', createdAt: '2025-12-18T10:30:00Z' },
  { id: 'txn-031', prospectId: 'prospect-012', agentId: 'agent-003', type: 'funding', amount: 25000, description: 'Segundo fondeo - SPEI', createdAt: '2026-01-14T14:00:00Z' },
  { id: 'txn-032', prospectId: 'prospect-012', agentId: 'agent-003', type: 'card_purchase', amount: 2900, description: 'Compra en Walmart', createdAt: '2026-02-02T09:50:00Z' },

  // -- prospect-013 (Óscar Nava - agent-003, funded) --
  { id: 'txn-033', prospectId: 'prospect-013', agentId: 'agent-003', type: 'funding', amount: 20000, description: 'Fondeo inicial - SPEI', createdAt: '2025-12-14T11:30:00Z' },
  { id: 'txn-034', prospectId: 'prospect-013', agentId: 'agent-003', type: 'funding', amount: 15000, description: 'Segundo fondeo - transferencia', createdAt: '2026-01-20T10:00:00Z' },

  // -- prospect-016 (Adrián Mora - agent-004, card_consumption) --
  { id: 'txn-035', prospectId: 'prospect-016', agentId: 'agent-004', type: 'funding', amount: 100000, description: 'Fondeo inicial - transferencia SPEI', createdAt: '2025-11-15T09:00:00Z' },
  { id: 'txn-036', prospectId: 'prospect-016', agentId: 'agent-004', type: 'card_purchase', amount: 8500, description: 'Compra en Palacio de Hierro Monterrey', createdAt: '2025-11-22T14:30:00Z' },
  { id: 'txn-037', prospectId: 'prospect-016', agentId: 'agent-004', type: 'card_purchase', amount: 12000, description: 'Compra en Apple Store', createdAt: '2025-12-05T11:45:00Z' },
  { id: 'txn-038', prospectId: 'prospect-016', agentId: 'agent-004', type: 'funding', amount: 70000, description: 'Segundo fondeo - SPEI', createdAt: '2025-12-28T10:00:00Z' },
  { id: 'txn-039', prospectId: 'prospect-016', agentId: 'agent-004', type: 'card_purchase', amount: 5200, description: 'Compra en Amazon México', createdAt: '2026-01-10T13:20:00Z' },
  { id: 'txn-040', prospectId: 'prospect-016', agentId: 'agent-004', type: 'card_purchase', amount: 9800, description: 'Compra en Innova Sport', createdAt: '2026-02-01T15:00:00Z' },

  // -- prospect-017 (Carmen Zavala - agent-004, funded) --
  { id: 'txn-041', prospectId: 'prospect-017', agentId: 'agent-004', type: 'funding', amount: 85000, description: 'Fondeo inicial - transferencia bancaria', createdAt: '2025-12-04T09:30:00Z' },
  { id: 'txn-042', prospectId: 'prospect-017', agentId: 'agent-004', type: 'funding', amount: 35000, description: 'Segundo fondeo - SPEI', createdAt: '2026-01-22T11:15:00Z' },

  // -- prospect-018 (Jorge Peña - agent-004, card_consumption) --
  { id: 'txn-043', prospectId: 'prospect-018', agentId: 'agent-004', type: 'funding', amount: 45000, description: 'Fondeo inicial - SPEI', createdAt: '2025-12-16T10:45:00Z' },
  { id: 'txn-044', prospectId: 'prospect-018', agentId: 'agent-004', type: 'card_purchase', amount: 6300, description: 'Compra en El Puerto de Liverpool', createdAt: '2025-12-28T14:10:00Z' },
  { id: 'txn-045', prospectId: 'prospect-018', agentId: 'agent-004', type: 'card_purchase', amount: 3800, description: 'Compra en HEB', createdAt: '2026-01-15T12:00:00Z' },
  { id: 'txn-046', prospectId: 'prospect-018', agentId: 'agent-004', type: 'card_purchase', amount: 10500, description: 'Compra en Zara', createdAt: '2026-02-06T16:30:00Z' },

  // -- prospect-020 (Arturo Cisneros - agent-004, funded) --
  { id: 'txn-047', prospectId: 'prospect-020', agentId: 'agent-004', type: 'funding', amount: 60000, description: 'Fondeo inicial - SPEI', createdAt: '2026-02-05T09:00:00Z' },

  // -- prospect-021 (Rosa León - agent-005, funded) --
  { id: 'txn-048', prospectId: 'prospect-021', agentId: 'agent-005', type: 'funding', amount: 15000, description: 'Fondeo inicial - depósito', createdAt: '2025-12-02T10:00:00Z' },
  { id: 'txn-049', prospectId: 'prospect-021', agentId: 'agent-005', type: 'funding', amount: 10000, description: 'Segundo fondeo - SPEI', createdAt: '2026-01-05T14:00:00Z' },

  // -- prospect-024 (Andrés Ruiz - agent-006, card_consumption) --
  { id: 'txn-050', prospectId: 'prospect-024', agentId: 'agent-006', type: 'funding', amount: 65000, description: 'Fondeo inicial - SPEI', createdAt: '2025-11-22T09:30:00Z' },
  { id: 'txn-051', prospectId: 'prospect-024', agentId: 'agent-006', type: 'card_purchase', amount: 7400, description: 'Compra en Sears', createdAt: '2025-12-03T13:45:00Z' },
  { id: 'txn-052', prospectId: 'prospect-024', agentId: 'agent-006', type: 'card_purchase', amount: 4100, description: 'Compra en Office Depot', createdAt: '2025-12-20T11:30:00Z' },
  { id: 'txn-053', prospectId: 'prospect-024', agentId: 'agent-006', type: 'funding', amount: 40000, description: 'Segundo fondeo - transferencia', createdAt: '2026-01-10T10:00:00Z' },
  { id: 'txn-054', prospectId: 'prospect-024', agentId: 'agent-006', type: 'card_purchase', amount: 13500, description: 'Compra en Nike Store', createdAt: '2026-01-28T15:20:00Z' },

  // -- prospect-025 (Paulina Acosta - agent-006, funded) --
  { id: 'txn-055', prospectId: 'prospect-025', agentId: 'agent-006', type: 'funding', amount: 50000, description: 'Fondeo inicial - SPEI', createdAt: '2025-12-12T11:00:00Z' },

  // -- prospect-026 (Francisco Bravo - agent-006, card_consumption) --
  { id: 'txn-056', prospectId: 'prospect-026', agentId: 'agent-006', type: 'funding', amount: 55000, description: 'Fondeo inicial - SPEI', createdAt: '2025-12-26T09:00:00Z' },
  { id: 'txn-057', prospectId: 'prospect-026', agentId: 'agent-006', type: 'card_purchase', amount: 9200, description: 'Compra en Coppel', createdAt: '2026-01-08T14:30:00Z' },
  { id: 'txn-058', prospectId: 'prospect-026', agentId: 'agent-006', type: 'card_purchase', amount: 5800, description: 'Compra en Sanborns', createdAt: '2026-01-25T10:45:00Z' },
  { id: 'txn-059', prospectId: 'prospect-026', agentId: 'agent-006', type: 'card_purchase', amount: 3600, description: 'Compra en Starbucks (corporativo)', createdAt: '2026-02-10T08:20:00Z' },

  // -- prospect-028 (Daniela Olvera - agent-007, card_consumption) --
  { id: 'txn-060', prospectId: 'prospect-028', agentId: 'agent-007', type: 'funding', amount: 25000, description: 'Fondeo inicial - SPEI', createdAt: '2025-11-24T10:00:00Z' },
  { id: 'txn-061', prospectId: 'prospect-028', agentId: 'agent-007', type: 'card_purchase', amount: 3100, description: 'Compra en C&A', createdAt: '2025-12-08T12:15:00Z' },
  { id: 'txn-062', prospectId: 'prospect-028', agentId: 'agent-007', type: 'card_purchase', amount: 4700, description: 'Compra en Linio', createdAt: '2026-01-12T15:50:00Z' },

  // -- prospect-029 (Gustavo Barrera - agent-007, funded) --
  { id: 'txn-063', prospectId: 'prospect-029', agentId: 'agent-007', type: 'funding', amount: 18000, description: 'Fondeo inicial - depósito', createdAt: '2025-12-22T09:00:00Z' },

  // -- prospect-030 (Rafael Ayala - agent-008, funded) --
  { id: 'txn-064', prospectId: 'prospect-030', agentId: 'agent-008', type: 'funding', amount: 40000, description: 'Fondeo inicial - SPEI', createdAt: '2025-12-10T11:00:00Z' },
  { id: 'txn-065', prospectId: 'prospect-030', agentId: 'agent-008', type: 'funding', amount: 30000, description: 'Segundo fondeo - transferencia', createdAt: '2026-01-20T09:30:00Z' },

  // -- prospect-032 (Irma Maldonado - agent-009, funded) --
  { id: 'txn-066', prospectId: 'prospect-032', agentId: 'agent-009', type: 'funding', amount: 95000, description: 'Fondeo inicial - transferencia bancaria', createdAt: '2025-11-30T10:15:00Z' },

  // -- prospect-033 (Germán Palacios - agent-010, card_consumption) --
  { id: 'txn-067', prospectId: 'prospect-033', agentId: 'agent-010', type: 'funding', amount: 80000, description: 'Fondeo inicial - SPEI', createdAt: '2025-11-26T09:00:00Z' },
  { id: 'txn-068', prospectId: 'prospect-033', agentId: 'agent-010', type: 'card_purchase', amount: 11500, description: 'Compra en Palacio de Hierro', createdAt: '2025-12-10T14:00:00Z' },
  { id: 'txn-069', prospectId: 'prospect-033', agentId: 'agent-010', type: 'card_purchase', amount: 6200, description: 'Compra en Amazon México', createdAt: '2026-01-05T16:30:00Z' },

  // -- prospect-034 (Erika Figueroa - agent-010, card_consumption) --
  { id: 'txn-070', prospectId: 'prospect-034', agentId: 'agent-010', type: 'funding', amount: 45000, description: 'Fondeo inicial - SPEI', createdAt: '2025-12-14T10:00:00Z' },
]

// ---------------------------------------------------------------------------
// Commissions (derived from transactions)
// ---------------------------------------------------------------------------

function deriveCommissions(): Commission[] {
  const result: Commission[] = []
  let idx = 1

  // Commissions are only generated from funding (wallet top-up) transactions
  const fundingTxns = transactions.filter((t) => t.type === 'funding')

  for (const txn of fundingTxns) {
    const rate = txn.amount >= 70000 ? 0.01 : 0.015
    const amount = Math.round(txn.amount * rate * 100) / 100
    const txnDate = new Date(txn.createdAt)

    // Commissions for transactions before January 2026 are paid;
    // January 2026 commissions are a mix; February 2026 are pending.
    let status: CommissionStatus = 'pending'
    let paidAt: string | undefined
    const period = `${txnDate.getFullYear()}-${String(txnDate.getMonth() + 1).padStart(2, '0')}`

    if (txnDate < new Date('2026-01-01')) {
      status = 'paid'
      const payDate = new Date(txnDate.getFullYear(), txnDate.getMonth() + 1, 15, 10, 0, 0)
      paidAt = payDate.toISOString()
    } else if (txnDate < new Date('2026-02-01')) {
      // January: first 60% paid, rest pending
      status = idx % 3 !== 0 ? 'paid' : 'pending'
      if (status === 'paid') {
        paidAt = '2026-02-15T10:00:00Z'
      }
    }

    const createdDate = new Date(txnDate)
    createdDate.setDate(createdDate.getDate() + 1)

    result.push({
      id: `comm-${String(idx).padStart(3, '0')}`,
      agentId: txn.agentId,
      prospectId: txn.prospectId,
      transactionId: txn.id,
      amount,
      rate,
      status,
      period,
      paidAt,
      createdAt: createdDate.toISOString(),
    })

    idx++
  }

  return result
}

export const commissions: Commission[] = deriveCommissions()

// ---------------------------------------------------------------------------
// Invite Links (8)
// ---------------------------------------------------------------------------

export const inviteLinks: InviteLink[] = [
  {
    id: 'link-001',
    agentId: 'agent-001',
    code: 'OLIMPO-RM-GOLD1',
    url: 'https://olimpo.mx/invite/OLIMPO-RM-GOLD1',
    program: 'empresa_eb1',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 250000,
    usedByProspectId: 'prospect-002',
    usedAt: '2025-11-12T14:35:00Z',
    createdAt: '2025-11-10T09:00:00Z',
    expiresAt: '2025-12-10T09:00:00Z',
  },
  {
    id: 'link-002',
    agentId: 'agent-001',
    code: 'OLIMPO-RM-SLV1',
    url: 'https://olimpo.mx/invite/OLIMPO-RM-SLV1',
    program: 'empresa_eb2',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 50000,
    usedByProspectId: 'prospect-006',
    usedAt: '2026-01-15T08:30:00Z',
    createdAt: '2026-01-10T12:00:00Z',
    expiresAt: '2026-02-10T12:00:00Z',
  },
  {
    id: 'link-003',
    agentId: 'agent-002',
    code: 'OLIMPO-MT-SLV1',
    url: 'https://olimpo.mx/invite/OLIMPO-MT-SLV1',
    program: 'empresa_eb2',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 200000,
    usedByProspectId: 'prospect-009',
    usedAt: '2025-12-02T15:40:00Z',
    createdAt: '2025-11-28T10:00:00Z',
    expiresAt: '2025-12-28T10:00:00Z',
  },
  {
    id: 'link-004',
    agentId: 'agent-003',
    code: 'OLIMPO-JR-SLV1',
    url: 'https://olimpo.mx/invite/OLIMPO-JR-SLV1',
    program: 'empresa_eb2',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 90000,
    usedByProspectId: 'prospect-014',
    usedAt: '2026-01-08T11:30:00Z',
    createdAt: '2026-01-05T08:00:00Z',
    expiresAt: '2026-02-05T08:00:00Z',
  },
  {
    id: 'link-005',
    agentId: 'agent-004',
    code: 'OLIMPO-AS-SLV1',
    url: 'https://olimpo.mx/invite/OLIMPO-AS-SLV1',
    program: 'empresa_eb2',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 150000,
    usedByProspectId: 'prospect-018',
    usedAt: '2025-12-08T10:55:00Z',
    createdAt: '2025-12-01T09:00:00Z',
    expiresAt: '2025-12-31T09:00:00Z',
  },
  {
    id: 'link-006',
    agentId: 'agent-005',
    code: 'OLIMPO-FC-STR1',
    url: 'https://olimpo.mx/invite/OLIMPO-FC-STR1',
    program: 'empresa_eb2',
    clientType: 'standard',
    creditAvailable: false,
    creditLineAmount: 0,
    usedByProspectId: 'prospect-023',
    usedAt: '2026-02-10T09:15:00Z',
    createdAt: '2026-02-01T10:00:00Z',
    expiresAt: '2026-03-01T10:00:00Z',
  },
  {
    id: 'link-007',
    agentId: 'agent-006',
    code: 'OLIMPO-LH-SLV2',
    url: 'https://olimpo.mx/invite/OLIMPO-LH-SLV2',
    program: 'empresa_eb2',
    clientType: 'vip',
    creditAvailable: true,
    creditLineAmount: 180000,
    usedByProspectId: 'prospect-026',
    usedAt: '2025-12-18T16:15:00Z',
    createdAt: '2025-12-15T09:00:00Z',
    expiresAt: '2026-01-15T09:00:00Z',
  },
  {
    id: 'link-008',
    agentId: 'agent-008',
    code: 'OLIMPO-SD-STR1',
    url: 'https://olimpo.mx/invite/OLIMPO-SD-STR1',
    program: 'empresa_eb2',
    clientType: 'standard',
    creditAvailable: true,
    creditLineAmount: 55000,
    usedByProspectId: 'prospect-031',
    usedAt: '2026-01-18T10:50:00Z',
    createdAt: '2026-01-12T14:00:00Z',
    expiresAt: '2026-02-12T14:00:00Z',
  },
]

// ---------------------------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------------------------

export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id)
}

export function getProspectById(id: string): Prospect | undefined {
  return prospects.find((p) => p.id === id)
}

export function getProspectsByAgent(agentId: string): Prospect[] {
  return prospects.filter((p) => p.referredByAgentId === agentId)
}

export function getTransactionsByAgent(agentId: string): Transaction[] {
  return transactions.filter((t) => t.agentId === agentId)
}

export function getTransactionsByProspect(prospectId: string): Transaction[] {
  return transactions.filter((t) => t.prospectId === prospectId)
}

export function getCommissionsByAgent(agentId: string): Commission[] {
  return commissions.filter((c) => c.agentId === agentId)
}

export function getInviteLinksByAgent(agentId: string): InviteLink[] {
  return inviteLinks.filter((l) => l.agentId === agentId)
}

export function getAgentStats(agentId: string): AgentStats {
  const agentProspects = getProspectsByAgent(agentId)
  const agentTransactions = getTransactionsByAgent(agentId)
  const agentCommissions = getCommissionsByAgent(agentId)

  const invited = agentProspects.filter((p) => p.status === 'invited').length
  const registered = agentProspects.filter((p) => p.status === 'registered').length
  const active = agentProspects.filter((p) => p.status === 'active').length
  const churn = agentProspects.filter((p) => p.status === 'churn').length

  const totalFunding = agentTransactions
    .filter((t) => t.type === 'funding')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPurchases = agentTransactions
    .filter((t) => t.type === 'card_purchase')
    .reduce((sum, t) => sum + t.amount, 0)

  const commissionGenerated = agentCommissions.reduce((sum, c) => sum + c.amount, 0)
  const commissionPaid = agentCommissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0)

  return {
    totalReferrals: agentProspects.length,
    invited,
    registered,
    active,
    churn,
    totalFunding,
    totalPurchases,
    commissionGenerated: Math.round(commissionGenerated * 100) / 100,
    commissionPaid: Math.round(commissionPaid * 100) / 100,
  }
}

export function getGlobalStats(filters?: DashboardFilters) {
  let filteredProspects = [...prospects]
  let filteredTransactions = [...transactions]
  let filteredCommissions = [...commissions]

  if (filters) {
    const { dateFrom, dateTo, clientType, program } = filters

    if (dateFrom) {
      const from = new Date(dateFrom)
      filteredProspects = filteredProspects.filter((p) => new Date(p.createdAt) >= from)
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.createdAt) >= from)
      filteredCommissions = filteredCommissions.filter((c) => new Date(c.createdAt) >= from)
    }

    if (dateTo) {
      const to = new Date(dateTo)
      filteredProspects = filteredProspects.filter((p) => new Date(p.createdAt) <= to)
      filteredTransactions = filteredTransactions.filter((t) => new Date(t.createdAt) <= to)
      filteredCommissions = filteredCommissions.filter((c) => new Date(c.createdAt) <= to)
    }

    if (clientType && clientType !== 'all') {
      filteredProspects = filteredProspects.filter((p) => p.clientType === clientType)
      const prospectIds = new Set(filteredProspects.map((p) => p.id))
      filteredTransactions = filteredTransactions.filter((t) => prospectIds.has(t.prospectId))
      filteredCommissions = filteredCommissions.filter((c) => prospectIds.has(c.prospectId))
    }

    if (program && program !== 'all') {
      filteredProspects = filteredProspects.filter((p) => p.program === program)
      const prospectIds = new Set(filteredProspects.map((p) => p.id))
      filteredTransactions = filteredTransactions.filter((t) => prospectIds.has(t.prospectId))
      filteredCommissions = filteredCommissions.filter((c) => prospectIds.has(c.prospectId))
    }
  }

  const totalReferrals = filteredProspects.length
  const invited = filteredProspects.filter((p) => p.status === 'invited').length
  const registered = filteredProspects.filter((p) => p.status === 'registered').length
  const active = filteredProspects.filter((p) => p.status === 'active').length
  const churn = filteredProspects.filter((p) => p.status === 'churn').length

  const totalFunding = filteredTransactions
    .filter((t) => t.type === 'funding')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalPurchases = filteredTransactions
    .filter((t) => t.type === 'card_purchase')
    .reduce((sum, t) => sum + t.amount, 0)

  const commissionGenerated = filteredCommissions.reduce((sum, c) => sum + c.amount, 0)
  const commissionPaid = filteredCommissions
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.amount, 0)
  const commissionPending = filteredCommissions
    .filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.amount, 0)

  const activeAgentIds = new Set(filteredProspects.map((p) => p.referredByAgentId))
  const vipCount = filteredProspects.filter((p) => p.clientType === 'vip').length
  const standardCount = filteredProspects.filter((p) => p.clientType === 'standard').length

  const programBreakdown = {
    empresa_eb1: filteredProspects.filter((p) => p.program === 'empresa_eb1').length,
    empresa_eb2: filteredProspects.filter((p) => p.program === 'empresa_eb2').length,
  }

  const conversionRate = totalReferrals > 0
    ? Math.round((active / totalReferrals) * 10000) / 100
    : 0

  const avgFundingPerProspect = active > 0
    ? Math.round(totalFunding / active)
    : 0

  return {
    totalReferrals,
    statusBreakdown: {
      invited,
      registered,
      active,
      churn,
    },
    totalFunding,
    totalPurchases,
    totalTransactionVolume: totalFunding + totalPurchases,
    commissionGenerated: Math.round(commissionGenerated * 100) / 100,
    commissionPaid: Math.round(commissionPaid * 100) / 100,
    commissionPending: Math.round(commissionPending * 100) / 100,
    activeAgents: activeAgentIds.size,
    clientTypeBreakdown: {
      vip: vipCount,
      standard: standardCount,
    },
    programBreakdown,
    conversionRate,
    avgFundingPerProspect,
  }
}

// ---------------------------------------------------------------------------
// Monthly Metrics (for agent chart)
// ---------------------------------------------------------------------------

export interface MonthlyMetric {
  label: string
  commissions: number
  referrals: number
  activations: number
  funding: number
}

export function getAgentMonthlyMetrics(agentId: string): MonthlyMetric[] {
  const agentProspects = getProspectsByAgent(agentId)
  const agentTxns = getTransactionsByAgent(agentId)
  const agentComms = getCommissionsByAgent(agentId)

  const periods = [
    { year: 2025, month: 9, label: 'Oct' },
    { year: 2025, month: 10, label: 'Nov' },
    { year: 2025, month: 11, label: 'Dic' },
    { year: 2026, month: 0, label: 'Ene' },
    { year: 2026, month: 1, label: 'Feb' },
  ]

  return periods.map(({ year, month, label }) => {
    const start = new Date(year, month, 1)
    const end = new Date(year, month + 1, 0, 23, 59, 59, 999)
    const inRange = (d: string) => {
      const dt = new Date(d)
      return dt >= start && dt <= end
    }

    const monthComms = agentComms.filter((c) => inRange(c.createdAt))
    const monthProspects = agentProspects.filter((p) => inRange(p.createdAt))
    const monthActivations = agentProspects.filter((p) => {
      const entry = p.statusHistory.find((h) => h.status === 'active')
      return entry ? inRange(entry.timestamp) : false
    })
    const monthFunding = agentTxns.filter(
      (t) => t.type === 'funding' && inRange(t.createdAt),
    )

    return {
      label,
      commissions: Math.round(
        monthComms.reduce((s, c) => s + c.amount, 0),
      ),
      referrals: monthProspects.length,
      activations: monthActivations.length,
      funding: monthFunding.reduce((s, t) => s + t.amount, 0),
    }
  })
}
