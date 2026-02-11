# Humand Sales Insights - Taxonomia Completa

Documento de referencia con todas las clasificaciones usadas para extraer insights de llamadas de ventas. Esta taxonomia es la "fuente de verdad" que guia al modelo de IA.

Objetivo: que stakeholders de Producto, Ventas y CS puedan revisar, validar y proponer ajustes.

---

## 1. Tipos de Insight

Cada insight extraido de una llamada se clasifica en exactamente uno de estos 5 tipos:

| Codigo | Nombre | Cuando se usa | Ejemplo |
|--------|--------|---------------|---------|
| `pain` | Dolor / Problema | El prospecto describe un problema, frustracion o necesidad actual | "Hoy usamos WhatsApp para comunicarnos con planta y es un desastre" |
| `product_gap` | Feature Faltante | El prospecto pide una funcionalidad que no existe o no es suficiente | "Necesitariamos un modulo de nomina integrado" |
| `competitive_signal` | Senal Competitiva | Se menciona un competidor (lo usan, evaluan, comparan, migran) | "Estamos evaluando Buk para la parte de payroll" |
| `deal_friction` | Friccion del Deal | Algo que frena o bloquea el avance de la venta | "El presupuesto de este ano ya esta asignado" |
| `faq` | Pregunta Frecuente | El prospecto hace una pregunta sobre el producto/servicio | "Tienen app movil?" |

---

## 2. Categorias HR y Modulos

Los modulos de Humand se agrupan en 7 categorias HR. Cada modulo tiene un status: **existing** (ya existe en el producto) o **missing** (no existe aun, es un gap conocido).

### 2.1 Comunicacion Interna

| Codigo | Modulo | Status |
|--------|--------|--------|
| `chat` | Chat | Existente |
| `internal_social_network` | Red Social Interna | Existente |
| `magazine` | Revista Interna | Existente |
| `live_streaming` | Streaming en Vivo | Existente |
| `knowledge_libraries` | Biblioteca de Conocimiento | Existente |
| `quick_links` | Accesos Rapidos | Existente |

### 2.2 Administracion de RRHH

| Codigo | Modulo | Status |
|--------|--------|--------|
| `digital_employee_file` | Legajo Digital | Existente |
| `documents` | Documentos | Existente |
| `files` | Archivos | Existente |
| `company_policies` | Politicas de Empresa | Existente |
| `forms_and_workflows` | Formularios y Flujos | Existente |
| `org_chart` | Organigrama | Existente |
| `digital_access` | Accesos Digitales | Existente |
| `security_and_privacy` | Seguridad y Privacidad | Existente |
| `payroll` | Nomina / Payroll | **Missing** |

### 2.3 Atraccion de Talento

| Codigo | Modulo | Status |
|--------|--------|--------|
| `internal_job_postings` | Vacantes Internas | Existente |
| `referral_program` | Programa de Referidos | Existente |
| `onboarding` | Onboarding | Existente |
| `ats` | ATS | **Missing** |
| `ai_recruiter` | Reclutador con IA | **Missing** |
| `recruitment` | Reclutamiento y Seleccion | **Missing** |

### 2.4 Desarrollo de Talento

| Codigo | Modulo | Status |
|--------|--------|--------|
| `performance_review` | Evaluacion de Desempeno | Existente |
| `goals_and_okrs` | Objetivos y OKRs | Existente |
| `development_plan` | Plan de Desarrollo | Existente |
| `learning` | Capacitacion / LMS | Existente |
| `succession_planning` | Planes de Sucesion | **Missing** |
| `prebuilt_courses` | Cursos Listos | **Missing** |

### 2.5 Experiencia del Empleado

| Codigo | Modulo | Status |
|--------|--------|--------|
| `people_experience` | Experiencia de Empleado | Existente |
| `surveys` | Encuestas | Existente |
| `kudos` | Reconocimientos | Existente |
| `birthdays_and_anniversaries` | Cumpleanos y Aniversarios | Existente |
| `events` | Eventos | Existente |

