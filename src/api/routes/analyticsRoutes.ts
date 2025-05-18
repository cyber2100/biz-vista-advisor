import { Router } from 'express';
import { financialAnalyticsService } from '../../services/financialAnalyticsService';
import { reportingService } from '../../services/reportingService';
import { validationService } from '../../services/validationService';
import { asyncHandler } from '../../middleware/errorHandler';
import { AppError } from '../../middleware/errorHandler';
import { AnalyticsType } from '@prisma/client';

const router = Router();

// Generate business report
router.post('/reports/:businessId', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const options = req.body;

  // Validate business ID
  if (!businessId) {
    throw new AppError('Business ID is required', 400);
  }

  // Validate date range if provided
  if (options.startDate && options.endDate) {
    const dateValidation = validationService.validateDateRange(
      options.startDate,
      options.endDate
    );
    
    if (dateValidation.error) {
      throw new AppError(dateValidation.error.message, 400);
    }
    
    options.startDate = dateValidation.data.startDate;
    options.endDate = dateValidation.data.endDate;
  }
  
  const result = await reportingService.generateBusinessReport(businessId, options);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json(result.data);
}));

// Get report history
router.get('/reports/:businessId/history', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  
  // Validate business ID
  if (!businessId) {
    throw new AppError('Business ID is required', 400);
  }

  // Validate and parse limit
  const limitStr = req.query.limit as string | undefined;
  const limit = limitStr ? parseInt(limitStr, 10) : 10;
  
  if (isNaN(limit) || limit < 1 || limit > 100) {
    throw new AppError('Invalid limit value. Must be between 1 and 100', 400);
  }
  
  const result = await reportingService.getReportHistory(businessId, limit);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json(result.data);
}));

// Get business analytics by type
router.get('/:businessId/:type', asyncHandler(async (req, res) => {
  const { businessId, type } = req.params;
  const period = req.query.period as string;

  // Validate analytics query
  const validation = validationService.validateAnalyticsQuery({
    businessId,
    type: type as AnalyticsType,
    period
  });

  if (validation.error) {
    throw new AppError(validation.error.message, 400);
  }

  // Convert the validated period string to a Date object
  const periodDate = new Date(validation.data.period);
  
  const result = await financialAnalyticsService.getBusinessAnalytics(
    validation.data.businessId,
    validation.data.type,
    periodDate
  );
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json(result.data);
}));

export const analyticsRoutes = router; 