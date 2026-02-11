# Humand Sales Insights v3

Pipeline automatizado para extraer insights normalizados de transcripts de llamadas de ventas usando OpenAI y almacenarlos en Supabase.

## Que hace

Procesa 500+ transcripts y extrae 5 tipos de insights clasificados con una taxonomia HR completa:

- **Pain** (87 subtypes) - Dolores y problemas del prospecto
- **Product Gap** (features faltantes, extensible) - Funcionalidades que necesitan
- **Competitive Signal** (6 relaciones) - Menciones de competidores
- **Deal Friction** (12 subtypes) - Bloqueadores de la venta
- **FAQ** (15 topics) - Preguntas frecuentes

Cada insight queda normalizado con codigos de la taxonomia, vinculado a modulos HR (39) y categorias (7), listo para analisis SQL y dashboards BI.

## Prerequisitos

- Python 3.10+
- Cuenta OpenAI con API key
- Proyecto Supabase con la view de transcripts (`v_transcripts`)

## Setup

```bash
# 1. Entorno virtual
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# 2. Credenciales
cp .env.example .env
# Editar .env con tus keys

# 3. Crear tablas y poblar taxonomia
#    Primero: ejecutar schema.sql en Supabase SQL Editor
#    Luego:
python main.py setup
```

## Uso

```bash
# Dry run: 5 transcripts con gpt-4o (para validar)
python main.py run --sample 5 --model gpt-4o

# Validacion: 25 transcripts con gpt-4o-mini
python main.py run --sample 25

# Full batch: todos los transcripts
python main.py run

# Solo generar JSONL sin enviar
python main.py run --dry-run

# Resumir batch interrumpido
python main.py run --resume

# Ver estado del batch
python main.py status
```

## Estructura

```
main.py              - CLI entry point
config.py            - Variables de entorno
taxonomy.py          - Taxonomia completa (modulos, pains, features, competidores)
models.py            - Pydantic models para OpenAI Structured Output
chunker.py           - Chunking token-aware con tiktoken
prompt_builder.py    - System prompt con taxonomia + few-shot examples
batch_processor.py   - OpenAI Batch API (submit, poll, download)
parser.py            - Validacion y normalizacion de respuestas
db.py                - Cliente Supabase (read/write)
pipeline.py          - Orquestador del pipeline completo
seed_taxonomy.py     - Poblar tablas de referencia
dashboard.py         - Dashboard Streamlit
schema.sql           - DDL completo (tablas, indices, vista)
```

## Pipeline

```
0. SETUP    -> schema.sql + seed taxonomy
1. EXTRACT  -> Leer transcripts de Supabase view
2. CHUNK    -> Tokenizar, splitear si >12K tokens
3. BUILD    -> Generar JSONL para Batch API
4. SUBMIT   -> Enviar a OpenAI Batch API
5. POLL     -> Polling hasta completar
6. PARSE    -> Validar con Pydantic, normalizar, extender features
7. LOAD     -> Upsert a Supabase con dedup
```

## Dashboard

```bash
# Local
streamlit run dashboard.py

# Deploy en Streamlit Community Cloud (gratis)
# Conectar el repo y configurar secrets
```

Alternativas BI: Metabase Cloud (gratis hasta 5 users), Looker Studio, Preset.io.
Todas conectan directo a Supabase via PostgreSQL. Usar la vista `v_insights_dashboard`.

## Costos

| Concepto | Costo |
|----------|-------|
| OpenAI Batch API (500 transcripts, gpt-4o-mini) | ~$1-2 USD |
| Supabase Free Tier | $0 |
| Streamlit Community Cloud | $0 |
| **Total** | **~$1-2 USD** |
