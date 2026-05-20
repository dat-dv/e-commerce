export interface FAQItem {
  q: string;
  a: string;
}

export interface FAQTopic {
  name: string;
  icon: string;
  faqs: FAQItem[];
}