### 2.6 Compensaciones y Beneficios

| Codigo | Modulo | Status |
|--------|--------|--------|
| `perks_and_benefits` | Beneficios y Perks | Existente |
| `marketplace` | Marketplace | Existente |
| `benefits_platform` | Plataforma de Beneficios | **Missing** |

### 2.7 Operaciones y Lugar de Trabajo

| Codigo | Modulo | Status |
|--------|--------|--------|
| `time_off` | Vacaciones y Licencias | Existente |
| `time_tracking` | Control Horario | Existente |
| `space_reservation` | Reserva de Espacios | Existente |
| `service_management` | Mesa de Servicios | Existente |

**Resumen: 39 modulos total (30 existentes + 9 missing)**

---

## 3. Pain Subtypes (Tipos de Dolor)

Los dolores se dividen en dos grupos:
- **Generales** (43): no estan vinculados a un modulo especifico
- **Vinculados a modulo** (44): se refieren a un modulo concreto de Humand

### 3.1 Pains Generales

#### Tecnologia (8)

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `fragmented_tools` | Herramientas fragmentadas | Multiples herramientas desconectadas |
| `low_adoption` | Baja adopcion | Herramientas actuales con baja adopcion |
| `no_mobile_access` | Sin acceso movil | Sin acceso movil a herramientas HR |
| `outdated_technology` | Tecnologia obsoleta | Sistema legacy o desactualizado |
| `integration_issues` | Problemas de integracion | No se integra con sistemas existentes |
| `vendor_fatigue` | Fatiga de proveedores | Demasiados proveedores de software |
| `poor_ux` | UX deficiente | Interfaz poco intuitiva |
| `it_dependency` | Dependencia de IT | Cada cambio requiere intervencion de IT |

#### Procesos (6)

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `manual_processes` | Procesos manuales | Procesos en papel o Excel |
| `process_bottlenecks` | Cuellos de botella | Flujos de aprobacion lentos |
| `manager_burden` | Sobrecarga de managers | Managers gastan tiempo en admin HR |
| `employee_self_service` | Sin autogestion | Empleados no pueden gestionar tramites |
| `hr_admin_overload` | HR saturado en operacion | HR sin tiempo para estrategia |
| `paper_waste` | Desperdicio de papel | Costos de impresion y almacenamiento |

#### Comunicacion (6)

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `communication_gaps` | Brechas de comunicacion | Informacion no llega a todos |
| `deskless_exclusion` | Exclusion de deskless | Trabajadores sin escritorio excluidos |
| `email_unreachable` | Sin email corporativo | Empleados sin email ni acceso a intranet |
| `information_asymmetry` | Asimetria de informacion | Oficina informada, operarios no |
| `internal_comm_overload` | Sobrecarga de canales | Demasiados canales de comunicacion |
| `multi_site_silos` | Silos entre sedes | Cada sede es un silo de informacion |

#### Talento (2)

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `turnover_retention` | Alta rotacion | Rotacion alta especialmente en frontline |
| `employer_brand` | Marca empleadora debil | Dificultad para atraer talento |

#### Engagement (4)

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `cultural_disconnection` | Desconexion cultural | Empleados desconectados de la cultura |
| `language_barriers` | Barreras de idioma | Workforce multiidioma sin soporte |
| `no_sense_of_belonging` | Sin sentido de pertenencia | Empleados no sienten pertenencia |
| `remote_hybrid_challenges` | Desafios remoto/hibrido | Gestion de workforce remoto/hibrido |

#### Datos y Reportes (5)

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `poor_visibility` | Falta de visibilidad | Sin datos sobre la fuerza laboral |
| `reporting_limitations` | Reportes limitados | No puede generar reportes necesarios |
| `data_silos` | Silos de datos | Datos en sistemas sin vision unificada |
| `manual_reporting` | Reportes manuales | Reportes en Excel, toma horas |
| `no_real_time_data` | Sin datos en tiempo real | Sin visibilidad real-time |

