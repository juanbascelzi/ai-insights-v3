# Humand Sales Insights - Pipeline de Analisis de Llamadas

## Resumen Ejecutivo

Pipeline automatizado que analiza los transcripts de llamadas de ventas del equipo de Account Executives y extrae insights estructurados usando inteligencia artificial. El objetivo es convertir +5,000 llamadas en datos accionables sobre dolores del prospecto, gaps de producto, competencia, fricciones del deal y preguntas frecuentes.

---

## Estado Actual

| Metrica | Valor |
|---------|-------|
| Transcripts disponibles | 5,049 |
| Transcripts procesados | ~2,250 (44.6%) |
| Insights extraidos | 30,109 |
| Evaluaciones de QA | 55 |
| Version actual del prompt | v2.0+qa2 |

---

## Arquitectura

### Fuentes de datos

- **Fathom** - Transcripts de llamadas (5,049 grabaciones del equipo AE)
- **HubSpot** - Deals y owners (para enriquecer cada insight con contexto CRM: region, pais, segmento, industria, stage, monto)

### Stack tecnologico

| Componente | Tecnologia |
|------------|-----------|
| Base de datos | Supabase (PostgreSQL) |
| Extraccion de insights | OpenAI Batch API (gpt-4o-mini) |
| QA / Evaluacion de calidad | OpenAI API directa (gpt-4o) |
| Orquestacion | Python |
| Dashboard | Streamlit (6 paginas) |
| Visualizacion BI | Metabase o Looker Studio (por definir) |

### Flujo del pipeline

```
Fathom API ──┐
             ├── Supabase ── Chunking ── OpenAI Batch ── Parsing ── Insights DB
HubSpot API ─┘                                                         │
                                                                   Dashboard
                                                                        │
                                                              QA Evaluator (gpt-4o)
                                                                        │
                                                              Refinements ──> Prompt mejorado
```

---

## Taxonomia

El sistema clasifica cada insight en una taxonomia estructurada:

### Tipos de Insight (5)

| Tipo | Descripcion |
|------|-------------|
| Pain (Dolor) | Problema, frustracion o necesidad actual del prospecto |
| Product Gap | Funcionalidad que falta o no es suficiente en Humand |
| Competitive Signal | Mencion de un competidor (lo usan, evaluan, comparan) |
| Deal Friction | Algo que frena o bloquea el avance de la venta |
| FAQ | Pregunta frecuente sobre el producto/servicio |

### Dimensiones de clasificacion

| Dimension | Cantidad | Ejemplo |
|-----------|----------|---------|
| Categorias HR | 7 | Comunicacion Interna, Administracion de RRHH, Talent Acquisition |
| Modulos | 39 | Chat, Onboarding, Performance Review, Payroll |
| Pain Subtypes | 87 | 43 generales + 44 vinculados a modulo |
| Deal Friction Subtypes | 12 | Budget, Timing, Decision Maker, Legal |
| FAQ Topics | 15 | Pricing, Integration, Security, Mobile |
| Competitive Relationships | 6 | Currently Using, Evaluating, Migrating From |
| Competidores conocidos | 80+ | Buk, Factorial, BambooHR, Workday, etc. |
| Feature Names (seed) | 30 | ATS Module, Payroll Integration, AI Chatbot |

---

## Sistema de QA con Auto-Ajustes

El pipeline incluye un ciclo de mejora continua que evalua la calidad de extraccion y refina automaticamente el prompt.

### Flujo de QA

```
1. python main.py run --sample 30          Extraer insights de N transcripts
2. python main.py qa --sample 30           QA evalua esos transcripts (usa gpt-4o)
3. python main.py qa --report              Ver reporte de calidad
4. python main.py qa --apply               Aplicar ajustes al prompt
5. python main.py run --sample 30          Re-extraer y verificar mejora
   ...repetir hasta satisfecho...
6. python main.py run                      Batch completo con prompt optimizado
```

### Dimensiones de evaluacion

El QA agent (gpt-4o) recibe el transcript original + los insights extraidos y evalua:

| Dimension | Que mide |
|-----------|----------|
| Completitud (0-1) | Proporcion de insights reales que fueron capturados |
| Precision (0-1) | Proporcion de insights extraidos que son correctos |
| Clasificacion (0-1) | Tipos, subtipos y modulos asignados correctamente |
| Citas (0-1) | Las verbatim quotes son citas reales del transcript |

### Que genera el QA

- **Reporte** (`qa_report.json`): Scores promedio, issues comunes, insights perdidos, alucinaciones detectadas
- **Refinements** (`prompt_refinements.json`): Reglas adicionales que se inyectan automaticamente al prompt de extraccion
- **Sugerencias de taxonomia**: Nuevos codigos de pain, competidores, FAQ que deberian existir

