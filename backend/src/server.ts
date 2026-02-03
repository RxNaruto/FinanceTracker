import express, { Request, Response } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock database
interface User {
  id: string;
  email: string;
  passwordHash: string;
  name?: string;
}

const users: User[] = [];

app.post('/api/auth/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
       res.status(400).json({ message: 'Email and password are required' });
       return;
    }

    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
       res.status(400).json({ message: 'User already exists' });
       return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser: User = {
      id: Date.now().toString(),
      email,
      passwordHash,
      name
    };

    users.push(newUser);

    res.status(201).json({ message: 'User created successfully', user: { id: newUser.id, email: newUser.email, name: newUser.name } });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/api/auth/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
       res.status(400).json({ message: 'Email and password are required' });
       return
    }

    const user = users.find(u => u.email === email);
    if (!user) {
       res.status(400).json({ message: 'Invalid credentials' });
       return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
       res.status(400).json({ message: 'Invalid credentials' });
       return;
    }

    // In a real app, generate a JWT here
    res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email, name: user.name } });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default app;
