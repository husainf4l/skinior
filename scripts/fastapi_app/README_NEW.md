# Product Metadata Manager

A modern FastAPI application for managing product metadata with AI-powered suggestions and a responsive web interface.

## Features

### 🎨 Modern Web Interface

- **Responsive Design**: Built with Bootstrap 5 for mobile-first experience
- **Intuitive UI**: Clean, professional interface with visual field status indicators
- **Smart Filtering**: Filter products by missing fields with helpful suggestions
- **Real-time Feedback**: Success/error messages with auto-dismiss alerts

### 🔗 Database Integration

- **Prisma-First**: Prefers Prisma Python client for type-safe database operations
- **AsyncPG Fallback**: Maintains compatibility with direct SQL for flexibility
- **Auto-Detection**: Automatically detects correct table names (handles Prisma PascalCase)
- **Type Conversion**: Smart field type conversion (numbers, booleans, strings)

### 🤖 AI-Powered Features

- **LLM Integration**: OpenAI GPT for intelligent metadata suggestions
- **Web Search**: SerpAPI integration for product research
- **Hybrid Strategy**: Combine AI and web search for best results
- **Safe Previews**: Preview suggestions before committing changes

### 🛠️ Developer Experience

- **Comprehensive Testing**: Pytest suite with async support
- **Type Safety**: Full type hints and validation
- **Error Handling**: Graceful error handling with user-friendly messages
- **API Documentation**: Auto-generated OpenAPI/Swagger docs

## Quick Start

### 1. Setup Environment

```bash
# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Configure Environment

Copy `.env.example` to `.env` and configure:

```bash
DATABASE_URL=postgresql://user:pass@host:port/database
OPENAI_API_KEY=your_openai_key_here
SERPAPI_API_KEY=your_serpapi_key_here
```

### 3. Run the Application

```bash
# Development server with auto-reload
uvicorn main:app --reload --host 127.0.0.1 --port 8000

# Or use the VS Code task: "Run FastAPI Server"
```

### 4. Access the Application

- **Web Interface**: http://127.0.0.1:8000
- **API Documentation**: http://127.0.0.1:8000/docs
- **Alternative API Docs**: http://127.0.0.1:8000/redoc

## API Endpoints

### Web Interface

- `GET /` - Product listing with filtering
- `GET /product/{id}` - Product detail and edit form
- `POST /product/{id}/patch` - Update product fields
- `POST /product/{id}/autofill` - AI suggestions for missing fields

### API Endpoints

- `GET /health` - Health check
- `GET /products/missing` - List products missing specified fields
- `POST /products/{id}/metadata` - Update product metadata (JSON)
- `POST /products/{id}/auto-fill` - Generate AI suggestions

## Field Management

### Supported Product Fields

- **Basic Info**: title, titleAr, slug, price, compareAtPrice, currency
- **Content**: descriptionEn, descriptionAr, howToUse, ingredients
- **Product Details**: sku, barcode, activeIngredients, skinType, concerns
- **Features**: usage, features, metaTitle, metaDescription
- **Status**: isActive

### Field Types

- **Text Fields**: Automatically trimmed, empty strings converted to NULL
- **Numeric Fields**: price, compareAtPrice (auto-converted to float)
- **Boolean Fields**: isActive (accepts true/false, 1/0, yes/no, on/off)

## Testing

```bash
# Run all tests
PYTHONPATH=. pytest

# Run specific test file
PYTHONPATH=. pytest fastapi_app/tests/test_db_wrappers.py

# Run with coverage
PYTHONPATH=. pytest --cov=fastapi_app
```

## Development

### Project Structure

```
fastapi_app/
├── main.py              # Main FastAPI application
├── templates/           # Jinja2 HTML templates
│   ├── index.html      # Product listing
│   └── product.html    # Product detail/edit
├── tests/              # Test suite
│   └── test_db_wrappers.py
├── requirements.txt    # Python dependencies
├── .env.example       # Environment template
└── README.md          # This file
```

### Key Components

- **DB Wrappers**: `db_find_missing_products()`, `db_fetch_product()`, `db_update_product()`
- **Type Conversion**: `_convert_field_value()` for smart form processing
- **AI Helpers**: `suggest_metadata_via_openai()`, `search_online_for_metadata()`

## Environment Variables

| Variable          | Required | Default   | Description                       |
| ----------------- | -------- | --------- | --------------------------------- |
| `DATABASE_URL`    | Yes      | -         | PostgreSQL connection string      |
| `OPENAI_API_KEY`  | No       | -         | OpenAI API key for AI suggestions |
| `SERPAPI_API_KEY` | No       | -         | SerpAPI key for web search        |
| `PRODUCTS_TABLE`  | No       | `Product` | Database table name               |

## Best Practices

### Database Integration

1. **Prefer Prisma**: Use Prisma Python client when available for type safety
2. **Fallback Ready**: AsyncPG provides compatibility when Prisma isn't configured
3. **Quoted Identifiers**: All table/column names are properly quoted for safety

### Form Handling

1. **Type Conversion**: Form data is automatically converted to appropriate types
2. **Validation**: Empty strings are converted to NULL for proper database handling
3. **Error Handling**: User-friendly error messages with graceful degradation

### AI Integration

1. **Graceful Fallback**: AI features work without API keys (return empty/unknown)
2. **Preview First**: Always preview suggestions before committing
3. **Multiple Sources**: Combine LLM and web search for better results

## Contributing

1. **Code Style**: Follow PEP 8, use type hints
2. **Testing**: Add tests for new features
3. **Documentation**: Update README for significant changes
4. **Error Handling**: Provide user-friendly error messages

## License

This project is part of the Skinior product management system.
