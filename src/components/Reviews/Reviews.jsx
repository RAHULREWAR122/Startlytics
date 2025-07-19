
import React from 'react';
import Slider from 'react-slick';
import { Star, Quote } from 'lucide-react';
import { useThemeColor } from '@/hooks/themeColors';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const Reviews = () => {
  const { background, text } = useThemeColor();

   const reviewsData = [
    {
      id: 1,
      text: "Startlytics transformed how we analyze our user data. The AI insights helped us identify growth opportunities we never saw before.",
      author: "Sarah Johnson",
      role: "CEO, TechFlow",
      initials: "SJ",
      gradient: "from-blue-500 to-purple-600"
    },
    {
      id: 2,
      text: "The Google Sheets integration is seamless. We can now track our metrics in real-time without any manual work.",
      author: "Mike Chen",
      role: "Founder, DataViz",
      initials: "MC",
      gradient: "from-green-500 to-blue-600"
    },
    {
      id: 3,
      text: "Best investment for our startup. The weekly AI tips alone are worth the subscription price. Highly recommend!",
      author: "Alex Rodriguez",
      role: "Co-founder, GrowthLab",
      initials: "AR",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      id: 4,
      text: "The dashboard is incredibly intuitive. We went from confused about our data to making data-driven decisions in just one week.",
      author: "Emily Watson",
      role: "Product Manager, StartupX",
      initials: "EW",
      gradient: "from-orange-500 to-red-600"
    },
    {
      id: 5,
      text: "Amazing customer support and the CSV upload feature saved us hours of manual work. Game changer for our team!",
      author: "David Kim",
      role: "CTO, InnovateLab",
      initials: "DK",
      gradient: "from-teal-500 to-cyan-600"
    },
    {
      id: 6,
      text: "The AI-powered insights are incredibly accurate. It's like having a data analyst working 24/7 for our startup.",
      author: "Lisa Parker",
      role: "Founder, MetricsHub",
      initials: "LP",
      gradient: "from-indigo-500 to-purple-600"
    },
    {
      id: 7,
      text: "Startlytics helped us increase our conversion rate by 40%. The insights are actionable and easy to understand.",
      author: "Tom Wilson",
      role: "Marketing Director, GrowFast",
      initials: "TW",
      gradient: "from-rose-500 to-pink-600"
    },
    {
      id: 8,
      text: "The real-time analytics dashboard is a game-changer. We can now make decisions based on live data.",
      author: "Maria Garcia",
      role: "Head of Operations, ScaleUp",
      initials: "MG",
      gradient: "from-cyan-500 to-blue-600"
    }
  ];

  const settings = {
  infinite: true,
  speed: 5000,              // long duration makes it continuous
  autoplay: true,
  autoplaySpeed: 0,         // 0 to remove delay between transitions
  cssEase: "linear",        // no easing, just smooth linear motion
  slidesToShow: 3,          // responsive below
  slidesToScroll: 1,
  arrows: false,
  dots: false,
  pauseOnHover: false,
  swipe: false,             // disables swipe (optional for ticker feel)
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 2
      }
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1
      }
    }
  ]
};


  const ReviewCard = ({ review }) => (
    <div
      style={{ background: background.secondary }}
      className="bg-gray-800/50 backdrop-blur-sm shadow-lg h-[220px] mt-5 mb-4 rounded-2xl px-6 py-3  md:px-8 mx-2 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 group transform"
    >
      <div className="relative h-full flex flex-col justify-between ">
        <Quote className="absolute -top-2 -left-2 w-6 h-6 text-blue-400/30 transform rotate-180" />
        <div className="flex items-center mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 md:w-5 md:h-5 text-yellow-400 fill-current" />
          ))}
        </div>
        <p
          style={{ color: text.secondary }}
          className="text-gray-300 leading-relaxed text-sm md:text-base min-h-[80px]"
        >
          "{review.text?.length > 300 ? review?.text?.slice(0,100) : review?.text}"
        </p>
        <div className="flex items-center space-x-3">
          <div
            className={`w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r ${review.gradient} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
          >
            <span className="text-white font-bold text-xs md:text-sm">{review.initials}</span>
          </div>
          <div>
            <div style={{ color: text.secondary }} className="font-semibold text-sm md:text-base">
              {review.author}
            </div>
            <div style={{ color: text.muted }} className="text-gray-400 text-xs md:text-sm">
              {review.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <section id="testimonials" className="py-10 md:py-16  overflow-hidden w-full">
      <div className="w-full ">
        <div className="text-center mb-12 md:mb-16">
          <h2
            style={{ color: text.secondary }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6"
          >
            Loved by{' '}
            <span className="text-gradient bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Founders Worldwide
            </span>
          </h2>
          <p
            style={{ color: text.muted }}
            className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto px-4"
          >
            See what successful entrepreneurs are saying about Startlytics
          </p>
        </div>

        <Slider style={{padding : 10, background : '',  display :'flex'  , alignItems :'center' , width :'100%'}} {...settings}>
          {reviewsData.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </Slider>
      </div>
    </section>
  );
};

export default Reviews;
