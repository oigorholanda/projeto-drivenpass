import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes.js";
import credentialRoutes from "./routes/credential.routes.js";
dotenv.config();

//servidor
const app = express();
app.use(cors());
app.use(express.json());

// rotas
app
	.get('/health', (_req, res) => res.send("i'm OK!"))
	.use('/user', userRoutes)
	.use('/credentials', credentialRoutes)
	.use('/network', ()=>{})


// porta e listen
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server runnig on port: ${PORT}`));

export default app;