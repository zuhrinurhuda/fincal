import type { Metric } from 'web-vitals';
import { trackEvent } from '@/lib/analytics';

function sendMetric({ name, value, rating, id }: Metric) {
  trackEvent('web_vitals', {
    metric_name: name,
    metric_value: Math.round(name === 'CLS' ? value * 1000 : value),
    metric_rating: rating,
    metric_id: id,
  });
}

export function initWebVitals() {
  import('web-vitals').then(({ onCLS, onINP, onLCP, onFCP, onTTFB }) => {
    onCLS(sendMetric);
    onINP(sendMetric);
    onLCP(sendMetric);
    onFCP(sendMetric);
    onTTFB(sendMetric);
  });
}
