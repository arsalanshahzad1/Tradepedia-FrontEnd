import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PreloadAllModules } from '@angular/router';
import { AcademyComponent } from './academy/academy.component';
import { AnalysisDetailsComponent } from './analysis-details/analysis-details.component';
import { AnalysisComponent } from './analysis/analysis.component';
import { AutotradeComponent } from './autotrade/autotrade.component';
import { BlogDetailsComponent } from './blog-details/blog-details.component';
import { BlogComponent } from './blog/blog.component';
import { ChapterListComponent } from './chapter-list/chapter-list.component';
import { CreateProfile1Component } from './create-profile1/create-profile1.component';
import { CreateProfile2Component } from './create-profile2/create-profile2.component';
import { CreateProfile3Component } from './create-profile3/create-profile3.component';
//import { CreateProfile4Component } from './create-profile4/create-profile4.component';
import { CreateProfile5Component } from './create-profile5/create-profile5.component';
import { CreateProfile6Component } from './create-profile6/create-profile6.component';
//import { CreateProfile7Component } from './create-profile7/create-profile7.component';
import { EbooksComponent } from './ebooks/ebooks.component';
import { FindProfileComponent } from './find-profile/find-profile.component';
import { HeatmapsComponent } from './heatmaps/heatmaps.component';
import { HomeStudyCoursesComponent } from './home-study-courses/home-study-courses.component';

import { HomeComponent } from './home/home.component';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { NewsDetailsComponent } from './news-details/news-details.component';
import { NewsComponent } from './news/news.component';
import { QuizComponent } from './quiz/quiz.component';
import { QuizResultComponent } from './quiz-result/quiz-result.component';
import { ResearchComponent } from './research/research.component';
import { SignalComponent } from './signal/signal.component';
import { ToolsDetailComponent } from './tools-detail/tools-detail.component';
import { ToolsComponent } from './tools/tools.component';
import { VideoGuideComponent } from './video-guide/video-guide.component';
import { ChapterDetailsComponent } from './chapter-details/chapter-details.component';
import { VideoChapterListComponent } from './video-chapter-list/video-chapter-list.component';
import { HscChapterListComponent } from './hsc-chapter-list/hsc-chapter-list.component';
import { SignalListComponent } from './signal-list/signal-list.component';
import { SignalDetailComponent } from './signal-detail/signal-detail.component';
import { CustomPreloadingStrategyService } from './custom-preloading-strategy.service';
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
import { PaymentProcessComponent } from './payment-process/payment-process.component';
import { EmailVerificationComponent } from './email-verification/email-verification.component';
import { MySubscriptionsComponent } from './my-subscriptions/my-subscriptions.component';
import { NotificationSettingComponent } from './notification-setting/notification-setting.component';
import { ChatComponent } from './chat/chat.component';
import { CopyTradingComponent } from './copy-trading/copy-trading.component';
import { SquawkRoomComponent } from './squawk-room/squawk-room.component';
import { SquawkRoomPlanComponent } from './squawk-room-plan/squawk-room-plan.component';


