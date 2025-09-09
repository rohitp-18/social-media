import mongoose, { Schema, Document } from "mongoose";

export interface ISearchHistory extends Document {
  user: mongoose.Schema.Types.ObjectId; // Reference to the user who made the search
  query: string; // The search query string
  suggest: boolean; // Indicates if the search was a suggestion
  createdAt: Date; // Timestamp for when the search was made
}

const searchHistorySchema = new Schema<ISearchHistory>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    query: {
      type: String,
      required: true,
      trim: true,
    },
    suggest: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Automatically manage createdAt
  }
);

const SearchHistory = mongoose.model<ISearchHistory>(
  "searchHistory",
  searchHistorySchema
);

export default SearchHistory;
