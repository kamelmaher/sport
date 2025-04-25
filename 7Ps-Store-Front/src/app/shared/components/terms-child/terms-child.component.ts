import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-terms-child',
  imports: [CommonModule],
  templateUrl: './terms-child.component.html',
  styleUrl: './terms-child.component.css'
})
export class TermsChildComponent {

  lastUpdated: string = '20 مارس 2025';

  terms = [
    {
      title: 'قبول الشروط',
      content: 'باستخدامك لموقعنا، فإنك توافق على الالتزام بهذه الشروط والأحكام بشكل كامل. إذا كنت لا توافق على هذه الشروط والأحكام أو أي جزء منها، فيجب عليك عدم استخدام هذا الموقع.'
    },
    {
      title: 'التغييرات على الشروط',
      content: 'نحتفظ بالحق في تعديل أو استبدال هذه الشروط في أي وقت وفقًا لتقديرنا الخاص. من مسؤوليتك التحقق من هذه الصفحة بشكل دوري للتعرف على التغييرات. استمرارك في استخدام الموقع بعد نشر أي تعديلات يشكل قبولًا لتلك التغييرات.'
    },
    {
      title: 'استخدام المحتوى',
      content: 'جميع المحتويات المنشورة على هذا الموقع تخضع لحقوق النشر والملكية. لا يُسمح بإعادة إنتاج أو توزيع أو إعادة نشر أو بيع أي جزء من هذا الموقع أو محتوياته دون إذن كتابي صريح منا.'
    },
    {
      title: 'حسابات المستخدمين',
      content: 'عند إنشاء حساب لدينا، يجب عليك تقديم معلومات دقيقة وكاملة وحديثة في جميع الأوقات. أنت مسؤول عن الحفاظ على سرية معلومات حسابك وكلمة المرور وتقييد الوصول إلى جهاز الكمبيوتر الخاص بك.'
    },
    {
      title: 'السلوك المحظور',
      content: 'يُحظر استخدام موقعنا لأي غرض غير قانوني أو محظور، أو التسبب في ضرر أو تعطيل الموقع أو الخوادم أو الشبكات المتصلة بالموقع، أو انتهاك أي قوانين أو لوائح معمول بها.'
    },
    {
      title: 'إخلاء المسؤولية',
      content: 'يتم توفير الموقع والمحتوى "كما هو" دون أي ضمانات من أي نوع، صريحة أو ضمنية. لا نتحمل أي مسؤولية عن أي أضرار ناتجة عن استخدام موقعنا.'
    },
    {
      title: 'القانون الحاكم',
      content: 'تخضع هذه الشروط والأحكام وتفسر وفقًا للقوانين المعمول بها في بلدنا، وتخضع أي نزاعات تنشأ عن استخدام الموقع للاختصاص القضائي الحصري للمحاكم المختصة.'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  printTerms(): void {
    window.print();
  }

  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
