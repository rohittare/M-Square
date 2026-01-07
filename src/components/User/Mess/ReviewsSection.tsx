"use client"


import { useState } from "react";
import { Star, User, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Review {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
  avatar?: string;
}

interface ReviewsSectionProps {
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

const ReviewsSection = ({ averageRating, totalReviews, reviews }: ReviewsSectionProps) => {
  const [newReview, setNewReview] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmitReview = () => {
    if (newReview.trim()) {
      toast.success("Review submitted! Thank you for your feedback.")
      setNewReview("");
      setNewRating(5);
      setIsOpen(false);
    }
  };

  const StarRating = ({ rating, interactive = false, onRate }: { rating: number; interactive?: boolean; onRate?: (r: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} ${interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}`}
          onClick={() => interactive && onRate?.(star)}
        />
      ))}
    </div>
  );

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-yellow-100 p-2 rounded-xl">
              <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">Ratings & Reviews</h2>
              <p className="text-muted-foreground">What our customers say</p>
            </div>
          </div>

          {/* Write Review Button */}
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <MessageSquare className="w-4 h-4 mr-2" />
                Write a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Write a Review</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Your Rating</p>
                  <StarRating rating={newRating} interactive onRate={setNewRating} />
                </div>
                <Textarea
                  placeholder="Share your experience..."
                  value={newReview}
                  onChange={(e) => setNewReview(e.target.value)}
                  className="min-h-[120px]"
                />
                <Button onClick={handleSubmitReview} className="w-full bg-primary hover:bg-primary/90">
                  Submit Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Average Rating Card */}
        <div className="bg-card rounded-2xl shadow-soft p-6 mb-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-foreground mb-1">{averageRating}</div>
              <StarRating rating={Math.round(averageRating)} />
              <p className="text-muted-foreground text-sm mt-1">{totalReviews} reviews</p>
            </div>
            <div className="flex-1 space-y-2">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter(r => Math.round(r.rating) === star).length;
                const percentage = (count / reviews.length) * 100 || 0;
                return (
                  <div key={star} className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground w-3">{star}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-sm text-muted-foreground w-8">{count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-card rounded-xl shadow-soft p-4">
              <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  {review.avatar ? (
                    <img src={review.avatar} alt={review.userName} className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold text-foreground">{review.userName}</h4>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  <StarRating rating={review.rating} />
                  <p className="text-muted-foreground mt-2">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
