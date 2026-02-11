# Plan: Sistema de Analisis de Transcripts - Humand Sales Insights v2

## Context

Humand necesita extraer insights normalizados de 500+ transcripts de llamadas de ventas almacenados en una view de Supabase. Los insights deben ser categorizados segun una taxonomia HR completa para permitir analisis SQL y dashboards BI. Se usa la API de OpenAI (ChatGPT). Es un MVP one-shot (no recurrente).

**Prerequisito pendiente:** Credenciales de Supabase (URL + service key) y estructura de la view.

---

## 1. Taxonomia

### 1.1 Categorias HR y Modulos

Cada item tiene **codigo** (para DB/queries) y **display name** (para dashboards/visualizacion).

**Categorias HR:**

| Codigo | Display Name (ES) |
|--------|-------------------|
| `internal_communication` | Comunicacion Interna |
| `hr_administration` | Administracion de RRHH |
| `talent_acquisition` | Atraccion de Talento |
| `talent_development` | Desarrollo de Talento |
| `employee_experience` | Experiencia del Empleado |
| `compensation_and_benefits` | Compensaciones y Beneficios |
| `operations_and_workplace` | Operaciones y Lugar de Trabajo |

**Modulos por categoria (39 total):**

| Categoria | Modulo (codigo) | Display Name (ES) | Status |
|-----------|-----------------|-------------------|--------|
| `internal_communication` | `chat` | Chat | existing |
| `internal_communication` | `internal_social_network` | Red Social Interna | existing |
| `internal_communication` | `magazine` | Revista Interna | existing |
| `internal_communication` | `live_streaming` | Streaming en Vivo | existing |
| `internal_communication` | `knowledge_libraries` | Biblioteca de Conocimiento | existing |
| `internal_communication` | `quick_links` | Accesos Rapidos | existing |
| `hr_administration` | `digital_employee_file` | Legajo Digital | existing |
| `hr_administration` | `documents` | Documentos | existing |
| `hr_administration` | `files` | Archivos | existing |
| `hr_administration` | `company_policies` | Politicas de Empresa | existing |
| `hr_administration` | `forms_and_workflows` | Formularios y Flujos | existing |
| `hr_administration` | `org_chart` | Organigrama | existing |
| `hr_administration` | `digital_access` | Accesos Digitales | existing |
| `hr_administration` | `security_and_privacy` | Seguridad y Privacidad | existing |
| `hr_administration` | `payroll` | Nomina / Payroll | **missing** |
| `talent_acquisition` | `internal_job_postings` | Vacantes Internas | existing |
| `talent_acquisition` | `referral_program` | Programa de Referidos | existing |
| `talent_acquisition` | `onboarding` | Onboarding | existing |
| `talent_acquisition` | `ats` | ATS | **missing** |
| `talent_acquisition` | `ai_recruiter` | Reclutador con IA | **missing** |
| `talent_acquisition` | `recruitment` | Reclutamiento y Seleccion | **missing** |
| `talent_development` | `performance_review` | Evaluacion de Desempeno | existing |
| `talent_development` | `goals_and_okrs` | Objetivos y OKRs | existing |
| `talent_development` | `development_plan` | Plan de Desarrollo | existing |
| `talent_development` | `learning` | Capacitacion / LMS | existing |
| `talent_development` | `succession_planning` | Planes de Sucesion | **missing** |
| `talent_development` | `prebuilt_courses` | Cursos Listos | **missing** |
| `employee_experience` | `people_experience` | Experiencia de Empleado | existing |
| `employee_experience` | `surveys` | Encuestas | existing |
| `employee_experience` | `kudos` | Reconocimientos | existing |
| `employee_experience` | `birthdays_and_anniversaries` | Cumpleanos y Aniversarios | existing |
| `employee_experience` | `events` | Eventos | existing |
| `compensation_and_benefits` | `perks_and_benefits` | Beneficios y Perks | existing |
| `compensation_and_benefits` | `marketplace` | Marketplace | existing |
| `compensation_and_benefits` | `benefits_platform` | Plataforma de Beneficios | **missing** |
| `operations_and_workplace` | `time_off` | Vacaciones y Licencias | existing |
| `operations_and_workplace` | `time_tracking` | Control Horario | existing |
| `operations_and_workplace` | `space_reservation` | Reserva de Espacios | existing |
| `operations_and_workplace` | `service_management` | Mesa de Servicios | existing |

### 1.2 Aliases de Modulos (para normalizacion multilingual)

El system prompt incluira aliases por modulo para que el LLM reconozca menciones en cualquier idioma o formato informal.

