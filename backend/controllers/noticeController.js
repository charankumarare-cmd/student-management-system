import Notice from '../models/Notice.js';
import { getIsInMemory } from '../config/db.js';
import { mockData } from '../utils/mockStore.js';

export const getNotices = async (req, res) => {
  try {
    const { targetAudience } = req.query;

    if (getIsInMemory()) {
      let filtered = [...mockData.notices];
      if (targetAudience && targetAudience !== 'All') {
        filtered = filtered.filter(n => n.targetAudience === 'All' || n.targetAudience === targetAudience);
      }
      return res.json(filtered);
    }

    let query = {};
    if (targetAudience && targetAudience !== 'All') {
      query.targetAudience = { $in: ['All', targetAudience] };
    }

    const notices = await Notice.find(query).sort({ createdAt: -1 });
    res.json(notices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNotice = async (req, res) => {
  try {
    const { title, description, targetAudience, priority } = req.body;

    if (getIsInMemory()) {
      const newNotice = {
        _id: 'ntc_' + Date.now(),
        title,
        description,
        targetAudience: targetAudience || 'All',
        author: req.user?.role === 'teacher' ? 'Faculty Member' : 'Academic Office',
        date: new Date().toISOString().split('T')[0],
        priority: priority || 'Medium'
      };
      mockData.notices.unshift(newNotice);
      return res.status(201).json(newNotice);
    }

    const notice = await Notice.create({
      title,
      description,
      targetAudience,
      author: req.user?.role === 'teacher' ? 'Faculty Member' : 'Academic Office',
      date: new Date().toISOString().split('T')[0],
      priority
    });
    res.status(201).json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateNotice = async (req, res) => {
  try {
    if (getIsInMemory()) {
      const idx = mockData.notices.findIndex(n => n._id === req.params.id);
      if (idx === -1) return res.status(404).json({ message: 'Notice not found' });

      mockData.notices[idx] = { ...mockData.notices[idx], ...req.body };
      return res.json(mockData.notices[idx]);
    }

    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });

    Object.assign(notice, req.body);
    await notice.save();
    res.json(notice);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteNotice = async (req, res) => {
  try {
    if (getIsInMemory()) {
      mockData.notices = mockData.notices.filter(n => n._id !== req.params.id);
      return res.json({ message: 'Notice deleted successfully' });
    }

    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
