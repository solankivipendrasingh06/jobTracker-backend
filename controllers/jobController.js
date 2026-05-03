const asyncHandler = require('express-async-handler');
const Job = require('../models/Job');

// @desc    Get jobs
// @route   GET /api/jobs
// @access  Private
const getJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ user: req.user.id }).sort('-createdAt');
  res.status(200).json(jobs);
});

// @desc    Set job
// @route   POST /api/jobs
// @access  Private
const setJob = asyncHandler(async (req, res) => {
  if (!req.body.company || !req.body.position) {
    res.status(400);
    throw new Error('Please add company and position fields');
  }

  const job = await Job.create({
    company: req.body.company,
    position: req.body.position,
    status: req.body.status || 'Applied',
    notes: req.body.notes || '',
    user: req.user.id,
  });

  res.status(201).json(job);
});

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the job user
  if (job.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedJob);
});

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  // Check for user
  if (!req.user) {
    res.status(401);
    throw new Error('User not found');
  }

  // Make sure the logged in user matches the job user
  if (job.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized');
  }

  await job.deleteOne();

  res.status(200).json({ id: req.params.id });
});

// @desc    Get job stats
// @route   GET /api/jobs/stats
// @access  Private
const getJobStats = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ user: req.user.id });

  const stats = {
    total: jobs.length,
    Applied: jobs.filter((job) => job.status === 'Applied').length,
    Interview: jobs.filter((job) => job.status === 'Interview').length,
    Offer: jobs.filter((job) => job.status === 'Offer').length,
    Rejected: jobs.filter((job) => job.status === 'Rejected').length,
  };

  res.status(200).json(stats);
});

module.exports = {
  getJobs,
  setJob,
  updateJob,
  deleteJob,
  getJobStats
};
