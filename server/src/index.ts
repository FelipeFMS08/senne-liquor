import express from "express";
import 'dotenv/config';
import cors from 'cors';
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { callsRoutes } from "./modules/calls/calls.routes.js";
import { hospitalsRoutes } from "./modules/hospitals/hospitals.routes.js";
import { doctorsRoutes } from "./modules/doctors/doctors.routes.js";

const port = process.env.PORT || 3333;
const authHandler = toNodeHandler(auth);
const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:8081",
    "https://senne-liquor.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

app.all('/api/auth/*splat', (req, res) => {
    console.log(`🔐 BetterAuth handling: ${req.method} ${req.url}`);

    authHandler(req, res).catch(err => {
      console.error('BetterAuth handler error:', err);
      res.status(500).json({ error: 'Internal auth error' });
    });
  });
  

  app.post('/api/test-signup', async (req, res) => {
    console.log('🧪 Testing manual signup...');
    
    try {
      const result = await auth.api.signUpEmail({
        body: req.body
      });
      
      console.log('✅ Manual signup successful:', result);
      res.json(result);
    } catch (error) {
      console.error('❌ Manual signup error:', error);
      res.status(500);
    }
  });

app.use('/api/calls', callsRoutes);
app.use('/api/hospitals', hospitalsRoutes);
app.use('/api/doctors', doctorsRoutes);
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
