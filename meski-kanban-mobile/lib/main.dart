import 'package:flutter/material.dart';
import 'screens/login_screen.dart';

void main() {
  runApp(MeskiKanbanApp());
}

class MeskiKanbanApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'MESKİ Kanban',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        primaryColor: Color(0xFF006eae),
        colorScheme: ColorScheme.fromSeed(seedColor: Color(0xFF006eae)),
        useMaterial3: true,
      ),
      home: LoginScreen(),
    );
  }
}
