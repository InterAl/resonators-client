import fetcher from './fetcher';

export function sendContactForm({ formData }) {
    return fetcher.post('/contactForm', formData);
}