const routes: Routes = [
  {path: '', component: HomeComponent, data: { animation: 'home'}},
  {path: 'home', component: HomeComponent, data: { animation: 'home'}},
  {path: 'quiz/:type/:ebookCode/:code/:lang', component: QuizComponent},
  {path: 'quiz/:type/:code/:lang', component: QuizComponent},
  {path: 'quiz/:type/:code', component: QuizComponent},
  {path: 'quiz-result/:type/:ebookCode/:code/:lang', component: QuizResultComponent},
  {path: 'quiz-result/:type/:resultID', component: QuizResultComponent},
  {path: 'academy/ebooks', component: EbooksComponent},
  {path: 'academy/ebooks/:code', component: EbooksComponent},
  //{path: 'academy', component: AcademyComponent, data: { animation: 'academy'}},
  {path: 'academy', component: AcademyComponent, data: { animation: 'academy'}},
  {path: 'academy/chapter-list/:code/:lang', component: ChapterListComponent},
  {path: 'academy/chapter-details/:code', component: ChapterDetailsComponent},
  {path: 'research', component: ResearchComponent, data: { animation: 'research'}},
  {path: 'academy/video-guide/:code/:lang', component: VideoGuideComponent},
  {path: 'academy/video-chapter-list', component: VideoChapterListComponent},
  {path: 'academy/video-chapter-list/:code/:lang', component: VideoChapterListComponent},
  {path: 'academy/home-study-courses/:code/:lang', component: HomeStudyCoursesComponent},
  {path: 'academy/hsc-chapter-list', component: HscChapterListComponent},
  {path: 'academy/hsc-chapter-list/:code', component: HscChapterListComponent},
  {path: 'academy/seminar-list', component: SeminarListComponent},
  //{path: 'academy/seminar-details/:code/:lang', component: SeminarDetailsComponent},
  {path: 'tools', component: ToolsComponent, data: { animation: 'tools'}},
  {path: 'tools/:type', component: ToolsComponent, data: { animation: 'tools'}},
  {path: 'tools/:type/:code/:lang', component: ToolsComponent, data: { animation: 'tools'}},
  //{path: 'tools/:code/:lang', component: ToolsComponent, data: { animation: 'tools'}},
  {path: 'tools/tools-details/:code/:lang', component: ToolsDetailComponent},
  {path: 'signal', component: SignalComponent, data: { animation: 'signal'}},
  {path: 'research/heatmaps', component: HeatmapsComponent},
  {path: 'research/market-report', component: BlogComponent},
  {path: 'research/market-report-details/:code/:lang', component: BlogDetailsComponent},  
  {path: 'research/analysis', component: AnalysisComponent},
  {path: 'research/analysis-details/:code/:lang', component: AnalysisDetailsComponent},
  {path: 'research/news', component: NewsComponent},
  {path: 'research/news-details/:code/:lang', component: NewsDetailsComponent},
  {path: 'research/copy-trading', component: CopyTradingComponent},
  {path: 'research/squawk-room', component: SquawkRoomComponent},
  {path: 'squawk-plan', component: SquawkRoomPlanComponent},
  {path: 'signal/my-profile', component: MyProfileComponent},
  {path: 'signal/signal-list/:code', component: SignalListComponent},
  {path: 'signal/signal-detail/:code', component: SignalDetailComponent},
  {path: 'signal/recommended-profile', component: RecommendedProfileComponent},
  {path: 'signal/create-profile1', component: CreateProfile1Component},
  {path: 'signal/create-profile2', component: CreateProfile2Component},
  {path: 'signal/create-profile3', component: CreateProfile3Component},
  //{path: 'signal/create-profile4', component: CreateProfile4Component},
  {path: 'signal/create-profile5', component: CreateProfile5Component},
  {path: 'signal/create-profile6', component: CreateProfile6Component},
  //{path: 'signal/create-profile7', component: CreateProfile7Component},
  {path: 'signal/find-profile', component: FindProfileComponent},
  {path: 'signal/autotrade', component: AutotradeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'account/change-password', component: ChangePasswordComponent},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'privacy-policy', component: PrivacyPolicyComponent},
  {path: 'cookies-policy', component: CookiesPolicyComponent},
  {path: 'wallet', component: WalletComponent},
  {path: 'wallet/:code', component: WalletComponent},
  {path: 'share-points', component: SharePointsComponent},
  {path: 'my-transactions', component: MyTransactionsComponent},
  {path: 'account/my-profile', component: ProfileEditComponent},
  {path: 'account/my-subscriptions', component: MySubscriptionsComponent},
  {path: 'add-money', component: AddMoneyComponent},  
  {path: 'signal-plan', component: SignalPlanComponent},
  {path: 'blog-plan', component: BlogPlanComponent},
  {path: 'notification', component: NotificationComponent},
  {path: 'account/notification-setting', component: NotificationSettingComponent},
  {path: 'home/payment-process', component: PaymentProcessComponent},
  {path: 'email-verification/:code', component: EmailVerificationComponent},
  {path: 'chat', component: ChatComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