### Versionado automatico

Cada insight queda marcado con la version del prompt que lo genero:

| Version | Significado |
|---------|-------------|
| v2.0 | Prompt base, sin refinements |
| v2.0+qa1 | Primer ciclo de QA aplicado |
| v2.0+qa2 | Segundo ciclo de QA aplicado (actual) |
| v3.0 | Cambio mayor al prompt (manual) |
| v3.0+qa1 | Primer QA sobre v3.0 |

Esto permite comparar la calidad entre versiones y medir el impacto de cada iteracion.

---

## Datos por Insight

Cada insight almacenado contiene:

| Campo | Descripcion |
|-------|-------------|
| transcript_id | ID de la grabacion de Fathom |
| insight_type | pain, product_gap, competitive_signal, deal_friction, faq |
| insight_subtype | Codigo de la taxonomia |
| module | Modulo HR relacionado (si aplica) |
| summary | Resumen en espanol (1-2 oraciones) |
| verbatim_quote | Cita textual del transcript |
| confidence | Score de confianza (0-1) |
| competitor_name | Nombre normalizado del competidor |
| feature_name | Codigo del feature (para product_gap) |
| gap_priority | must_have, nice_to_have, dealbreaker |
| deal_name, company_name, region, country, industry, segment, amount, deal_stage, deal_owner, call_date | Contexto CRM (desde HubSpot deals) |
| model_used | Modelo que genero el insight |
| prompt_version | Version del prompt utilizada |

---

## Comandos del Pipeline

| Comando | Descripcion |
|---------|-------------|
| `python main.py setup` | Crear tablas + sembrar taxonomia |
| `python main.py ingest` | Importar datos de Fathom + HubSpot deals + matching |
| `python main.py ingest --source fathom` | Solo Fathom |
| `python main.py ingest --source hubspot` | Solo HubSpot (deals + owners) |
| `python main.py run --sample 5 --model gpt-4o` | Validar con N transcripts (API directa) |
| `python main.py run` | Batch completo (OpenAI Batch API) |
| `python main.py run --resume` | Retomar batch interrumpido |
| `python main.py qa --sample 30` | Evaluar calidad de N transcripts |
| `python main.py qa --report` | Ver reporte de QA |
| `python main.py qa --apply` | Aplicar refinements al prompt |
| `python main.py status` | Ver estado del batch |
| `streamlit run dashboard.py` | Levantar dashboard |

---

## Costos Estimados

| Concepto | Costo estimado |
|----------|----------------|
| Extraccion completa (5,049 transcripts, gpt-4o-mini) | ~$15-25 USD |
| QA iteracion (30 transcripts, gpt-4o) | ~$1-2 USD |
| 2-3 iteraciones de QA | ~$5 USD |
| Supabase (Free tier) | $0 |
| **Total estimado** | **~$25-35 USD** |

---

## Proximos Pasos

1. **Completar extraccion** - Procesar el 55% restante de transcripts (~2,800)
2. **QA a escala** - Evaluar una muestra de 30-50 transcripts y refinar el prompt
3. **Dashboard BI** - Conectar Metabase o Looker Studio para visualizacion avanzada
4. **Presentacion de resultados** - Analisis de los insights extraidos para el equipo

---

## Estructura de Archivos

```
ai-insights-v3/
  main.py                  # CLI principal
  pipeline.py              # Orquestador de extraccion
  batch_processor.py       # OpenAI Batch API
  prompt_builder.py        # Prompt de extraccion (+ refinements)
  qa_evaluator.py          # Orquestador de QA
  qa_prompt_builder.py     # Prompt de evaluacion QA
  parser.py                # Parsing y validacion de respuestas
  chunker.py               # Divide transcripts largos
  models.py                # Modelos Pydantic + JSON Schema
  taxonomy.py              # Taxonomia completa (fuente de verdad)
  config.py                # Configuracion y env vars
  db.py                    # Funciones de Supabase
  schema.sql               # Esquema de base de datos
  seed_taxonomy.py         # Siembra de taxonomia
  ingest.py                # Ingestion Fathom + HubSpot
  fathom_client.py         # Cliente API Fathom
  hubspot_client.py        # Cliente API HubSpot
  deal_matcher.py          # Matching llamada <-> deal
  dashboard.py             # Dashboard Streamlit
  prompt_refinements.json  # Reglas de QA (auto-generado)
  qa_report.json           # Ultimo reporte de QA
  state.json               # Estado para resume de batch
```
