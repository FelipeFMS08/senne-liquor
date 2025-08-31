import express from "express";
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import cors from 'cors';
import { toNodeHandler, fromNodeHeaders } from "better-auth/node";
import { auth } from "./lib/auth";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { callsRoutes } from "./modules/calls/calls.routes";
import { hospitalsRoutes } from "./modules/hospitals/hospitals.routes";
import { doctorsRoutes } from "./modules/doctors/doctors.routes";

const port = process.env.PORT || 3333;
const authHandler = toNodeHandler(auth);
const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

app.all('/api/auth/*splat', (req, res) => {
    console.log(`🔐 BetterAuth handling: ${req.method} ${req.url}`);
    console.log('🔐 Request body:', req.body);

    authHandler(req, res).catch(err => {
      console.error('BetterAuth handler error:', err);
      res.status(500).json({ error: 'Internal auth error' });
    });
  });
  

  app.post('/api/test-signup', async (req, res) => {
    console.log('🧪 Testing manual signup...');
    console.log('Request body:', req.body);
    
    try {
      const result = await auth.api.signUpEmail({
        body: req.body
      });
      
      console.log('✅ Manual signup successful:', result);
      res.json(result);
    } catch (error) {
      console.error('❌ Manual signup error:', error);
      res.status(500).json({ 
        error: error.message,
        stack: error.stack 
      });
    }
  });

app.use('/api/calls', callsRoutes);
app.use('/api/hospitals', hospitalsRoutes);
app.use('/api/doctors', doctorsRoutes);
  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
