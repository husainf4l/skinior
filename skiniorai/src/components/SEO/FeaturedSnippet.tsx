"use client";

interface FeaturedSnippetProps {
  question: string;
  answer: string;
  type?: 'paragraph' | 'list' | 'table';
  items?: string[];
  locale?: string;
  className?: string;
}

export default function FeaturedSnippet({ 
  question, 
  answer, 
  type = 'paragraph', 
  items = [],
  locale = 'en',
  className = '' 
}: FeaturedSnippetProps) {
  const isRTL = locale === 'ar';

  return (
    <div className={`featured-snippet ${className}`}>
      <h2 className={`text-xl font-semibold mb-4 ${isRTL ? 'font-cairo text-right' : 'text-left'}`}>
        {question}
      </h2>
      
      {type === 'paragraph' && (
        <p className={`text-gray-700 leading-relaxed ${isRTL ? 'font-cairo text-right' : 'text-left'}`}>
          {answer}
        </p>
      )}
      
      {type === 'list' && items.length > 0 && (
        <div>
          <p className={`text-gray-700 mb-3 ${isRTL ? 'font-cairo text-right' : 'text-left'}`}>
            {answer}
          </p>
          <ol className={`list-decimal list-inside space-y-2 ${isRTL ? 'text-right' : 'text-left'}`}>
            {items.map((item, index) => (
              <li key={index} className={`text-gray-600 ${isRTL ? 'font-cairo' : ''}`}>
                {item}
              </li>
            ))}
          </ol>
        </div>
      )}
      
      {type === 'table' && (
        <div className="overflow-x-auto">
          <p className={`text-gray-700 mb-4 ${isRTL ? 'font-cairo text-right' : 'text-left'}`}>
            {answer}
          </p>
          {/* Table content would go here based on your data structure */}
        </div>
      )}
    </div>
  );
}

// Pre-built featured snippets for common skincare questions
export const SkincareSnippets = {
  en: [
    {
      question: "How to use AI skin analysis?",
      answer: "AI skin analysis works in 3 simple steps:",
      type: 'list' as const,
      items: [
        "Take a clear photo of your face in good lighting",
        "Upload the photo to Skinior's AI analysis tool", 
        "Receive personalized skincare recommendations based on your skin analysis"
      ]
    },
    {
      question: "What skin concerns can AI detect?",
      answer: "Our AI can accurately identify multiple skin concerns including acne, wrinkles, dark spots, pores, redness, and skin texture issues.",
      type: 'paragraph' as const
    },
    {
      question: "How accurate is AI skin analysis?",
      answer: "Skinior's AI achieves 95% accuracy in skin analysis, trained on over 50,000 dermatologist-validated images.",
      type: 'paragraph' as const
    }
  ],
  ar: [
    {
      question: "كيفية استخدام تحليل البشرة بالذكاء الاصطناعي؟",
      answer: "يعمل تحليل البشرة بالذكاء الاصطناعي في 3 خطوات بسيطة:",
      type: 'list' as const,
      items: [
        "التقط صورة واضحة لوجهك في إضاءة جيدة",
        "ارفع الصورة إلى أداة التحليل بالذكاء الاصطناعي من سكينيور",
        "احصل على توصيات مخصصة للعناية بالبشرة بناءً على تحليل بشرتك"
      ]
    },
    {
      question: "ما مشاكل البشرة التي يمكن للذكاء الاصطناعي اكتشافها؟", 
      answer: "يمكن للذكاء الاصطناعي تحديد مشاكل البشرة المتعددة بدقة شاملة حب الشباب والتجاعيد والبقع الداكنة والمسام والاحمرار ومشاكل ملمس البشرة.",
      type: 'paragraph' as const
    }
  ]
};