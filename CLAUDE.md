# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A full-stack TODO application with a React/TypeScript frontend and a Spring Boot backend.

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS v4, runs on `http://localhost:5173`
- **Backend**: Spring Boot 3.5 + Spring Data JPA + H2 in-memory database, runs on `http://localhost:8080`

## Commands

### Frontend (`frontend/`)

```bash
npm run dev       # Start dev server
npm run build     # Type-check and build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

### Backend (`todo-backend/`)

```bash
./mvnw spring-boot:run          # Start the backend server
./mvnw test                     # Run all tests
./mvnw test -Dtest=ClassName    # Run a single test class
./mvnw package                  # Build JAR
```

> On Windows, use `mvnw.cmd` instead of `./mvnw`.

## Architecture

### Backend (`todo-backend/`)

Standard Spring Boot layered architecture:

- `entity/Todo.java` — JPA entity with Lombok annotations (`@Getter`, `@Setter`, `@Builder`, etc.). Has `@PrePersist`/`@PreUpdate` hooks to auto-set `createdAt`/`updatedAt`. Fields: `id`, `title`, `description`, `completed`, `dueDate`, `priority` (enum), `createdAt`, `updatedAt`.
- `entity/Priority.java` — Enum: `LOW`, `MEDIUM`, `HIGH` (default: `MEDIUM`).
- `repository/TodoRepository.java` — Extends `JpaRepository<Todo, Long>`, no custom queries yet.
- `service/TodoService.java` — Business logic layer; `update()` maps individual fields from the request onto the persisted entity before saving.
- `controller/TodoController.java` — REST controller at `/api/todos`. CORS is configured to allow `http://localhost:5173`.

The backend uses H2 (in-memory) with no custom `application.properties` config, so data resets on restart.

### Frontend (`frontend/src/`)

- `types/todo.ts` — TypeScript interfaces (`Todo`, `TodoCreateInput`, `TodoUpdateInput`). Note: `Priority` and `dueDate` fields are in the backend entity but **not yet in the frontend types**.
- `lib/api.ts` — Axios client with `baseURL: http://localhost:8080/api`. All API calls go through typed wrapper functions here.
- `App.tsx` — Single-page component holding all state. Todos are split into `activeTodos` (not completed) and `completedTodos`, rendered in separate sections. The completed section is a collapsible accordion.
- `components/Modal.tsx` — Generic modal used for the edit form. Closes on outside click via `stopPropagation`.

### Key Design Notes

- The frontend `TodoUpdateInput` type does not include `priority` or `dueDate` — the backend entity has these fields but the frontend hasn't been updated to use them yet.
- No state management library is used; all state lives in `App.tsx`.
- No routing — single page app.
- Tailwind CSS v4 is used (configured via `@tailwindcss/vite` plugin, not `tailwind.config.js`).