| Modulo (canonical) | Aliases (ES) | Aliases (PT-BR) | Abreviaciones |
|---|---|---|---|
| Chat | Chat interno, Mensajeria interna, Mensajes directos, Chat de empleados | Chat interno, Mensagens | IM, DM |
| Time Tracking | Control horario, Fichaje, Reloj Checador, Marcacion digital | Controle de ponto, Registro de horas | -- |
| Onboarding | Induccion, Ruta de onboarding, Integracion inicial | Integracao, Onboarding de colaboradores | -- |
| Learning | Capacitacion, Formacion, Cursos, Campus digital | Treinamento, Capacitacao, Plataforma de cursos | LMS |
| Performance Review | Evaluacion de desempeno, Revision de desempeno | Avaliacao de desempenho | -- |
| Forms & Workflows | Formularios y flujos, Flujos de aprobacion, Circuitos | Formularios e fluxos, Aprovacoes | -- |
| Service Management | Mesa de servicios, Ticketing, Service Desk | Central de atendimento, Chamados | -- |
| Time Off | Vacaciones, Permisos, Novedades, Solicitud de permiso | Ferias, Afastamentos, Licencas | PTO |
| ... | *(39 modulos completos con aliases en taxonomy.py)* | | |

**En `taxonomy.py`**: Diccionario `MODULE_ALIASES` que mapea cada alias -> nombre canonico.

### 1.3 Insight Types

| Codigo | Display Name (ES) |
|--------|-------------------|
| `pain` | Dolor / Problema |
| `product_gap` | Feature Faltante |
| `competitive_signal` | Senal Competitiva |
| `deal_friction` | Friccion del Deal |
| `faq` | Pregunta Frecuente |

---

### 1.4 Pain Subtypes

Los pains se dividen en dos scopes:
- **Generales**: problemas organizacionales transversales, no atados a un modulo especifico.
- **Vinculados a modulo**: el dolor especifico que un modulo resuelve. Cada modulo tiene al menos 1 pain asociado.

El campo `module` en `tax_pain_subtypes` es NULL para generales, o el codigo del modulo para vinculados.
En `transcript_insights`, el campo `module` se completa siempre que el contexto lo permita (incluso para pains generales si se menciona un modulo).

**Temas (themes)** para agrupacion en dashboards:
`technology`, `processes`, `communication`, `talent`, `engagement`, `compensation`, `operations`, `data`, `compliance`

#### 1.4.1 Pains Generales (43)

**technology (8):**

| Codigo | Display Name |
|--------|-------------|
| `fragmented_tools` | Herramientas fragmentadas |
| `low_adoption` | Baja adopcion |
| `no_mobile_access` | Sin acceso movil |
| `outdated_technology` | Tecnologia obsoleta |
| `integration_issues` | Problemas de integracion |
| `vendor_fatigue` | Fatiga de proveedores |
| `poor_ux` | UX deficiente |
| `it_dependency` | Dependencia de IT |

**processes (6):**

| Codigo | Display Name |
|--------|-------------|
| `manual_processes` | Procesos manuales |
| `process_bottlenecks` | Cuellos de botella |
| `manager_burden` | Sobrecarga de managers |
| `employee_self_service` | Sin autogestion |
| `hr_admin_overload` | HR saturado en operacion |
| `paper_waste` | Desperdicio de papel |

**communication (6):**

| Codigo | Display Name |
|--------|-------------|
| `communication_gaps` | Brechas de comunicacion |
| `deskless_exclusion` | Exclusion de deskless |
| `email_unreachable` | Sin email corporativo |
| `information_asymmetry` | Asimetria de informacion |
| `internal_comm_overload` | Sobrecarga de canales |
| `multi_site_silos` | Silos entre sedes |

**talent (2):**

| Codigo | Display Name |
|--------|-------------|
| `turnover_retention` | Alta rotacion |
| `employer_brand` | Marca empleadora debil |

**engagement (4):**

| Codigo | Display Name |
|--------|-------------|
| `cultural_disconnection` | Desconexion cultural |
| `language_barriers` | Barreras de idioma |
| `no_sense_of_belonging` | Sin sentido de pertenencia |
| `remote_hybrid_challenges` | Desafios remoto/hibrido |

**data (5):**

| Codigo | Display Name |
|--------|-------------|
| `poor_visibility` | Falta de visibilidad |
| `reporting_limitations` | Reportes limitados |
| `data_silos` | Silos de datos |
| `manual_reporting` | Reportes manuales |
| `no_real_time_data` | Sin datos en tiempo real |

**compliance (12):**

| Codigo | Display Name |
|--------|-------------|
| `scaling_pain` | No escala |
| `compliance_risk` | Riesgo de compliance |
| `labor_law_complexity` | Complejidad legal laboral |
| `government_reporting` | Reportes al gobierno |
| `multi_country_complexity` | Complejidad multi-pais |
| `data_privacy` | Privacidad de datos |
| `audit_readiness` | Auditoria sin preparar |
| `cost_burden` | Costo excesivo |
| `security_concerns` | Seguridad de datos |
| `union_relations` | Relaciones sindicales |
| `seasonal_workforce` | Workforce estacional |
| `contractor_management` | Gestion de contratistas |

#### 1.4.2 Pains Vinculados a Modulo (44)

Cada fila indica el modulo que resuelve ese pain. Organizados por HR category.

