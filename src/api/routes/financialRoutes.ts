import { Router } from 'express';
import { businessService } from '../../services/BusinessService';
import { validationService } from '../../services/validationService';
import { financialAnalyticsService } from '../../services/financialAnalyticsService';
import { asyncHandler } from '../../middleware/errorHandler';
import { AppError } from '../../middleware/errorHandler';

const router = Router();

// Add a financial record
router.post('/', asyncHandler(async (req, res) => {
  // Validate the entire financial record including businessId
  const validation = validationService.validateFinancialRecord(req.body);
  
  if (validation.error) {
    throw new AppError(validation.error.message, 400);
  }

  // Check if business exists before adding financial record
  const businessExists = await businessService.getBusinessById(validation.data.businessId);
  if (businessExists.error) {
    throw new AppError('Business not found', 404);
  }
  
  const result = await businessService.addFinancialRecord(
    validation.data.businessId,
    {
      type: validation.data.type,
      amount: validation.data.amount,
      currency: validation.data.currency,
      date: validation.data.date,
      category: validation.data.category,
      description: validation.data.description,
    }
  );
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.status(201).json(result.data);
}));

// Get financial summary
router.get('/summary/:businessId', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  
  // Validate business ID
  if (!businessId) {
    throw new AppError('Business ID is required', 400);
  }

  // Validate and parse months
  const monthsStr = req.query.months as string | undefined;
  const months = monthsStr ? parseInt(monthsStr, 10) : 12;
  
  if (isNaN(months) || months < 1 || months > 60) {
    throw new AppError('Invalid months value. Must be between 1 and 60', 400);
  }

  // Check if business exists
  const businessExists = await businessService.getBusinessById(businessId);
  if (businessExists.error) {
    throw new AppError('Business not found', 404);
  }
  
  const result = await financialAnalyticsService.generateFinancialSummary(businessId, months);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json(result.data);
}));

// Get business insights
router.get('/insights/:businessId', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  
  // Validate business ID
  if (!businessId) {
    throw new AppError('Business ID is required', 400);
  }

  // Check if business exists
  const businessExists = await businessService.getBusinessById(businessId);
  if (businessExists.error) {
    throw new AppError('Business not found', 404);
  }
  
  const result = await financialAnalyticsService.generateBusinessInsights(businessId);
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json(result.data);
}));

// Get financial records for a business
router.get('/business/:businessId', asyncHandler(async (req, res) => {
  const { businessId } = req.params;
  const { startDate, endDate } = req.query;
  
  // Validate business ID
  if (!businessId) {
    throw new AppError('Business ID is required', 400);
  }

  // Check if business exists
  const businessExists = await businessService.getBusinessById(businessId);
  if (businessExists.error) {
    throw new AppError('Business not found', 404);
  }

  // Validate date range
  const dateValidation = validationService.validateDateRange(
    startDate,
    endDate
  );
  
  if (dateValidation.error) {
    throw new AppError(dateValidation.error.message, 400);
  }
  
  const result = await businessService.getFinancialRecords(
    businessId,
    dateValidation.data.startDate,
    dateValidation.data.endDate
  );
  
  if (result.error) {
    throw new AppError(result.error.message, 400);
  }
  
  res.json(result.data);
}));

export const financialRoutes = router; 