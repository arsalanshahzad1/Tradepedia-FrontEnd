// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiUrl: "https://admin.tradepedia.io/",
  imgUrl: "https://admin.tradepedia.io/userfiles/",
  referUrl: "https://admin.tradepedia.io/referral.php?param=",
  showConsole: true, // true or false
  decimalPoints: 6, // Decimal Points
  CurrCode: 'TRP', // Trade Currency Code
  googleProviderCode:"471507364347-k726pttipcmde4nb3hcohh2uuj8qh3ul.apps.googleusercontent.com",
  facebookProviderCode:"4978655182182744", // Old "517899083023932",
  stripeKey:"pk_test_51K9AZBL2MbD91dEfYwZ42ogOa7ATdAVoAFLCF9P8KwPrPC0t4mBA0hLcg3d36ozohfqYZPjYlK6GvY004wMtGGCM00rv9LXSIA", // Test Key
  //stripeKey:"pk_live_51K9AZBL2MbD91dEffMgAQeqFMp88fEYfPyYET4Vfu4p3oCLhH3EO3gELMq59rE0AQpBN8wOndnYV32pwxVa5Y5Ol00yRxkee4u", // Live Key
  userPasswordKey:"TradePedia@2022",
  quizQuestionCharLength:100,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
