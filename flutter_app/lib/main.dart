import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'core/navigation/app_router.dart';
import 'core/theme/app_theme.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: MasariApp(),
    ),
  );
}

class MasariApp extends ConsumerWidget {
  const MasariApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final router = ref.watch(appRouterWithStateProvider);
    final locale = ref.watch(appLocaleProvider);
    final themeMode = ref.watch(appThemeModeProvider);

    return MaterialApp.router(
      title: 'MASARI PLATFORM | مساري',
      debugShowCheckedModeBanner: false,
      
      // Routing Configuration
      routerConfig: router,

      // RTL & Localization Config
      locale: locale,
      supportedLocales: const [
        Locale('ar', 'YE'), // Arabic (Default)
        Locale('en', 'US'), // English
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],

      // Theme Configurations from Design System
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      themeMode: themeMode,
    );
  }
}

// Global Providers for reactive locale & theme state
final appLocaleProvider = StateProvider<Locale>((ref) => const Locale('ar', 'YE'));
final appThemeModeProvider = StateProvider<ThemeMode>((ref) => ThemeMode.light);
final appCurrencyProvider = StateProvider<String>((ref) => 'USD');
