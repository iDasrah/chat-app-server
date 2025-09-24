# Chat Backend – NestJS + Socket.IO

Serveur WebSocket pour une application de chat en temps réel.
Il utilise **NestJS** et **socket.io** pour gérer les connexions, les déconnexions et l'échange de messages.


## Installation

```bash
# Cloner le dépôt
git clone https://github.com/iDasrah/chat-app-server.git
cd chat-app-server

# Installer les dépendances
npm install
# ou
yarn install
# ou
pnpm install
```

## Lancer le serveur en développement

```bash
npm run start:dev
# ou
yarn start:dev
```

Le serveur démarre par défaut sur **[http://localhost:3000](http://localhost:3000)**
(WebSocket disponible sur le même port).

## Événements Socket.IO

### Événements émis par le serveur

| Événement     | Données                                                  | Description                                 |
| ------------- | -------------------------------------------------------- | ------------------------------------------- |
| `user-joined` | `{ message: string }`                                    | Diffusé quand un utilisateur se connecte.   |
| `user-left`   | `{ message: string }`                                    | Diffusé quand un utilisateur se déconnecte. |
| `new-message` | `{ username: string, message: string, timestamp: Date }` | Diffusé à chaque nouveau message envoyé.    |

### Événements attendus côté client

| Événement      | Données               | Description                          |
| -------------- | --------------------- | ------------------------------------ |
| `send-message` | `{ message: string }` | Permet d’envoyer un message au chat. |

### Paramètre de connexion

Lors de la connexion, le client doit fournir un **username** dans la query string :

```ts
import { io } from "socket.io-client";

const socket = io("http://localhost:3000", {
  query: { username: "Alice" },
});
```

## Structure simplifiée

```
src/
 ├─ chat.gateway.ts   # Logique WebSocket (connexion, messages, etc.)
 └─ main.ts           # Bootstrap NestJS
```
