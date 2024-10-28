import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { ShopCategoryComponent } from './components/shop-category/shop-category.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CartComponent } from './pages/cart/cart.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { OrderConfirmationComponent } from './pages/order-confirmation/order-confirmation.component';
import { BlogDetailsComponent } from './components/blog-details/blog-details.component';
import { ProductListBrandComponent } from './components/product-list-brand/product-list.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'سكينيور - منتجات تجميل فاخرة',
      description: 'اكتشف مجموعة سكينيور من منتجات العناية بالبشرة والتجميل الفاخرة.',
      keywords: ['سكينيور', 'تجميل', 'بشرة', 'منتجات فاخرة', 'عناية بالبشرة'],
      image: 'assets/logo/logoblack.png',
    },
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'تسجيل الدخول - سكينيور',
      description: 'قم بتسجيل الدخول إلى حسابك في سكينيور وابدأ التسوق للحصول على منتجات التجميل الفاخرة.',
      keywords: ['سكينيور', 'تسجيل الدخول', 'منتجات تجميل', 'تسوق أونلاين', 'حساب سكينيور'],
    },
  },
  {
    path: 'signup',
    component: SignupComponent,
    data: {
      title: 'إنشاء حساب - سكينيور',
      description: 'أنشئ حسابًا جديدًا في سكينيور واستكشف أحدث عروض التجميل.',
      keywords: ['سكينيور', 'إنشاء حساب', 'منتجات تجميل', 'عروض الجمال', 'حساب جديد'],
    },
  },
  {
    path: 'shop/category/:categoryHandle',
    component: ProductListComponent,
    data: {
      title: 'التصنيفات - سكينيور',
      description: 'تصفح منتجات سكينيور حسب التصنيف للعثور على الحل المثالي لجمالك.',
      keywords: ['سكينيور', 'تصنيفات المنتجات', 'جمال', 'عناية بالبشرة', 'تسوق'],
    },
  },
  {
    path: 'brand/:brand',
    component: ProductListBrandComponent,
    data: {
      title: 'التصنيفات - سكينيور',
      description: 'تصفح منتجات سكينيور حسب التصنيف للعثور على الحل المثالي لجمالك.',
      keywords: ['سكينيور', 'تصنيفات المنتجات', 'جمال', 'عناية بالبشرة', 'تسوق'],
    },
  },
  {
    path: 'shop/product/:handle',
    component: ProductDetailsComponent,
    data: {
      title: 'تفاصيل المنتج - سكينيور',
      description: 'تعرف على معلومات تفصيلية حول هذا المنتج التجميلي الفاخر.',
      keywords: ['سكينيور', 'تفاصيل المنتج', 'منتجات تجميل', 'منتجات فاخرة', 'عناية شخصية'],
    },
  },
  {
    path: 'shop',
    component: ShopCategoryComponent,
    data: {
      title: 'التسوق حسب الفئات - سكينيور',
      description: 'استعرض جميع فئات المنتجات المتاحة في سكينيور.',
      keywords: ['سكينيور', 'تسوق', 'فئات المنتجات', 'تجميل', 'عناية بالبشرة'],
    },
  },
  {
    path: 'cart',
    component: CartComponent,
    data: {
      title: 'عربة التسوق - سكينيور',
      description: 'راجع المنتجات التي اخترتها في عربة التسوق قبل إتمام عملية الشراء.',
      keywords: ['سكينيور', 'عربة التسوق', 'منتجات تجميل', 'إتمام الشراء', 'تسوق أونلاين'],
    },
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    data: {
      title: 'الدفع - سكينيور',
      description: 'أكمل عملية الشراء بأمان على سكينيور.',
      keywords: ['سكينيور', 'الدفع', 'عملية الشراء', 'منتجات فاخرة', 'عناية بالبشرة'],
    },
  },
  {
    path: 'order-confirmation/:orderId',
    component: OrderConfirmationComponent,
    data: {
      title: 'تأكيد الطلب - سكينيور',
      description: 'شكرًا لك على طلبك! تم تأكيد عملية الشراء بنجاح.',
      keywords: ['سكينيور', 'تأكيد الطلب', 'شراء ناجح', 'منتجات تجميل', 'عناية شخصية'],
    },
  },
  {
    path: 'blog/:id',
    component: BlogDetailsComponent,
    data: {
      title: 'المدونة - سكينيور',
      description: 'ابقَ على اطلاع بآخر الأخبار والاتجاهات في مدونة سكينيور.',
      keywords: ['سكينيور', 'المدونة', 'أخبار الجمال', 'اتجاهات التجميل', 'نصائح العناية بالبشرة'],
    },
  },
  {
    path: '**',
    component: NotFoundComponent,
    data: {
      title: '404 - الصفحة غير موجودة',
      description: 'عذرًا! الصفحة التي تبحث عنها غير موجودة.',
      keywords: ['سكينيور', '404', 'الصفحة غير موجودة', 'خطأ', 'تسوق'],
    },
  },
];
