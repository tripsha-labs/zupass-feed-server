/**
 * @name - Booking schema
 * @description - This is the mongoose booking schema.
 */
import mongoose, { Schema } from 'mongoose';

const bookingSchema = new mongoose.Schema(
  {
    // First two required for create booking
    tripId: { type: Schema.Types.ObjectId, index: true },
    memberId: { type: Schema.Types.ObjectId, index: true },
    onwerId: { type: Schema.Types.ObjectId, index: true },
    stripePaymentMethod: { type: Object },
    /**
     * Adding crypto payment info here
     */
    cryptoPaymentMethod: { type: Object },
    cryptoPaymentOptions: { type: Object },
    lastCryptoFailReason: { type: String },
    paymentMethod: { type: String },
    onwerStripeId: { type: String },
    memberStripeId: { type: String },
    lastPaymentDate: { type: Number },
    bookingSubmissionDate: { type: Number },
    registeredDate: { type: Number },
    // booking details
    currency: { type: String, default: 'US' },
    attendees: { type: Number, default: 1 },
    rooms: { type: Array, default: [] },
    questions: { type: Array, default: [] },
    addOns: { type: Array, default: [] },
    guests: { type: Array, default: [] },
    message: { type: String },
    reason: { type: String },
    comments: { type: Array, default: [] },
    paymentStatus: {
      type: String,
      enum: ['full', 'deposit', 'payasyougo', 'free'],
    },
    paymentMethodType: { type: String },
    serviceFee: { type: Number, default: 0 },
    deposit: { type: Object },
    discount: { type: Object },
    discounts: { type: Array },
    coupon: { type: Object },
    status: {
      type: String,
      enum: [
        'invite-pending',
        'invite-sent',
        'invite-accepted',
        'invite-declined',
        'invite-maybe',
        'pending',
        //this is status for crypto bookings that are accepted but not yet charged
        'paymentPending',
        'approved',
        'declined',
        'withdrawn',
        'expired',
        'canceled',
        'removed',
      ],
      default: 'invite-pending',
      index: true,
    },
    // Payment details
    totalBaseFare: { type: Number, default: 0 },
    totalAddonFare: { type: Number, default: 0 },
    discountBaseFare: { type: Number, default: 0 },
    discountAddonFare: { type: Number, default: 0 },
    totalFare: { type: Number, default: 0 },
    currentDue: { type: Number, default: 0 },
    paidAmout: { type: Number, default: 0 },
    pendingAmount: { type: Number, default: 0 },
    platformDiscount: { type: Number, default: 0 },
    paymentHistory: { type: Array, default: [] },
    addedByHost: { type: Boolean, default: false },
    tripPaymentType: { type: String },
    is48hEmailSent: { type: Boolean, default: false },
    is24hEmailSent: { type: Boolean, default: false },
    autoChargeDate: { type: Number },
    paymentRetryCount: { type: Number, default: 0 },
    paymentError: { type: Object },
    isAutoPayEnabled: { type: Boolean, default: true },
    bookingExpireOn: { type: Number, default: 3 },
    customFields: { type: Object },
  },
  {
    timestamps: true,
    versionKey: false,
    strict: true,
  }
);

export const Booking =
  mongoose.models.Booking || mongoose.model('Booking', bookingSchema);
