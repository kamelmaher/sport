import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact-child',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-child.component.html',
  styleUrl: './contact-child.component.css'
})
export class ContactChildComponent {

  contactForm: FormGroup;
  isSubmitted = false;
  submitSuccess = false;
  submitError = false;

  contactInfo = {
    email: 'support@yoursite.com',
    phone: '+123 456 7890',
    address: 'شارع المثال، المدينة، البلد',
    hours: 'الأحد - الخميس: 9:00 صباحًا - 5:00 مساءً'
  };

  topicOptions = [
    { value: 'general', label: 'استفسار عام' },
    { value: 'technical', label: 'مشكلة تقنية' },
    { value: 'billing', label: 'استفسار حول الفواتير' },
    { value: 'partnership', label: 'اقتراح شراكة' },
    { value: 'feedback', label: 'تقديم ملاحظات' },
    { value: 'other', label: 'أخرى' }
  ];

  faqs = [
    {
      question: 'ما هي مواعيد الرد على الاستفسارات؟',
      answer: 'نسعى للرد على جميع الاستفسارات خلال 24 ساعة عمل. قد تستغرق الاستفسارات التقنية المعقدة وقتًا أطول.'
    },
    {
      question: 'هل يمكنني الاتصال بكم عبر الهاتف؟',
      answer: 'نعم، يمكنك الاتصال بنا عبر الهاتف خلال ساعات العمل الرسمية المذكورة أعلاه.'
    },
    {
      question: 'هل لديكم مكتب فعلي يمكنني زيارته؟',
      answer: 'نعم، يمكنك زيارة مكتبنا في العنوان المذكور. يفضل تحديد موعد مسبق لضمان توفر الفريق المناسب لمساعدتك.'
    },
    {
      question: 'كم تستغرق عملية الرد على الشكاوى؟',
      answer: 'نحن نأخذ جميع الشكاوى على محمل الجد ونسعى للرد عليها في غضون 48 ساعة. ستتلقى تأكيدًا فوريًا باستلام شكواك.'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.pattern('^[0-9+\\s]+$')]],
      topic: ['general', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  // Getter for easy access to form fields
  get f() {
    return this.contactForm.controls;
  }

  onSubmit() {
    this.isSubmitted = true;

    // Stop here if form is invalid
    if (this.contactForm.invalid) {
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // Simulate 90% success rate
      if (Math.random() > 0.1) {
        this.submitSuccess = true;
        this.submitError = false;
        this.contactForm.reset();
        this.isSubmitted = false;

        // Reset form state after showing success message
        setTimeout(() => {
          this.submitSuccess = false;
        }, 5000);
      } else {
        this.submitError = true;
        this.submitSuccess = false;
      }
    }, 1500);
  }

  toggleFaq(index: number): void {
    const faqElement = document.getElementById(`faq-${index}`);
    faqElement?.classList.toggle('active');
  }
}
