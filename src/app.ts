import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
dotenv.config();

//servidor
const app = express();
app.use(cors());
app.use(express.json());

// rotas
app
	.get('/health', (_req, res) => res.send('OK!'))
	.use('/users', userRoutes);


// porta e listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server runnig on port: ${PORT}`));