#### Compliance y Operaciones (12)

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `scaling_pain` | No escala | Solucion no escala con crecimiento |
| `compliance_risk` | Riesgo de compliance | Riesgo de incumplimiento regulatorio |
| `labor_law_complexity` | Complejidad legal laboral | Leyes laborales por pais |
| `government_reporting` | Reportes al gobierno | Reportes obligatorios |
| `multi_country_complexity` | Complejidad multi-pais | Regulaciones distintas entre paises |
| `data_privacy` | Privacidad de datos | Preocupaciones LGPD/GDPR |
| `audit_readiness` | Auditoria sin preparar | No preparado para auditorias |
| `cost_burden` | Costo excesivo | Costo total de herramientas alto |
| `security_concerns` | Seguridad de datos | Seguridad de datos de empleados |
| `union_relations` | Relaciones sindicales | Complejidad con sindicatos |
| `seasonal_workforce` | Workforce estacional | Gestion de trabajadores estacionales |
| `contractor_management` | Gestion de contratistas | Administracion de tercerizados |

---

### 3.2 Pains Vinculados a Modulo

Estos dolores se asocian automaticamente al modulo indicado.

#### Comunicacion Interna (6)

| Codigo | Nombre | Modulo | Descripcion |
|--------|--------|--------|-------------|
| `informal_channel_use` | Canales informales | Chat | WhatsApp/canales personales para trabajo |
| `top_down_only` | Solo top-down | Red Social Interna | Sin canal para que empleados se expresen |
| `fragmented_news` | Noticias dispersas | Revista Interna | Noticias internas dispersas sin canal central |
| `crisis_communication` | Sin canal de crisis | Streaming en Vivo | Sin mecanismo para comunicar en emergencias |
| `scattered_knowledge` | Conocimiento disperso | Biblioteca de Conocimiento | Conocimiento sin repositorio central |
| `resource_findability` | Recursos inaccesibles | Accesos Rapidos | Empleados no encuentran recursos |

#### Administracion de RRHH (9)

| Codigo | Nombre | Modulo | Descripcion |
|--------|--------|--------|-------------|
| `paper_based_records` | Legajos en papel | Legajo Digital | Archivos fisicos sin digitalizar |
| `document_chaos` | Caos documental | Documentos | Documentos sin control de version |
| `file_disorganization` | Archivos desorganizados | Archivos | Archivos sin estructura ni permisos |
| `policy_unacknowledged` | Politicas sin acuse | Politicas de Empresa | No se puede probar aceptacion de politicas |
| `manual_approvals` | Aprobaciones manuales | Formularios y Flujos | Aprobaciones sin flujo digital |
| `org_opacity` | Estructura opaca | Organigrama | No se sabe quien es quien |
| `access_friction` | Accesos sin gestion | Accesos Digitales | Gestion manual de permisos |
| `data_exposure_risk` | Riesgo de exposicion | Seguridad y Privacidad | Datos sensibles sin controles |
| `payroll_complexity` | Complejidad de nomina | Nomina / Payroll | Errores o procesos manuales en nomina |

#### Atraccion de Talento (6)

| Codigo | Nombre | Modulo | Descripcion |
|--------|--------|--------|-------------|
| `no_internal_mobility` | Sin movilidad interna | Vacantes Internas | Empleados no ven vacantes internas |
| `untapped_referrals` | Referidos desaprovechados | Programa de Referidos | Sin mecanismo de referidos |
| `onboarding_delays` | Onboarding deficiente | Onboarding | Proceso lento o no estandarizado |
| `manual_candidate_tracking` | Tracking manual candidatos | ATS | Seguimiento manual de candidatos |
| `screening_overload` | Sobrecarga de screening | Reclutador con IA | Filtrado manual consume mucho tiempo |
| `recruitment_disorganization` | Seleccion desorganizada | Reclutamiento y Seleccion | Proceso de seleccion desestructurado |

