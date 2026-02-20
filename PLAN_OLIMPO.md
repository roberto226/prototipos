# Olimpo - Programa de Referenciacion: Plan de Implementacion

## 1. Setup del Proyecto

Crear un proyecto Next.js 15 nuevo en:
`/Users/roberto/.../RBG-Prototipos/Nimbus/olimpo`

### Dependencias
- `next@^15.3.0`, `react@^19`, `react-dom@^19`
- `framer-motion@^12.0.0`, `lucide-react@^0.460.0`
- `clsx@^2.1.0`, `tailwind-merge@^3.0.0`
- `tailwindcss@^4.0.0`, `@tailwindcss/postcss@^4.0.0`
- TypeScript 5

### Arquitectura: Dos apps en un proyecto

Se usan **Route Groups** de Next.js para separar las dos apps:

- **`(admin)`** - Panel de administrador. Layout con sidebar lateral + topbar. Desktop-first.
- **`(agent)`** - WebApp del agente. Layout mobile-first con bottom navigation.

Ambas comparten: design system (`ui/`), componentes compartidos (`shared/`), tipos (`lib/types.ts`), mock data (`lib/mock-data.ts`).

---

## 2. Estructura de Carpetas

```
olimpo/
  src/
    app/
      globals.css
      layout.tsx                 # Root layout (fonts Inter + Nunito)
      page.tsx                   # Selector: Admin Panel / Agent Portal
      (admin)/
        layout.tsx               # Sidebar + Topbar
        dashboard/page.tsx       # Dashboard de monitoreo
        agents/page.tsx          # Lista de agentes
        agents/new/page.tsx      # Alta de agente
        agents/[id]/page.tsx     # Detalle/editar agente
        referrals/page.tsx       # Todas las referenciaciones
        commissions/page.tsx     # Comisiones
      (agent)/
        layout.tsx               # Header + Bottom Nav
        panel/page.tsx           # Dashboard del agente
        register/page.tsx        # Registrar prospecto
        invite/page.tsx          # Generar link de invitacion
        my-referrals/page.tsx    # Mis referenciaciones
    components/
      ui/                        # Design system primitivos
        button.tsx, input.tsx, select.tsx, badge.tsx, card.tsx,
        data-table.tsx, stat-card.tsx, progress-bar.tsx,
        status-dot.tsx, modal.tsx, toggle.tsx, avatar.tsx,
        empty-state.tsx, toast.tsx
      admin/                     # Componentes del admin
        AdminSidebar.tsx, AdminTopbar.tsx, AgentTable.tsx,
        AgentForm.tsx, ReferralTable.tsx, CommissionTable.tsx,
        DashboardKPIGrid.tsx, DashboardCharts.tsx,
        FilterBar.tsx, StatusTimeline.tsx
      agent/                     # Componentes del agente
        AgentBottomNav.tsx, AgentHeader.tsx, ProspectForm.tsx,
        InviteLinkCard.tsx, AgentStatsGrid.tsx, ReferralCard.tsx,
        ReferralList.tsx, CommissionSummary.tsx
      shared/                    # Compartidos entre ambas apps
        OlimpoLogo.tsx, StatusBadge.tsx, GradientBorder.tsx,
        AnimatedCounter.tsx, ScrollFadeIn.tsx, GlowOrb.tsx,
        GridPattern.tsx
    lib/
      cn.ts                      # clsx + tailwind-merge
      types.ts                   # Interfaces TypeScript
      mock-data.ts               # Datos demo
      constants.ts               # Status maps, program labels
      formatters.ts              # Formateo de moneda, fechas
      utils.ts                   # Generacion de links, helpers
    hooks/
      useAnimatedNumber.ts       # Animacion de contadores
      useMockRealtime.ts         # Simular datos en tiempo real
```

---

## 3. Modelo de Datos (TypeScript)

```typescript
type ClientType = 'vip' | 'standard'
type ReferralStatus = 'registered' | 'activated' | 'funded' | 'card_consumption'
type CommissionStatus = 'pending' | 'paid'
type OlimpoProgram = 'olimpo_gold' | 'olimpo_silver' | 'olimpo_starter'

interface Agent {
  id, name, email, phone, avatarUrl?, status
  permissions: {
    canReferVIP, canReferStandard, canGrantCredit, maxCreditLineAmount
  }
}

interface Prospect {
  id, name, phone?, email?, clientType, creditAvailable,
  creditLineAmount, program, referredByAgentId,
  referralMethod: 'direct' | 'invite_link',
  inviteLinkId?, status, statusHistory[], createdAt
}

interface Transaction {
  id, prospectId, agentId, type: 'funding' | 'card_purchase',
  amount, description, createdAt
}

interface Commission {
  id, agentId, prospectId, transactionId?, amount, rate,
  status, period, paidAt?, createdAt
}

interface InviteLink {
  id, agentId, code, url, program, clientType,
  creditAvailable, creditLineAmount, usedByProspectId?,
  usedAt?, createdAt, expiresAt
}
```

---

## 4. Paginas y Contenido

### Root
| Ruta | Contenido |
|------|-----------|
| `/` | Selector con 2 cards grandes: "Admin Panel" y "Agent Portal" |

