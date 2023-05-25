import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SwiperModule } from 'swiper/angular';
import { MaterialModule } from './material/material.module';

import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { SwipeModule } from 'ng-swipe';
import { NgApexchartsModule } from 'ng-apexcharts';
import { PdfViewerModule }  from  'ng2-pdf-viewer';
import { ShareButtonsModule } from 'ngx-sharebuttons/buttons';
import { ShareIconsModule } from 'ngx-sharebuttons/icons';

/** Rating **/
import { RatingModule } from 'ng-starrating';

import { PagesService } from './services/pages.service';
import { NotificationService } from './services/notification.service';
import { ThemeService } from './services/theme.service';
import { SignalsService } from './services/signals.service';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PathLocationStrategy, LocationStrategy } from '@angular/common';
import { QuizComponent } from './quiz/quiz.component';
import { EbooksComponent } from './ebooks/ebooks.component';
import { AcademyComponent } from './academy/academy.component';
import { ChapterListComponent } from './chapter-list/chapter-list.component';
import { ResearchComponent } from './research/research.component';
import { VideoGuideComponent } from './video-guide/video-guide.component';
import { HomeStudyCoursesComponent } from './home-study-courses/home-study-courses.component';
import { ToolsComponent } from './tools/tools.component';
import { SignalComponent } from './signal/signal.component';
import { ToolsDetailComponent } from './tools-detail/tools-detail.component';
import { HeatmapsComponent } from './heatmaps/heatmaps.component';
import { BlogComponent } from './blog/blog.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { NewsComponent } from './news/news.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { AnalysisDetailsComponent } from './analysis-details/analysis-details.component';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { FindProfileComponent } from './find-profile/find-profile.component';
import { AutotradeComponent } from './autotrade/autotrade.component';
import { CreateProfile1Component } from './create-profile1/create-profile1.component';
import { CreateProfile2Component } from './create-profile2/create-profile2.component';
import { CreateProfile3Component } from './create-profile3/create-profile3.component';
//import { CreateProfile4Component } from './create-profile4/create-profile4.component';
import { CreateProfile5Component } from './create-profile5/create-profile5.component';
import { CreateProfile6Component } from './create-profile6/create-profile6.component';
import { CreateProfile7Component } from './create-profile7/create-profile7.component';
import { ChapterDetailsComponent } from './chapter-details/chapter-details.component';
import { TranslationComponent } from './translation/translation.component';
import { VideoChapterListComponent } from './video-chapter-list/video-chapter-list.component';
import { HscChapterListComponent } from './hsc-chapter-list/hsc-chapter-list.component';
import { SignalListComponent } from './signal-list/signal-list.component';
import { SignalDetailComponent } from './signal-detail/signal-detail.component';
import { QuizResultComponent } from './quiz-result/quiz-result.component';
import { RecommendedProfileComponent } from './recommended-profile/recommended-profile.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { SeminarListComponent } from './seminar-list/seminar-list.component';
//import { SeminarDetailsComponent } from './seminar-details/seminar-details.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { CookiesPolicyComponent } from './cookies-policy/cookies-policy.component';
import { WalletComponent } from './wallet/wallet.component';
import { SharePointsComponent } from './share-points/share-points.component';
import { MyTransactionsComponent } from './my-transactions/my-transactions.component';
import { ProfileEditComponent } from './profile-edit/profile-edit.component';
import { AddMoneyComponent } from './add-money/add-money.component';
import { SignalPlanComponent } from './signal-plan/signal-plan.component';
import { BlogPlanComponent } from './blog-plan/blog-plan.component';
import { NotificationComponent } from './notification/notification.component';

import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import { GoogleLoginProvider, FacebookLoginProvider } from 'angularx-social-login';
import { PaymentProcessComponent } from './payment-process/payment-process.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';
import { NgxMaskModule, IConfig } from 'ngx-mask';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { ChatComponent } from './chat/chat.component';

import { SortByPipe } from './pipe/sort-by.pipe';
import { FilterPipe } from './pipe/filter.pipe';
import { NgMarqueeModule } from 'ng-marquee';
import { SquawkRoomComponent } from './squawk-room/squawk-room.component';
import { CopyTradingComponent } from './copy-trading/copy-trading.component';
import { SquawkRoomPlanComponent } from './squawk-room-plan/squawk-room-plan.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    QuizComponent,
    EbooksComponent,
    AcademyComponent,
    ChapterListComponent,
    ResearchComponent,
    VideoGuideComponent,
    HomeStudyCoursesComponent,
    ToolsComponent,
    SignalComponent,
    ToolsDetailComponent,
    HeatmapsComponent,
    BlogComponent,
    AnalysisComponent,
    NewsComponent,
    BlogDetailsComponent,
    AnalysisDetailsComponent,
    NewsDetailsComponent,
    MyProfileComponent,
    FindProfileComponent,
    AutotradeComponent,
    CreateProfile1Component,
    CreateProfile2Component,
    CreateProfile3Component,
    //CreateProfile4Component,
    CreateProfile5Component,
    CreateProfile6Component,
    CreateProfile7Component,
    ChapterDetailsComponent,
    TranslationComponent,
    VideoChapterListComponent,
    HscChapterListComponent,
    SignalListComponent,
    SignalDetailComponent,
    QuizResultComponent,
    RecommendedProfileComponent,
    LoginComponent,
    RegisterComponent,
    ChangePasswordComponent,
    ForgotPasswordComponent,
    SeminarListComponent,
    //SeminarDetailsComponent,
    PrivacyPolicyComponent,
    CookiesPolicyComponent,
    WalletComponent,
    SharePointsComponent,
    MyTransactionsComponent,
    ProfileEditComponent,
    AddMoneyComponent,
    SignalPlanComponent,
    BlogPlanComponent,
    NotificationComponent,
    PaymentProcessComponent,
    EmailVerificationComponent,
    MySubscriptionsComponent,
    NotificationSettingComponent,
    ChatComponent,
    SortByPipe,
    FilterPipe,
    SquawkRoomComponent,
    CopyTradingComponent,
    SquawkRoomPlanComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SwiperModule,
    HttpClientModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ShareButtonsModule,
    ShareIconsModule,
    PdfViewerModule,
    TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
    }),
    SwipeModule,
    NgApexchartsModule,
    RatingModule,
    BrowserAnimationsModule,
    SocialLoginModule, 
    NgxMaskModule.forRoot(), 
    NgMarqueeModule,    
  ],
  providers: [
    PagesService, NotificationService, ThemeService, SignalsService, 
    {
      provide: LocationStrategy, 
      useClass: PathLocationStrategy,
    },
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '471507364347-k726pttipcmde4nb3hcohh2uuj8qh3ul.apps.googleusercontent.com'
            ),
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider(
              //'545167243354511'
              '270272542059445'              
            )
          }
        ],
      } as SocialAuthServiceConfig,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/');
}
