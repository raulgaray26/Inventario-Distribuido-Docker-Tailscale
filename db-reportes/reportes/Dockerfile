# Imagen base liviana de Node.js 20 Alpine para el servicio de reportes.
# Al ser un servicio de solo lectura de BD, no requiere dependencias adicionales.
FROM node:20-alpine

WORKDIR /app

# Copiar manifiestos primero para optimizar la caché de capas
COPY package*.json ./
RUN npm install --production

COPY . .

# Puerto 4000: servicio de reportes (distinto al 3000 de la app principal)
EXPOSE 4000

CMD ["npm", "start"]