**internal_communication (theme: communication):**

| Modulo | Codigo Pain | Display Name |
|--------|------------|-------------|
| `chat` | `informal_channel_use` | Canales informales |
| `internal_social_network` | `top_down_only` | Solo top-down |
| `magazine` | `fragmented_news` | Noticias dispersas |
| `live_streaming` | `crisis_communication` | Sin canal de crisis |
| `knowledge_libraries` | `scattered_knowledge` | Conocimiento disperso |
| `quick_links` | `resource_findability` | Recursos inaccesibles |

**hr_administration (theme: processes):**

| Modulo | Codigo Pain | Display Name |
|--------|------------|-------------|
| `digital_employee_file` | `paper_based_records` | Legajos en papel |
| `documents` | `document_chaos` | Caos documental |
| `files` | `file_disorganization` | Archivos desorganizados |
| `company_policies` | `policy_unacknowledged` | Politicas sin acuse |
| `forms_and_workflows` | `manual_approvals` | Aprobaciones manuales |
| `org_chart` | `org_opacity` | Estructura opaca |
| `digital_access` | `access_friction` | Accesos sin gestion |
| `security_and_privacy` | `data_exposure_risk` | Riesgo de exposicion |
| `payroll` | `payroll_complexity` | Complejidad de nomina |

**talent_acquisition (theme: talent):**

| Modulo | Codigo Pain | Display Name |
|--------|------------|-------------|
| `internal_job_postings` | `no_internal_mobility` | Sin movilidad interna |
| `referral_program` | `untapped_referrals` | Referidos desaprovechados |
| `onboarding` | `onboarding_delays` | Onboarding deficiente |
| `ats` | `manual_candidate_tracking` | Tracking manual candidatos |
| `ai_recruiter` | `screening_overload` | Sobrecarga de screening |
| `recruitment` | `recruitment_disorganization` | Seleccion desorganizada |

**talent_development (theme: talent):**

| Modulo | Codigo Pain | Display Name |
|--------|------------|-------------|
| `performance_review` | `no_performance_tracking` | Sin evaluacion desempeno |
| `performance_review` | `skill_gap_blind` | Skills gaps invisibles |
| `goals_and_okrs` | `misaligned_goals` | Objetivos desalineados |
| `development_plan` | `no_career_path` | Sin plan de carrera |
| `learning` | `training_gaps` | Brechas de capacitacion |
| `learning` | `training_compliance` | Sin tracking formativo |
| `succession_planning` | `succession_risk` | Riesgo de sucesion |
| `prebuilt_courses` | `no_training_content` | Sin contenido formativo |

**employee_experience (theme: engagement):**

| Modulo | Codigo Pain | Display Name |
|--------|------------|-------------|
| `people_experience` | `poor_employee_journey` | Journey fragmentado |
| `surveys` | `engagement_blind_spot` | Engagement sin medir |
| `surveys` | `feedback_absence` | Sin feedback continuo |
| `kudos` | `recognition_deficit` | Falta de reconocimiento |
| `birthdays_and_anniversaries` | `milestones_ignored` | Hitos sin celebrar |
| `events` | `event_disorganization` | Eventos desorganizados |

**compensation_and_benefits (theme: compensation):**

| Modulo | Codigo Pain | Display Name |
|--------|------------|-------------|
| `perks_and_benefits` | `manual_benefits_enrollment` | Alta manual beneficios |
| `marketplace` | `perks_invisible` | Perks sin visibilidad |
| `benefits_platform` | `benefits_fragmentation` | Beneficios dispersos |

**operations_and_workplace (theme: operations):**

| Modulo | Codigo Pain | Display Name |
|--------|------------|-------------|
| `time_off` | `absence_management` | Ausencias sin control |
| `time_tracking` | `time_attendance_chaos` | Asistencia sin control |
| `time_tracking` | `shift_scheduling` | Turnos sin planificar |
| `time_tracking` | `overtime_compliance` | Horas extra sin control |
| `space_reservation` | `space_conflicts` | Conflictos de espacios |
| `service_management` | `no_service_desk` | Sin mesa de servicios |

**Total pains: 43 generales + 44 vinculados = 87 subtypes.**

---

### 1.5 Product Gap

Cada product_gap **siempre esta asociado a un modulo**. El `feature_name` se normaliza desde un seed list para calcular recurrencias, pero **es extensible**: si el LLM detecta features no listadas, crea nuevos codigos que quedan disponibles para uso futuro.

**Campos:**
- `module` -- Modulo al que aplica (obligatorio, de los 39)
- `feature_name` -- Codigo normalizado (del seed o nuevo)
- `gap_description` -- Descripcion libre de lo que falta
- `gap_priority` -- `must_have` | `nice_to_have` | `dealbreaker`

**Seed list de feature_names (30):**