#### Desarrollo de Talento (8)

| Codigo | Nombre | Modulo | Descripcion |
|--------|--------|--------|-------------|
| `no_performance_tracking` | Sin evaluacion desempeno | Evaluacion de Desempeno | Sin evaluacion formal de desempeno |
| `skill_gap_blind` | Skills gaps invisibles | Evaluacion de Desempeno | No se pueden identificar gaps de skills |
| `misaligned_goals` | Objetivos desalineados | Objetivos y OKRs | Objetivos sin seguimiento |
| `no_career_path` | Sin plan de carrera | Plan de Desarrollo | Empleados no ven oportunidades |
| `training_gaps` | Brechas de capacitacion | Capacitacion / LMS | No puede capacitar de forma efectiva |
| `training_compliance` | Sin tracking formativo | Capacitacion / LMS | Capacitaciones obligatorias sin tracking |
| `succession_risk` | Riesgo de sucesion | Planes de Sucesion | Personas clave sin sucesor |
| `no_training_content` | Sin contenido formativo | Cursos Listos | Sin cursos listos para capacitar |

#### Experiencia del Empleado (6)

| Codigo | Nombre | Modulo | Descripcion |
|--------|--------|--------|-------------|
| `poor_employee_journey` | Journey fragmentado | Experiencia de Empleado | Experiencia del empleado fragmentada |
| `engagement_blind_spot` | Engagement sin medir | Encuestas | No hay forma de medir clima |
| `feedback_absence` | Sin feedback continuo | Encuestas | Sin mecanismo de feedback continuo |
| `recognition_deficit` | Falta de reconocimiento | Reconocimientos | Sin mecanismo para reconocer logros |
| `milestones_ignored` | Hitos sin celebrar | Cumpleanos y Aniversarios | No se celebran cumpleanos ni aniversarios |
| `event_disorganization` | Eventos desorganizados | Eventos | Sin gestion centralizada de eventos |

#### Compensaciones y Beneficios (3)

| Codigo | Nombre | Modulo | Descripcion |
|--------|--------|--------|-------------|
| `manual_benefits_enrollment` | Alta manual beneficios | Beneficios y Perks | Inscripcion manual a beneficios |
| `perks_invisible` | Perks sin visibilidad | Marketplace | Empleados desconocen beneficios |
| `benefits_fragmentation` | Beneficios dispersos | Plataforma de Beneficios | Beneficios en multiples sistemas |

#### Operaciones y Lugar de Trabajo (6)

| Codigo | Nombre | Modulo | Descripcion |
|--------|--------|--------|-------------|
| `absence_management` | Ausencias sin control | Vacaciones y Licencias | Sin visibilidad de ausencias |
| `time_attendance_chaos` | Asistencia sin control | Control Horario | Problemas con fichaje o asistencia |
| `shift_scheduling` | Turnos sin planificar | Control Horario | Complejidad planificando turnos |
| `overtime_compliance` | Horas extra sin control | Control Horario | Horas extra sin control |
| `space_conflicts` | Conflictos de espacios | Reserva de Espacios | Sin sistema de reserva de espacios |
| `no_service_desk` | Sin mesa de servicios | Mesa de Servicios | Sin mesa de servicios digital |

**Total: 87 pain subtypes (43 generales + 44 vinculados a modulo)**

---

## 4. Deal Friction Subtypes (Fricciones del Deal)

Obstaculos que frenan o bloquean el avance de la venta.

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `budget` | Restriccion presupuestaria | Limitaciones de presupuesto |
| `timing` | Timing desalineado | No es el momento |
| `decision_maker` | Falta decisor | Falta stakeholder clave |
| `legal` | Revision legal/compliance | DPA, revision legal, procurement |
| `technical` | Complejidad tecnica | SSO, APIs, requisitos de IT |
| `change_management` | Resistencia al cambio | Preocupacion por adopcion |
| `champion_risk` | Champion en riesgo | Champion debil o cambiando |
| `incumbent_lock_in` | Contrato existente | Atado a vendor actual |
| `scope_mismatch` | Alcance insuficiente | No cubre todos los requerimientos |
| `security_review` | Revision de seguridad | Evaluacion infosec requerida |
| `regional_requirements` | Requisitos regionales | Necesidades de pais no cubiertas |
| `competing_priorities` | Prioridades competidoras | Otros proyectos compiten |

