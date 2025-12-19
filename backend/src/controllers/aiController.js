const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const aiService = require('../services/aiService');
const WorkerProfile = require('../models/WorkerProfile');
const Booking = require('../models/Booking');

/**
 * Process natural language booking request and find matching workers
 */
const processBookingRequest = asyncHandler(async (req, res) => {
  const { message, location } = req.body;

  if (!message || message.trim().length < 10) {
    throw new ApiError(400, 'Please describe your problem in more detail (at least 10 characters)');
  }

  // Step 1: Use AI to understand the request
  const bookingDetails = await aiService.processBookingRequest(message, location);

  // Step 2: If confidence is low, ask clarifying questions
  if (bookingDetails.confidence < 0.6) {
    const questions = await aiService.generateClarifyingQuestions(bookingDetails);
    return res.status(200).json(
      new ApiResponse(200, {
        needsClarification: true,
        questions,
        partialDetails: bookingDetails,
      }, 'I need a bit more information to help you better')
    );
  }

  // Step 3: Find matching workers based on AI analysis
  const matchingWorkers = await findMatchingWorkers(bookingDetails, location);

  if (matchingWorkers.length === 0) {
    return res.status(200).json(
      new ApiResponse(200, {
        noWorkersFound: true,
        bookingDetails,
        suggestedCategories: await getSuggestedCategories(bookingDetails.serviceType),
      }, 'No workers found matching your requirements. Try browsing our service categories.')
    );
  }

  // Step 4: Select the best worker (highest rated, closest, most experienced)
  const bestWorker = selectBestWorker(matchingWorkers, bookingDetails);

  // Step 5: Generate booking summary
  const summary = await aiService.generateBookingSummary(bookingDetails, bestWorker);

  res.status(200).json(
    new ApiResponse(200, {
      bookingDetails,
      recommendedWorker: bestWorker,
      alternativeWorkers: matchingWorkers.slice(0, 3).filter(w => w._id.toString() !== bestWorker._id.toString()),
      summary,
      estimatedCost: calculateEstimatedCost(bestWorker, bookingDetails),
    }, 'Found the perfect worker for you!')
  );
});

/**
 * Find workers matching the AI-extracted criteria
 */
async function findMatchingWorkers(bookingDetails, userLocation) {
  const query = {
    isAvailable: true,
    verificationStatus: 'VERIFIED',
  };

  // Build search query
  const searchConditions = [];

  // Match by skills/keywords
  if (bookingDetails.keywords && bookingDetails.keywords.length > 0) {
    searchConditions.push({
      skills: {
        $in: bookingDetails.keywords.map(k => new RegExp(k, 'i'))
      }
    });
  }

  // Match by bio/description
  if (bookingDetails.problemDescription) {
    const problemKeywords = bookingDetails.problemDescription.split(' ')
      .filter(word => word.length > 3);
    
    if (problemKeywords.length > 0) {
      searchConditions.push({
        bio: {
          $regex: problemKeywords.join('|'),
          $options: 'i'
        }
      });
    }
  }

  // Match by location if provided
  if (userLocation) {
    searchConditions.push({
      location: {
        $regex: userLocation,
        $options: 'i'
      }
    });
  }

  if (searchConditions.length > 0) {
    query.$or = searchConditions;
  }

  const workers = await WorkerProfile.find(query)
    .populate('userId', 'firstName lastName email phone')
    .populate('category', 'name')
    .sort({ averageRating: -1, totalReviews: -1 })
    .limit(10)
    .lean();

  return workers;
}

/**
 * Select the best worker based on multiple factors
 */
function selectBestWorker(workers, bookingDetails) {
  return workers.sort((a, b) => {
    // Priority 1: Urgency - prefer workers with higher availability
    if (bookingDetails.urgency === 'emergency' || bookingDetails.urgency === 'high') {
      // Workers with more completed jobs are likely more responsive
      const aJobs = a.totalCompletedJobs || 0;
      const bJobs = b.totalCompletedJobs || 0;
      if (aJobs !== bJobs) return bJobs - aJobs;
    }

    // Priority 2: Rating (most important for quality)
    const aRating = a.averageRating || 0;
    const bRating = b.averageRating || 0;
    if (Math.abs(aRating - bRating) > 0.2) {
      return bRating - aRating;
    }

    // Priority 3: Number of reviews (reliability indicator)
    const aReviews = a.totalReviews || 0;
    const bReviews = b.totalReviews || 0;
    if (Math.abs(aReviews - bReviews) > 5) {
      return bReviews - aReviews;
    }

    // Priority 4: Experience
    const aExp = a.experience || 0;
    const bExp = b.experience || 0;
    if (aExp !== bExp) return bExp - aExp;

    // Priority 5: Price (lower is better if all else equal)
    const aRate = a.hourlyRate || 999999;
    const bRate = b.hourlyRate || 999999;
    return aRate - bRate;
  })[0];
}

/**
 * Calculate estimated cost based on duration and hourly rate
 */
function calculateEstimatedCost(worker, bookingDetails) {
  const hourlyRate = worker.hourlyRate || 0;
  let estimatedHours = 2; // default

  if (bookingDetails.estimatedDuration) {
    const match = bookingDetails.estimatedDuration.match(/(\d+)/);
    if (match) {
      estimatedHours = parseInt(match[0]);
    }
  }

  const minCost = hourlyRate * Math.max(1, estimatedHours - 1);
  const maxCost = hourlyRate * (estimatedHours + 1);

  return {
    hourlyRate,
    estimatedHours,
    minCost,
    maxCost,
    currency: 'INR',
  };
}

/**
 * Get suggested categories when no workers found
 */
async function getSuggestedCategories(serviceType) {
  const ServiceCategory = require('../models/ServiceCategory');
  
  const categories = await ServiceCategory.find({ isActive: true })
    .select('name description')
    .limit(5)
    .lean();

  return categories;
}

/**
 * Create booking from AI assistant
 */
const createAIBooking = asyncHandler(async (req, res) => {
  const { workerId, bookingDetails, scheduledDate, additionalNotes } = req.body;
  const customerId = req.user.userId;

  if (!workerId || !bookingDetails) {
    throw new ApiError(400, 'Worker and booking details are required');
  }

  const worker = await WorkerProfile.findById(workerId).populate('userId');
  if (!worker) {
    throw new ApiError(404, 'Worker not found');
  }

  // Create booking
  const booking = new Booking({
    customerId,
    workerId: worker.userId._id,
    serviceCategory: worker.category,
    title: `${bookingDetails.serviceType} - ${bookingDetails.problemDescription.substring(0, 50)}`,
    description: `${bookingDetails.problemDescription}\n\nUrgency: ${bookingDetails.urgency}\n${additionalNotes || ''}`,
    scheduledDate: scheduledDate || getDefaultScheduledDate(bookingDetails.preferredTimeframe),
    budget: calculateEstimatedCost(worker, bookingDetails).maxCost,
    status: 'PENDING',
  });

  await booking.save();

  res.status(201).json(
    new ApiResponse(201, { booking }, 'Booking created successfully! The worker will respond soon.')
  );
});

/**
 * Get default scheduled date based on timeframe
 */
function getDefaultScheduledDate(timeframe) {
  const now = new Date();
  
  switch (timeframe) {
    case 'today':
      return now;
    case 'tomorrow':
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
    case 'this-week':
      return new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() + 24 * 60 * 60 * 1000);
  }
}

module.exports = {
  processBookingRequest,
  createAIBooking,
};
