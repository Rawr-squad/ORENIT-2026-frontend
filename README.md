# Frontend (ORENIT)

Frontend часть образовательной платформы.

Стек:

- React + Vite
- Ant Design
- Zustand
- WebSocket (чат)

---

## 🚀 Запуск через Docker

### 1. Сборка и запуск

```bash
docker-compose up --build
```

### 2. Открыть в браузере

`http://localhost:5173`

### ⚙️ Переменные окружения

VITE_API_URL - URL backend API
VITE_WS_URL - WebSocket сервер

Пример:

VITE_API_URL=http://localhost:8000
VITE_WS_URL=ws://localhost:8000

### 🧪 Локальный запуск (без Docker)

npm install
npm run dev
