const Inquiry = require('../models/Inquiry');
const Car = require('../models/Car');
const appEvents = require('../events/appEvents');
const eventTypes = require('../events/eventTypes');

class InquiryService {
  static async createInquiry(inquiryData, userId = null) {
    const car = await Car.findById(inquiryData.carId);
    if (!car) {
      const error = new Error('Vehicle not found.');
      error.statusCode = 404;
      throw error;
    }

    const inquiry = await Inquiry.create({
      user: userId,
      car: inquiryData.carId,
      name: inquiryData.name,
      email: inquiryData.email,
      phone: inquiryData.phone,
      message: inquiryData.message
    });

    appEvents.emit(eventTypes.INQUIRY_CREATED, {
      inquiryId: inquiry._id,
      carTitle: car.title,
      name: inquiry.name,
      email: inquiry.email
    });

    return await Inquiry.findById(inquiry._id).populate('car', 'title brand model price images');
  }

  static async getUserInquiries(userId, userEmail = null) {
    // Search inquiries by user ID OR by email (for guest inquiries)
    const queryConditions = [{ user: userId }];
    
    // Only add email condition if email is provided
    if (userEmail) {
      queryConditions.push({ 
        email: userEmail,
        user: null // Only include guest inquiries
      });
    }
    
    const query = { $or: queryConditions };
    
    return await Inquiry.find(query).populate('car', 'title brand model price images').sort('-createdAt');
  }

  static async getAllInquiries(status = null) {
    const filter = status ? { status } : {};
    return await Inquiry.find(filter)
      .populate('car', 'title brand model price images')
      .populate('user', 'name email phone')
      .sort('-createdAt');
  }

  static async updateInquiryStatus(id, status, dealerResponse = '') {
    const inquiry = await Inquiry.findById(id);
    if (!inquiry) {
      const error = new Error('Inquiry not found.');
      error.statusCode = 404;
      throw error;
    }

    inquiry.status = status;
    if (dealerResponse) inquiry.dealerResponse = dealerResponse;

    await inquiry.save();
    return inquiry;
  }

  static async linkGuestInquiriesToUser(userId, userEmail) {
    // Find all guest inquiries (user: null) with matching email and link them to the user
    const result = await Inquiry.updateMany(
      { 
        email: userEmail,
        user: null  // Only link guest inquiries
      },
      { 
        $set: { user: userId } 
      }
    );
    
    return result.modifiedCount; // Return number of inquiries linked
  }
}

module.exports = InquiryService;
