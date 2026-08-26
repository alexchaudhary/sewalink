import app from "./app";
import prisma from "./config/prisma";

// Safe dynamic fallbacks for absolute server configuration
const PORT = process.env.PORT ? Number(process.env.PORT) : 4000;
const NODE_ENV = process.env.NODE_ENV || "development";

/**
 * Enterprise Production-Grade Core Server Application Bootstrap Launchpad
 * Clean Architecture Model - No Fallback Mock Bypasses Allowed
 */
async function bootstrapServer() {
  try {
    // 1. Establish verified atomic connection handshake with the Neon Database cluster
    await prisma.$connect();
    console.log("🚀 [Neon Database Cluster] Core datastore connection established successfully.");

    // 2. Initialize Express application layer mapping bindings
    app.listen(PORT, () => {
      console.log("⚡ [SewaLink Architecture Core] Runtime gateway engine online and listening.");
      console.log(`📡 [Active Grid Cluster] Mode: ${NODE_ENV.toUpperCase()} | Port Interface Target Node: ${PORT}`);
    });

  } catch (startupError: any) {
    console.error("❌ [Server Process Exception] Fatal framework bootstrap sequence failed:");
    console.error(startupError?.message || startupError);
    
    // Explicit process isolation handler to prevent unhandled background zombie states
    await prisma.$disconnect();
    process.exit(1);
  }
}

// Fire server process pipeline vectors
bootstrapServer();