**Total: 12 fricciones**

---

## 5. FAQ Subtypes (Preguntas Frecuentes)

Preguntas que los prospectos hacen durante las llamadas.

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `pricing` | Precios | Modelo de pricing, costo por usuario |
| `implementation` | Implementacion | Timeline, esfuerzo, metodologia |
| `integration` | Integraciones | Conexion con sistemas existentes |
| `security` | Seguridad | Certificaciones, hosting, SOC 2 |
| `customization` | Personalizacion | White-label, branding, config |
| `mobile` | App Movil | Capacidades de la app nativa |
| `support` | Soporte | SLA, soporte post-lanzamiento |
| `migration` | Migracion de datos | Importacion desde herramienta anterior |
| `scalability` | Escalabilidad | Capacidad para miles de usuarios |
| `analytics` | Analytics y reportes | Dashboards, exportacion, metricas |
| `languages` | Idiomas | Soporte multi-idioma |
| `adoption` | Adopcion | Estrategias y tasas tipicas |
| `compliance` | Compliance regulatorio | GDPR, LGPD, leyes locales |
| `roi` | ROI y business case | Retorno de inversion, casos de exito |
| `content_management` | Gestion de contenido | Permisos, publicacion, programacion |

**Total: 15 temas de FAQ**

---

## 6. Senales Competitivas

### 6.1 Tipos de Relacion

Cuando se detecta un competidor, se clasifica la relacion:

| Codigo | Nombre | Descripcion |
|--------|--------|-------------|
| `currently_using` | Usa actualmente | El prospecto usa este competidor hoy |
| `evaluating` | Evaluando | Evaluando en paralelo a Humand |
| `migrating_from` | Migrando desde | Dejando este competidor |
| `comparing` | Comparando | Compara features o precio |
| `mentioned` | Mencionado | Mencion sin senal fuerte |
| `previously_used` | Uso antes | Lo uso en el pasado |

### 6.2 Competidores Conocidos

El sistema normaliza nombres de competidores a esta lista. Si aparece uno nuevo, se registra tal cual.

#### LATAM (36)

Alest, Beehome, Buk, Comunitive, Connecto, Convenia, Crehana, Defontana, Dialog, Digitalware, Esigtek, Factorial, Fortia, GoIntegro, Heinsohn, HiBob, Hywork, Indigital, Lapzo, Meta4 (Cegid), Microsoft Viva Engage, Novasoft, Pandape, PeopleForce, Rankmi, SAP SuccessFactors, Sesame HR, Solides, Talento Cloud, Talento Zeus, Tress, UBits, Visma, Workday, Workplace (Meta), Workvivo, Worky

#### EMEA (11)

Beekeeper, Bizneo, Blink, Flip, Personio, Sage, Sesame, Sociabble, Staffbase, Yoobic, Zucchetti

#### North America (26)

15Five, Assembly, BambooHR, Connecteam, Culture Amp, Firstup, Glint, Google Workspace, Haiilo, Igloo Software, Interact, Jostle, Lattice, LumApps, Microsoft Teams, Paylocity, Poppulo, Qualtrics, Rippling, SharePoint, Simpplr, Slack, Speakapp, Unily, Workable, WorkTango

#### APAC (4)

Lark, Simplrr, Weconnect, Workjam

**Total: 77+ competidores**

---

## 7. Product Gaps (Features Faltantes)

### 7.1 Prioridades

Cuando se detecta un gap de producto, se clasifica su urgencia:

