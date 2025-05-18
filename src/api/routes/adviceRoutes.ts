import { Router } from 'express';
import { businessAdviceService } from '../../services/businessAdviceService';
import { validationService } from '../../services/validationService';
import { asyncHandler } from '../../middleware/errorHandler';
import { AppError } from '../../middleware/errorHandler';
import { AdviceStatus, AdviceType } from '@prisma/client';

const router = Router();

// Generate new advice
router.post('/generate/:businessId', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  
  // Validate business ID
  if (!businessId) {
    throw new AppError('Business ID is required', 400);
  }

  const result = await businessAdviceService.generateAdvice(businessId);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.status(201).json(result.data);
}));

// Get implemented advice with pagination
router.get('/implemented/:businessId', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  // Validate pagination parameters
  if (page < 1 || limit < 1 || limit > 100) {
    throw new AppError('Invalid pagination parameters', 400);
  }

  const result = await businessAdviceService.getImplementedAdvice(businessId, page, limit);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json({
    data: result.data,
    pagination: {
      page,
      limit,
      total: result.total,
      totalPages: Math.ceil(result.total / limit)
    }
  });
}));

// Update advice status
router.patch('/:adviceId/status', asyncHandler(async (req, res) => {
  const { adviceId } = req.params;
  const { status } = req.body;
  
  // Validate status
  if (!status || !Object.values(AdviceStatus).includes(status)) {
    throw new AppError('Invalid status', 400);
  }
  
  const result = await businessAdviceService.updateAdviceStatus(adviceId, status);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.status(204).send();
}));

// Get advice trends
router.get('/trends/:businessId', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  
  // Validate business ID
  if (!businessId) {
    throw new AppError('Business ID is required', 400);
  }

  const trends = await businessAdviceService.analyzeTrends(businessId);
  res.json(trends);
}));

// Get advice effectiveness metrics
router.get('/effectiveness/:businessId', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { type } = req.query;
  
  // Validate business ID
  if (!businessId) {
    throw new AppError('Business ID is required', 400);
  }

  // If type is provided, validate it
  if (type && !Object.values(AdviceType).includes(type as AdviceType)) {
    throw new AppError('Invalid advice type', 400);
  }

  const effectiveness = await businessAdviceService.calculateAdviceEffectiveness(
    businessId,
    type as AdviceType
  );

  res.json({ effectiveness });
}));

export const adviceRoutes = router; 