import { Router } from 'express';
import { supabase } from '../../lib/supabase';
import { asyncHandler } from '../../middleware/errorHandler';
import { AppError } from '../../middleware/errorHandler';
import { z } from 'zod';

const router = Router();

// Validation schemas
const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2)
});

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

// Sign up endpoint
router.post('/signup', asyncHandler(async (req, res) => {
  const validation = signUpSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new AppError('Invalid input data', 400);
  }

  const { email, password, name } = validation.data;
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (error) {
    throw new AppError(error.message, 400);
  }

  res.status(201).json({
    message: 'User created successfully',
    user: data.user
  });
}));

// Sign in endpoint
router.post('/signin', asyncHandler(async (req, res) => {
  const validation = signInSchema.safeParse(req.body);
  
  if (!validation.success) {
    throw new AppError('Invalid input data', 400);
  }

  const { email, password } = validation.data;
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new AppError(error.message, 401);
  }

  res.json({
    message: 'Signed in successfully',
    session: data.session,
    user: data.user
  });
}));

// Sign out endpoint
router.post('/signout', asyncHandler(async (req, res) => {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw new AppError(error.message, 400);
  }

  res.json({ message: 'Signed out successfully' });
}));

// Get current user endpoint
router.get('/user', asyncHandler(async (req, res) => {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw new AppError(error.message, 401);
  }

  if (!user) {
    throw new AppError('No user found', 404);
  }

  res.json({ user });
}));

// Password reset request endpoint
router.post('/reset-password', asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError('Email is required', 400);
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.VITE_APP_URL}/reset-password`,
  });

  if (error) {
    throw new AppError(error.message, 400);
  }

  res.json({ message: 'Password reset email sent successfully' });
}));

// Update user endpoint
router.put('/user', asyncHandler(async (req, res) => {
  const { name, password } = req.body;
  const updateData: any = {};

  if (name) {
    updateData.data = { name };
  }

  if (password) {
    updateData.password = password;
  }

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) {
    throw new AppError(error.message, 400);
  }

  res.json({
    message: 'User updated successfully',
    user: data.user
  });
}));

export const authRoutes = router; 