| Codigo | Display Name | Modulo sugerido |
|--------|-------------|-----------------|
| `payroll_integration` | Integracion de nomina | payroll |
| `ats_module` | Modulo de ATS | ats |
| `ai_recruiter` | Reclutador con IA | ai_recruiter |
| `succession_planning` | Planes de sucesion | succession_planning |
| `native_benefits_platform` | Plataforma de beneficios | benefits_platform |
| `prebuilt_courses` | Cursos listos | prebuilt_courses |
| `recruitment_module` | Modulo de seleccion | recruitment |
| `advanced_analytics` | Analytics avanzado | -- |
| `bi_dashboard` | Dashboard BI | -- |
| `sso_integration` | Integracion SSO | security_and_privacy |
| `api_access` | Acceso API | digital_access |
| `offline_mode` | Modo offline | -- |
| `multi_language_content` | Contenido multi-idioma | -- |
| `shift_scheduling` | Planificacion de turnos | time_tracking |
| `geofencing` | Geofencing | time_tracking |
| `expense_management` | Gestion de gastos | -- |
| `compensation_management` | Gestion de compensaciones | -- |
| `nine_box_grid` | Nine box grid | performance_review |
| `scorm_support` | Soporte SCORM | learning |
| `whatsapp_integration` | Integracion WhatsApp | chat |
| `sap_integration` | Integracion SAP | -- |
| `workday_integration` | Integracion Workday | -- |
| `custom_branding` | Branding personalizado | -- |
| `push_notifications` | Notificaciones push | -- |
| `video_conferencing` | Videoconferencia | live_streaming |
| `ai_chatbot` | Chatbot con IA | chat |
| `predictive_analytics` | Analytics predictivo | -- |
| `employee_wellness` | Bienestar del empleado | people_experience |
| `exit_interviews` | Entrevistas de salida | surveys |
| `anonymous_feedback` | Feedback anonimo | surveys |

**Nota:** El "modulo sugerido" es un default. En el insight, el modulo lo determina el LLM segun el contexto del transcript. Features con `--` son cross-cutting; el LLM asigna el modulo mas relevante del contexto.

**Extensibilidad:** Cuando el LLM genera un `feature_name` que no esta en el seed:
1. El parser valida formato slug (lowercase, underscores)
2. Se inserta en `tax_feature_names` con `is_seed = FALSE`
3. Queda disponible para normalizacion en futuros procesados

**Query para descubrir nuevas features:**
```sql
SELECT feature_name, module, COUNT(*) as freq
FROM transcript_insights
WHERE insight_type = 'product_gap'
  AND feature_name NOT IN (SELECT code FROM tax_feature_names WHERE is_seed = TRUE)
GROUP BY feature_name, module
ORDER BY freq DESC;
```

---

### 1.6 Competitive Signal

**Subtypes de relacion:**

| Codigo | Display Name |
|--------|-------------|
| `currently_using` | Usa actualmente |
| `evaluating` | Evaluando |
| `migrating_from` | Migrando desde |
| `comparing` | Comparando |
| `mentioned` | Mencionado |
| `previously_used` | Uso antes |

### 1.7 Deal Friction

| Codigo | Display Name |
|--------|-------------|
| `budget` | Restriccion presupuestaria |
| `timing` | Timing desalineado |
| `decision_maker` | Falta decisor |
| `legal` | Revision legal/compliance |
| `technical` | Complejidad tecnica |
| `change_management` | Resistencia al cambio |
| `champion_risk` | Champion en riesgo |
| `incumbent_lock_in` | Contrato existente |
| `scope_mismatch` | Alcance insuficiente |
| `security_review` | Revision de seguridad |
| `regional_requirements` | Requisitos regionales |
| `competing_priorities` | Prioridades competidoras |

### 1.8 FAQ

| Codigo | Display Name |
|--------|-------------|
| `pricing` | Precios |
| `implementation` | Implementacion |
| `integration` | Integraciones |
| `security` | Seguridad |
| `customization` | Personalizacion |
| `mobile` | App Movil |
| `support` | Soporte |
| `migration` | Migracion de datos |
| `scalability` | Escalabilidad |
| `analytics` | Analytics y reportes |
| `languages` | Idiomas |
| `adoption` | Adopcion |
| `compliance` | Compliance regulatorio |
| `roi` | ROI y business case |
| `content_management` | Gestion de contenido |

### 1.9 Competidores (lista normalizada)

**LATAM:** Buk, Factorial, Pandape, Rankmi, GoIntegro, Visma, Workplace (Meta), Microsoft Viva Engage, HiBob, Lapzo, Workvivo, Indigital, Esigtek, Defontana, Novasoft, PeopleForce, Sesame HR, Talento Zeus, Worky, Tress, Fortia, Meta4 (Cegid), Digitalware, Heinsohn, SAP SuccessFactors, Workday, Crehana, UBits, Talento Cloud, Connecto, Solides, Dialog, Convenia, Beehome, Alest, Comunitive, Hywork

**EMEA:** Beekeeper, Flip, Staffbase, Sage, Bizneo, Sesame, Blink, Sociabble, Zucchetti, Yoobic, Personio