| Codigo | Nombre | Significado |
|--------|--------|-------------|
| `must_have` | Imprescindible | Lo necesitan si o si para comprar |
| `nice_to_have` | Deseable | Seria bueno tenerlo pero no bloquea |
| `dealbreaker` | Bloqueante | Sin esto, no compran |

### 7.2 Feature Names (Lista Semilla)

Lista inicial de features conocidas. El sistema puede descubrir nuevas automaticamente durante la extraccion.

| Codigo | Feature | Modulo Sugerido |
|--------|---------|----------------|
| `payroll_integration` | Integracion de nomina | Nomina / Payroll |
| `ats_module` | Modulo de ATS | ATS |
| `ai_recruiter` | Reclutador con IA | Reclutador con IA |
| `succession_planning` | Planes de sucesion | Planes de Sucesion |
| `native_benefits_platform` | Plataforma de beneficios | Plataforma de Beneficios |
| `prebuilt_courses` | Cursos listos | Cursos Listos |
| `recruitment_module` | Modulo de seleccion | Reclutamiento y Seleccion |
| `advanced_analytics` | Analytics avanzado | - |
| `bi_dashboard` | Dashboard BI | - |
| `sso_integration` | Integracion SSO | Seguridad y Privacidad |
| `api_access` | Acceso API | Accesos Digitales |
| `offline_mode` | Modo offline | - |
| `multi_language_content` | Contenido multi-idioma | - |
| `shift_scheduling` | Planificacion de turnos | Control Horario |
| `geofencing` | Geofencing | Control Horario |
| `expense_management` | Gestion de gastos | - |
| `compensation_management` | Gestion de compensaciones | - |
| `nine_box_grid` | Nine box grid | Evaluacion de Desempeno |
| `scorm_support` | Soporte SCORM | Capacitacion / LMS |
| `whatsapp_integration` | Integracion WhatsApp | Chat |
| `sap_integration` | Integracion SAP | - |
| `workday_integration` | Integracion Workday | - |
| `custom_branding` | Branding personalizado | - |
| `push_notifications` | Notificaciones push | - |
| `video_conferencing` | Videoconferencia | Streaming en Vivo |
| `ai_chatbot` | Chatbot con IA | Chat |
| `predictive_analytics` | Analytics predictivo | - |
| `employee_wellness` | Bienestar del empleado | Experiencia de Empleado |
| `exit_interviews` | Entrevistas de salida | Encuestas |
| `anonymous_feedback` | Feedback anonimo | Encuestas |

**Total: 30 features semilla + N descubiertas automaticamente**

---

## 8. Resumen de la Taxonomia

| Dimension | Cantidad |
|-----------|----------|
| Tipos de Insight | 5 |
| Categorias HR | 7 |
| Modulos | 39 (30 existentes + 9 missing) |
| Pain Subtypes | 87 (43 generales + 44 vinculados a modulo) |
| Deal Friction Subtypes | 12 |
| FAQ Topics | 15 |
| Relaciones Competitivas | 6 |
| Competidores Conocidos | 77+ |
| Feature Names (semilla) | 30 |
| **Total de codigos** | **~280** |

---

## 9. Como Validar esta Taxonomia

Preguntas para los stakeholders:

**Para Producto:**
- Faltan modulos en la lista? El status (existing/missing) es correcto?
- Las features semilla cubren los gaps conocidos?
- Faltan pain subtypes que escuchan frecuentemente?

**Para Ventas:**
- Los deal friction subtypes cubren los bloqueos tipicos?
- Faltan competidores en la lista?
- Las FAQ reflejan las preguntas que reciben?

**Para CS / Post-venta:**
- Los pain subtypes vinculados a modulo son correctos?
- Hay dolores que no encajan en ninguna categoria?

**Para todos:**
- Hay codigos que se solapan y deberian unificarse?
- Hay categorias demasiado amplias que deberian dividirse?

---

*Documento generado el 2026-02-09. Version de taxonomia: v2.0+qa2*
