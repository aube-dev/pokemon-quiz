import fp from "fastify-plugin";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";

export default fp(async (fastify) => {
  // 1. Swagger 핵심 설정 (Spec 정의)
  await fastify.register(swagger, {
    openapi: {
      info: {
        title: "My Fastify API",
        description: "Fastify CLI로 만든 API 문서입니다.",
        version: "1.0.0",
      },
      servers: [
        { url: "http://localhost:3000", description: "Development server" },
      ],
    },
  });

  // 2. Swagger UI 설정 (시각화)
  await fastify.register(swaggerUi, {
    routePrefix: "/docs", // 접속 주소: http://localhost:3000/docs
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });
});