**North America:** Simpplr, Firstup, Igloo Software, LumApps, Unily, Haiilo, Interact, Jostle, Poppulo, Connecteam, Assembly, BambooHR, Paylocity, Rippling, Culture Amp, Qualtrics, Lattice, 15Five, WorkTango, Glint, Microsoft Teams, Slack, Google Workspace, SharePoint, Speakapp, Workable

**APAC:** Workjam, Lark, Simplrr, Weconnect

---

## 2. Schema de Base de Datos

### 2.1 Tablas de Referencia (Taxonomia)

La taxonomia vive en tablas de referencia en Supabase. El script las puebla en el setup. Sirven para validacion, JOINs en dashboards, y extensibilidad.

```sql
-- Categorias HR
CREATE TABLE tax_hr_categories (
    code        TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    sort_order  INTEGER DEFAULT 0
);

-- Modulos
CREATE TABLE tax_modules (
    code         TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    hr_category  TEXT NOT NULL REFERENCES tax_hr_categories(code),
    status       TEXT NOT NULL CHECK (status IN ('existing', 'missing')),
    sort_order   INTEGER DEFAULT 0
);

-- Pain Subtypes (generales y vinculados a modulo)
CREATE TABLE tax_pain_subtypes (
    code         TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    description  TEXT,
    theme        TEXT NOT NULL,
    module       TEXT REFERENCES tax_modules(code),  -- NULL = general
    sort_order   INTEGER DEFAULT 0
);

-- Deal Friction Subtypes
CREATE TABLE tax_deal_friction_subtypes (
    code         TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    description  TEXT
);

-- FAQ Subtypes
CREATE TABLE tax_faq_subtypes (
    code         TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    description  TEXT
);

-- Competitive Relationships
CREATE TABLE tax_competitive_relationships (
    code         TEXT PRIMARY KEY,
    display_name TEXT NOT NULL,
    description  TEXT
);

-- Competidores
CREATE TABLE tax_competitors (
    name   TEXT PRIMARY KEY,
    region TEXT NOT NULL
);

-- Feature Names (seed + extensibles)
CREATE TABLE tax_feature_names (
    code            TEXT PRIMARY KEY,
    display_name    TEXT NOT NULL,
    suggested_module TEXT REFERENCES tax_modules(code),
    is_seed         BOOLEAN DEFAULT TRUE,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Tabla Principal de Insights

Solo codigos, sin display names duplicados. Los display names se resuelven via JOINs o la VIEW.

```sql
CREATE TABLE transcript_insights (
    id                      UUID DEFAULT gen_random_uuid() PRIMARY KEY,

    -- Source
    transcript_id           TEXT NOT NULL,
    transcript_chunk        INTEGER DEFAULT 0,

    -- CRM Context (de la view de Supabase)
    deal_id                 TEXT,
    deal_name               TEXT,
    company_name            TEXT,
    region                  TEXT,
    country                 TEXT,
    industry                TEXT,
    company_size            TEXT,
    deal_stage              TEXT,
    deal_owner              TEXT,
    call_date               DATE,

    -- Clasificacion (solo codigos)
    insight_type            TEXT NOT NULL,       -- pain | product_gap | competitive_signal | deal_friction | faq
    insight_subtype         TEXT NOT NULL,       -- Subtipo segun taxonomia

    -- Modulo (codigo, resuelto a categoria via JOIN)
    module                  TEXT,                -- chat, time_tracking, etc. (obligatorio para product_gap)

    -- Contenido
    summary                 TEXT NOT NULL,       -- Resumen normalizado 1-2 oraciones
    verbatim_quote          TEXT,                -- Cita textual del transcript
    confidence              REAL CHECK (confidence BETWEEN 0 AND 1),

    -- Competitive Signal
    competitor_name         TEXT,
    competitor_relationship TEXT,                -- currently_using | evaluating | etc.

    -- Product Gap
    feature_name            TEXT,                -- Codigo normalizado (seed o nuevo)
    gap_description         TEXT,
    gap_priority            TEXT,                -- must_have | nice_to_have | dealbreaker

    -- FAQ
    faq_topic               TEXT,

    -- Metadata
    model_used              TEXT NOT NULL,
    prompt_version          TEXT NOT NULL,
    batch_id                TEXT,
    content_hash            TEXT,                -- SHA256 para dedup
    processed_at            TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_insights_type ON transcript_insights(insight_type);
CREATE INDEX idx_insights_subtype ON transcript_insights(insight_subtype);
CREATE INDEX idx_insights_module ON transcript_insights(module);
CREATE INDEX idx_insights_competitor ON transcript_insights(competitor_name) WHERE competitor_name IS NOT NULL;
CREATE INDEX idx_insights_region ON transcript_insights(region);
CREATE INDEX idx_insights_deal ON transcript_insights(deal_id);
CREATE INDEX idx_insights_date ON transcript_insights(call_date);
CREATE INDEX idx_insights_feature ON transcript_insights(feature_name) WHERE feature_name IS NOT NULL;
CREATE UNIQUE INDEX idx_insights_content_hash ON transcript_insights(content_hash);
```

### 2.3 Vista para Dashboards

Resuelve todos los display names via JOINs. Usar esta vista para BI/dashboards.

```sql
CREATE OR REPLACE VIEW v_insights_dashboard AS
SELECT
    i.*,

    -- Insight type display
    CASE i.insight_type
        WHEN 'pain' THEN 'Dolor / Problema'
        WHEN 'product_gap' THEN 'Feature Faltante'
        WHEN 'competitive_signal' THEN 'Senal Competitiva'
        WHEN 'deal_friction' THEN 'Friccion del Deal'
        WHEN 'faq' THEN 'Pregunta Frecuente'
    END AS insight_type_display,

    -- Subtype display (union de todas las taxonomias)
    COALESCE(ps.display_name, df.display_name, fq.display_name, cr.display_name, i.insight_subtype)
        AS insight_subtype_display,

    -- Modulo
    m.display_name  AS module_display,
    m.status        AS module_status,
    m.hr_category   AS hr_category,
    hc.display_name AS hr_category_display,

    -- Pain theme
    ps.theme        AS pain_theme,
    CASE WHEN ps.module IS NOT NULL THEN 'module_linked' ELSE 'general' END AS pain_scope,

    -- Feature (product_gap)
    fn.display_name AS feature_display,
    fn.is_seed      AS feature_is_seed,

    -- Competitor relationship display
    crel.display_name AS competitor_relationship_display

FROM transcript_insights i
LEFT JOIN tax_modules m ON i.module = m.code
LEFT JOIN tax_hr_categories hc ON m.hr_category = hc.code
LEFT JOIN tax_pain_subtypes ps ON i.insight_subtype = ps.code AND i.insight_type = 'pain'
LEFT JOIN tax_deal_friction_subtypes df ON i.insight_subtype = df.code AND i.insight_type = 'deal_friction'
LEFT JOIN tax_faq_subtypes fq ON i.insight_subtype = fq.code AND i.insight_type = 'faq'
LEFT JOIN tax_competitive_relationships cr ON i.insight_subtype = cr.code AND i.insight_type = 'competitive_signal'
LEFT JOIN tax_competitive_relationships crel ON i.competitor_relationship = crel.code
LEFT JOIN tax_feature_names fn ON i.feature_name = fn.code;
```

---

## 3. Arquitectura del Script

### Estructura de archivos

```
ai-insights-v3/
+-- main.py                # Entry point con CLI (--dry-run, --sample N, --resume)
+-- config.py              # Variables de entorno, constantes
+-- taxonomy.py            # Modulos, categorias, pains, features, competidores
+-- models.py              # Pydantic models para Structured Output de OpenAI
+-- chunker.py             # Chunking token-aware con tiktoken
+-- prompt_builder.py      # System prompt con taxonomia completa + few-shot examples
+-- batch_processor.py     # OpenAI Batch API: crear JSONL, submit, poll, download
+-- parser.py              # Validacion, normalizacion, extension de features
+-- db.py                  # Cliente Supabase: leer view, escribir insights, gestionar taxonomia
+-- pipeline.py            # Orquestador: fetch -> chunk -> batch -> parse -> load
+-- schema.sql             # DDL completo: tablas de referencia + insights + vista
+-- seed_taxonomy.py       # Script para poblar tablas de referencia con datos iniciales
+-- state.json             # Estado de procesamiento para resume
+-- .env                   # SUPABASE_URL, SUPABASE_KEY, OPENAI_API_KEY
+-- requirements.txt       # openai, supabase, tiktoken, pydantic, tenacity, python-dotenv
+-- PLAN.md                # Este documento
```

### Pipeline de procesamiento

```
0. SETUP    -> Crear tablas (schema.sql) + poblar taxonomia (seed_taxonomy.py)
1. EXTRACT  -> Leer transcripts de Supabase view
2. CHUNK    -> Tokenizar con tiktoken, chunkar si >12K tokens (split en speaker turns)
3. BUILD    -> Generar archivo JSONL con prompts + taxonomia para cada transcript/chunk
4. SUBMIT   -> Enviar al OpenAI Batch API
5. POLL     -> Polling cada 60s hasta completar (~15-60 min)
6. PARSE    -> Descargar resultados, validar con Pydantic, extender features nuevos
7. LOAD     -> Upsert a Supabase con dedup por content_hash
```

### Modelo y costos

| Modelo | Costo estimado (500 transcripts) | Calidad |
|--------|----------------------------------|---------|
| **gpt-4o-mini + Batch API** | **~$1-2 USD** | Muy buena para extraccion |
| gpt-4o + Batch API | ~$20-25 USD | Excelente |

**Recomendacion:** gpt-4o-mini con Batch API (50% descuento). Validar con sample de 5-10 en gpt-4o primero.

### Estrategia de ejecucion

1. **Setup** -- Crear tablas, poblar taxonomia, configurar .env
2. **Dry run (5 transcripts)** -- Procesar con gpt-4o, revisar manualmente, iterar prompt
3. **Validation (25 transcripts)** -- Procesar con gpt-4o-mini, comparar calidad
4. **Full batch (500+)** -- Batch API con gpt-4o-mini, monitorear state.json
5. **Quality audit** -- Samplear 10%, verificar contra transcripts originales
6. **Analisis** -- Queries SQL de agregacion + dashboards BI

### Resume capability

`state.json` trackea progreso. Si el script se interrumpe, al reiniciar continua desde el ultimo checkpoint. El `content_hash` unico en la DB garantiza idempotencia.

### Configuracion del agente AI (OpenAI)

**Modelo:** `gpt-4o-mini` via Batch API (50% descuento sobre API normal).

**Structured Output:** Se usa `response_format` con JSON Schema de OpenAI para forzar el formato exacto. Esto elimina errores de parsing y garantiza que cada campo tenga el tipo correcto.

**Estrategia de prompt:**
- System prompt unico con taxonomia completa embebida (pains, modulos, features, competidores)
- El LLM recibe la taxonomia como referencia y debe clasificar usando SOLO codigos validos
- Few-shot examples (2-3) incluidos en el system prompt para calibrar formato y profundidad
- Instrucciones explicitas de normalizacion: "Si detectas una feature que no esta en la seed list, crea un codigo slug nuevo"
- Temperature 0 para maxima consistencia

**Eficiencia de tokens:**
- System prompt se reutiliza para todos los requests (el Batch API lo cachea internamente)
- Solo el transcript cambia entre requests
- Chunking a 12K tokens max por request para mantener calidad sin desperdiciar contexto

---

## 4. Flujo Automatizado End-to-End

El script maneja TODO el ciclo de vida. Un solo comando ejecuta cada fase.

### 4.1 Prerequisitos

| Que | Donde obtenerlo |
|-----|-----------------|
| Python 3.10+ | `python3 --version` |
| Cuenta OpenAI con API key | platform.openai.com/api-keys |
| Proyecto Supabase con la view de transcripts | app.supabase.com |
| Supabase URL + Service Role Key | Settings > API en Supabase |

### 4.2 Setup inicial (una sola vez)

```bash
# 1. Clonar o ir al directorio del proyecto
cd ai-insights-v3

# 2. Crear entorno virtual e instalar dependencias
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 3. Configurar credenciales
cp .env.example .env
# Editar .env con:
#   SUPABASE_URL=https://xxxxx.supabase.co
#   SUPABASE_KEY=eyJhbG...  (service role key)
#   OPENAI_API_KEY=sk-...

# 4. Crear tablas en Supabase y poblar taxonomia
python main.py setup
```

El comando `setup` hace todo automaticamente:
1. Ejecuta `schema.sql` contra Supabase (crea 8 tablas de referencia + tabla principal + vista)
2. Ejecuta `seed_taxonomy.py` (inserta las 7 categorias, 39 modulos, 87 pains, 30 features, 80+ competidores, etc.)
3. Valida que todo se creo correctamente

### 4.3 Ejecucion del pipeline

```bash
# Dry run: 5 transcripts con gpt-4o (para validar prompt)
python main.py run --sample 5 --model gpt-4o

# Validacion: 25 transcripts con gpt-4o-mini (comparar calidad vs costo)
python main.py run --sample 25 --model gpt-4o-mini

# Full batch: todos los transcripts con Batch API
python main.py run --model gpt-4o-mini

# Resumir si se interrumpio
python main.py run --resume

# Ver estado del batch en curso
python main.py status
```

**Modos de ejecucion:**

| Flag | Que hace |
|------|----------|
| `--sample N` | Procesa solo N transcripts (para testing). Usa API directa (no batch) para feedback inmediato |
| `--model gpt-4o` | Usa gpt-4o (mejor calidad, mas caro). Default: gpt-4o-mini |
| `--resume` | Retoma desde el ultimo checkpoint en state.json |
| `--dry-run` | Genera el JSONL pero no lo envia a OpenAI (para inspeccionar prompts) |
| (sin flags) | Procesa TODOS los transcripts via Batch API |

**Que pasa internamente al correr `python main.py run`:**

```
1. Conecta a Supabase, lee todos los transcripts de la view
2. Filtra los ya procesados (por content_hash en DB)
3. Chunkea transcripts largos (>12K tokens) en speaker turns
4. Genera archivo batch_input.jsonl con un request por chunk
5. Sube el JSONL a OpenAI y crea el batch
6. Hace polling cada 60s hasta que el batch termina
7. Descarga resultados, valida con Pydantic
8. Features nuevas se auto-insertan en tax_feature_names
9. Inserta insights en transcript_insights con dedup
10. Actualiza state.json con el progreso
```

### 4.4 Donde correrlo

| Opcion | Costo | Ideal para |
|--------|-------|------------|
| **Tu maquina local** | $0 | MVP, dry runs, batches unicos |
| GitHub Codespace | Gratis (60h/mes) | Si no queres instalar nada local |
| Google Cloud Shell | Gratis | Alternativa cloud, Python preinstalado |

**Recomendacion:** Correrlo local. Es un script one-shot que tarda ~30 min en batch. No necesita infraestructura.

### 4.5 Costos totales del pipeline

| Concepto | Costo |
|----------|-------|
| OpenAI Batch API (500 transcripts, gpt-4o-mini) | ~$1-2 USD |
| Supabase Free Tier (500MB, 50K rows) | $0 |
| Script Python local | $0 |
| **Total** | **~$1-2 USD** |

---

## 5. Herramientas BI para Analisis de Resultados

Los insights quedan en Supabase (PostgreSQL). Cualquier herramienta BI que conecte a Postgres puede usarse. La vista `v_insights_dashboard` ya tiene todos los display names resueltos.

### 5.1 Opciones evaluadas

| Herramienta | Costo (equipo ~5 personas) | Setup | Interactividad | Compartir acceso |
|-------------|---------------------------|-------|-----------------|-------------------|
| **Metabase Cloud** | $0 (starter hasta 5 users) | 5 min | Alta (filtros, drill-down, SQL) | Link + login |
| **Streamlit Community Cloud** | $0 | 30 min (Python) | Media (sliders, filtros custom) | Link publico o privado |
| **Looker Studio (Google)** | $0 | 15 min | Alta (drag & drop) | Link Google |
| **Apache Superset** (self-host) | $0 (hosting aparte) | 1-2h | Alta | Login propio |
| **Preset.io** (Superset cloud) | $0 (hasta 5 users) | 10 min | Alta | Link + login |
| Evidence.dev | $0 | 30 min (markdown + SQL) | Media | Deploy estatico |

### 5.2 Recomendacion

**Opcion A (mas rapida): Metabase Cloud Starter**
- Gratis para hasta 5 usuarios
- Conectar directo a Supabase Postgres (connection string del proyecto)
- Crear dashboards drag & drop sin codigo
- Filtros interactivos por region, modulo, insight_type, competitor, etc.
- Los usuarios del equipo entran con email, ven los dashboards y pueden explorar
- Setup: 5 minutos (crear cuenta, pegar connection string, apuntar a `v_insights_dashboard`)

**Opcion B (mas customizable): Streamlit app**
- Script Python incluido en el proyecto (`dashboard.py`)
- Deploy gratis en Streamlit Community Cloud
- Control total de visualizaciones y logica
- Bueno si quieren iterar rapido sobre los charts
- Setup: 30 min (deploy, configurar secrets)

**Opcion C (Google ecosystem): Looker Studio**
- Si el equipo ya usa Google Workspace
- Conector Postgres nativo
- Dashboards muy presentables para stakeholders
- Setup: 15 min

### 5.3 Conexion a Supabase desde BI

Todas las herramientas usan la misma conexion Postgres:

```
Host:     db.<project-ref>.supabase.co
Port:     5432
Database: postgres
User:     postgres
Password: [database password de Supabase]
```

Apuntar queries/datasources a la vista `v_insights_dashboard` que ya resuelve todos los display names.

### 5.4 Dashboards sugeridos

1. **Overview**: Total insights por tipo, distribucion por region, top 10 pains
2. **Pain Analysis**: Heatmap pains x modulo, pains generales vs module-linked, trend por industria
3. **Product Gaps**: Ranking de features faltantes, frecuencia por modulo, prioridad (must_have vs nice_to_have)
4. **Competitive Landscape**: Market share por competidor, relationship type, competidores por region
5. **Deal Friction**: Blockers mas comunes, friccion por deal stage
6. **FAQ Patterns**: Preguntas mas frecuentes, por tema, gap de documentacion

---

## 6. Verificacion

- [ ] `python main.py setup` crea todas las tablas y puebla taxonomia sin errores
- [ ] Dry run con 5 transcripts produce insights coherentes
- [ ] Todos los insight_type y subtype son valores validos de la taxonomia
- [ ] Sin overlap ni ambiguedad entre pain subtypes (general vs module-linked)
- [ ] Competidores normalizados correctamente
- [ ] Modulos mapeados correctamente a categorias HR
- [ ] module_status refleja existing/missing segun la lista real
- [ ] Product gap siempre tiene modulo asociado
- [ ] Features nuevas se insertan en tax_feature_names automaticamente
- [ ] v_insights_dashboard resuelve todos los display names correctamente
- [ ] Queries SQL de agregacion retornan resultados esperados
- [ ] Full batch de 500+ transcripts completa sin errores (<5% failures)
- [ ] Content_hash previene duplicados en re-runs
- [ ] Herramienta BI conectada a Supabase y mostrando datos de v_insights_dashboard
- [ ] Equipo tiene acceso a dashboards y puede filtrar/explorar
