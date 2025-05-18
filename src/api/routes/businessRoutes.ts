import { Router } from 'express';
import { businessService } from '../../services/BusinessService';
import { validationService } from '../../services/validationService';
import { asyncHandler } from '../../middleware/errorHandler';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

// Get all businesses for a user
router.get('/user/:userId', asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const result = await businessService.getBusinessesByUserId(userId);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json(result.data);
}));

// Get a single business
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await businessService.getBusinessById(id);
  
  if (result.error) {
    throw new AppError(result.error.message, 404);
  }
  
  res.json(result.data);
}));

// Create a new business
router.post('/', asyncHandler(async (req, res) => {
  const validation = validationService.validateBusiness(req.body);
  
  if (validation.error) {
    throw new AppError(validation.error.message, 400);
  }
  
  // Ensure all required fields are present before calling createBusiness
  const { name, type, size, registrationNo, userId } = validation.data;
  if (!name || !type || !size || !userId) {
    throw new AppError('Missing required business fields', 400);
  }
  const result = await businessService.createBusiness({ name, type, size, registrationNo, userId });
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.status(201).json(result.data);
}));

// Update a business
router.put('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const validation = validationService.validateBusiness({
    ...req.body,
    id
  });
  
  if (validation.error) {
    throw new AppError(validation.error.message, 400);
  }
  
  const result = await businessService.updateBusiness({
    ...validation.data,
    id
  });
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json(result.data);
}));

// Delete a business
router.delete('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await businessService.deleteBusiness(id);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.status(204).send();
}));

// Get business documents
router.get('/:id/documents', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const result = await businessService.getBusinessDocuments(id);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json(result.data);
}));

// Upload business document
router.post('/:id/documents', asyncHandler(async (req, res) => {
  const { id } = req.params;
  const file = req.files?.document;
  
  if (!file || Array.isArray(file)) {
    throw new AppError('Invalid file upload', 400);
  }
  
  const result = await businessService.uploadBusinessDocument(id, file);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.status(201).json(result.data);
}));

export const businessRoutes = router; 