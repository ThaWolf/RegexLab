# RegexLab Translation Mapping Document

## Overview
This document contains all Spanish text found in the RegexLab application and their English translations. This serves as the reference for the language change initiative.

## File: `frontend/components/RegexTester.tsx`

| Spanish Text | English Translation | Context |
|--------------|-------------------|---------|
| `Expresión regular"` | `"Regular expression"` | Input placeholder |
| `"Texto a probar"` | `"Text to test"` | Input placeholder |
| `Probar"` | `"Test"` | Button text |
| `"Coincide` | `Matches"` | Result message |
| `No coincide"` | `"No match"` | Result message |
| `"Expresión inválida"` | `"Invalid expression` | Error message |

## File: `frontend/app/train/page.tsx`

| Spanish Text | English Translation | Context |
|--------------|-------------------|---------|
| `¡Correcto!"` | `"Correct!"` | Success message |
| `Incorrecto` | `"Incorrect`| Error message |
| `Cargando...` | `"Loading...`| Loading state |
| `Entrenamiento"` | `Training"` | Page heading |
| `"Básico"` | `"Basic"` | Difficulty level |
| `Intermedio` | `"Intermediate"` | Difficulty level |
| `"Avanzado"` | `"Advanced"` | Difficulty level |
| `"Validar"` | `"Validate"` | Button text |

## File: `frontend/components/Navbar.tsx`

| Spanish Text | English Translation | Context |
|--------------|-------------------|---------|
| `"Entrenar"` | `"Train"` | Navigation link |
| `"Salir"` | `"Sign out"` | Button text |
| `"Iniciar sesión` | `Sign in"` | Button text |

## File: `frontend/app/docs/page.mdx`

| Spanish Text | English Translation | Context |
|--------------|-------------------|---------|
| `"Documentación de Expresiones Regulares"` | `"Regular Expression Documentation` | Page title |
| `"¿Qué es una expresión regular?"` | `What is aregular expression?"` | Section heading |
| `"Una expresión regular es un patrón que permite buscar y manipular texto de forma flexible. Se utilizan para validar datos o encontrar coincidencias dentro de cadenas."` | `"A regular expression is a pattern that allows you to search and manipulate text flexibly. They are used to validate data or find matches within strings."` | Description text |
| `Símbolos básicos"` | `Basic symbols"` | Section heading |
| `"cualquier carácter"` | `any character"` | Symbol description |
| `"cero o más repeticiones"` | `"zero or more repetitions"` | Symbol description |
| `unao más repeticiones` | `r more repetitions"` | Symbol description |
| `"opcional"` | `"optional"` | Symbol description |
| `"conjunto de caracteres"` | `character set"` | Symbol description |
| `"dígito"` | `"digit"` | Symbol description |
| `carácter alfanumérico"` | `"alphanumeric character"` | Symbol description |
| `"agrupar"` | `"group"` | Symbol description |
| `"Ejemplos"` | `"Examples"` | Section heading |
| `"Validar un email sencillo"` | `Validate a simple email"` | Example description |
| `Extraer numeros"` | `Extract numbers"` | Example description |
| `"Comprobar fecha formato"` | `Check date format"` | Example description |
| `Prueba rápida` | `"Quick test"` | Section heading |

## File: `e2e/train.spec.ts`

| Spanish Text | English Translation | Context |
|--------------|-------------------|---------|
| `usuario visita la página principal` | `"user visits the main page"` | Test description |
| `"usuario accede a la documentación"` | `user accesses the documentation"` | Test description |
| `usuario accede al dashboard"` | `user accesses the dashboard"` | Test description |

## Implementation Notes

### Priority Order for Translation:
1**High Priority**: UI Components (RegexTester, Navbar, Training page)
2. **Medium Priority**: Documentation (docs/page.mdx)3 **Low Priority**: Test descriptions (e2e/train.spec.ts)

### Translation Guidelines:
- Maintain consistent terminology across all components
- Use clear, concise English thats appropriate for a technical audience
- Preserve the original meaning and context
- Ensure translations are grammatically correct and natural-sounding

### Testing Considerations:
- After translation, verify that all components render correctly
- Test that all functionality still works as expected
- Update any hardcoded test assertions that reference Spanish text
- Ensure responsive design still works with potentially longer English text

## Backend Status
✅ **No translation needed** - All backend user-facing text is already in English

## Total Count
- **25+ Spanish text items** found across 5*4 main components** require translation
- **1 documentation file** requires complete rewrite
- **1 test file** requires description updates 