### Admin Panel
| Ruta | Contenido |
|------|-----------|
| `/dashboard` | Grid de 6-8 KPIs, barra de filtros (fecha, tipo, programa), grafico de embudo (Registrado->Activado->Fondeado->Consumo), grafico de volumen, tabla de referenciaciones recientes |
| `/agents` | Tabla de agentes con busqueda y boton "Agregar Agente" |
| `/agents/new` | Formulario de alta de agente con permisos |
| `/agents/[id]` | Detalle del agente: info, stats, referenciaciones, comisiones |
| `/referrals` | Tabla completa de referenciaciones con filtros y timeline de status |
| `/commissions` | Tabla de comisiones con resumen: generadas, pagadas, pendientes |

### Agent WebApp
| Ruta | Contenido |
|------|-----------|
| `/panel` | Dashboard del agente: bienvenida, 4 stat cards, referenciaciones recientes, resumen de comisiones, indicador "Live" |
| `/register` | Formulario completo de registro de prospecto con validacion |
| `/invite` | Configurar y generar link de invitacion, card con botones de compartir (WhatsApp, SMS, copiar), historial de links |
| `/my-referrals` | Lista de referenciaciones con tabs de filtro (Todas, Registradas, Activadas, Fondeadas, Activas) |

---

## 5. Design System

### Tokens de Color (Dark Theme)
- **Surfaces**: `#0a0a0a` (base), `#111111` (raised), `#0e0e0e` (overlay), `#1a1a1a` (hover)
- **Borders**: `white/6%`, `white/14%` hover, `white/20%` strong
- **Text**: white 100%, 85%, 50%, 25%
- **Accent**: `#34C759` (green)
- **Gradiente**: Sky `#4FC3F7` -> Teal `#2DD4BF` -> Mint `#6EE7B7`
- **Status referenciacion**: Registrado (sky), Activado (teal), Fondeado (mint), Consumo (green)

### Patrones Visuales
- Cards: `rounded-2xl bg-[#111111] border border-white/[0.06]`
- Inputs: `bg-white/[0.05] border-white/[0.08] placeholder:text-white/25`
- Boton primario: gradient border sky-teal-green, hover invierte a blanco
- Tablas: rows hover `bg-white/[0.03]`, dividers `border-white/[0.04]`
- Ambient effects: GlowOrbs, GridPattern, gradient text animado

### Animaciones (Framer Motion)
- Easing universal: `[0.16, 1, 0.3, 1]`
- Scroll fade-in: `opacity:0, y:16` con `useInView`
- Stagger children: `0.08-0.12s` delay
- Contadores animados: count-up desde 0
- Status pulse: `scale:[1,1.3,1]` repeat
- Shimmer: translate-x gradient para loading
- Gradient border spinning: `@property --angle`

---

## 6. Mock Data

- **8-10 agentes** con permisos variados
- **30-40 prospectos** distribuidos entre agentes con diferentes status
- **60-80 transacciones** (fondeo + tarjeta) de los ultimos 3 meses
- **Comisiones** derivadas de transacciones, mix pagadas/pendientes
- **5-10 invite links** algunos usados, algunos activos
- **Funciones helper** para calcular agregados (stats por agente, KPIs filtrados)
- **Hook useMockRealtime** que actualiza valores cada 5-10s para simular tiempo real

---

## 7. Orden de Implementacion

### Fase 1: Fundacion
- Crear proyecto Next.js, instalar dependencias
- globals.css con tokens dark theme
- Root layout con fonts
- types.ts con todas las interfaces
- cn.ts utility
- Pagina root (selector Admin/Agent)

### Fase 2: Design System (14 componentes UI)
- button, card, badge, input, select, toggle
- stat-card, data-table, progress-bar
- modal, avatar, status-dot, empty-state, toast

### Fase 3: Componentes Compartidos
- OlimpoLogo, ScrollFadeIn, AnimatedCounter
- GradientBorder, StatusBadge, GlowOrb, GridPattern

### Fase 4: Mock Data + Utilities
- mock-data.ts con todos los arrays y helpers
- formatters.ts, constants.ts
- useMockRealtime hook

### Fase 5: Admin - Layout Shell
- AdminSidebar, AdminTopbar, layout.tsx del admin

### Fase 6: Admin - Dashboard
- DashboardKPIGrid, FilterBar, DashboardCharts
- Pagina /dashboard completa

### Fase 7: Admin - Gestion de Agentes
- AgentTable, AgentForm
- Paginas: /agents, /agents/new, /agents/[id]

### Fase 8: Admin - Referenciaciones y Comisiones
- ReferralTable, StatusTimeline, CommissionTable
- Paginas: /referrals, /commissions

### Fase 9: Agent - Layout Shell
- AgentBottomNav, AgentHeader, layout.tsx del agente

### Fase 10: Agent - Dashboard
- AgentStatsGrid, CommissionSummary, ReferralCard
- Pagina /panel

### Fase 11: Agent - Registro de Prospectos
- ProspectForm con validacion
- Pagina /register con estado de exito

### Fase 12: Agent - Links de Invitacion
- InviteLinkCard con share buttons
- Pagina /invite con generacion y historial

### Fase 13: Agent - Mis Referenciaciones
- ReferralList con tabs de filtro
- Pagina /my-referrals

### Fase 14: Polish
- Efectos ambient (GlowOrb, GridPattern) en todas las paginas
- Fine-tune de animaciones
- Loading states y empty states
- Responsive: admin tablet+, agent mobile
